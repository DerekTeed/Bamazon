var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  // Your port
  port: 8889,
  // Your username
  user: "root",
  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  selectAll();
});


// function to handle posting new items up for auction
function bamazonBid() {
    // prompt to let customer pick item and quantity
    inquirer
      .prompt([
        {
            name: "product_id",
            type: "input",
            message: "What product would you like to purchase? Enter its product_ID."
          },
          {
            name: "purchase_quantity",
            type: "input",
            message: "How many units would you like to purchase?",
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
          "SELECT * FROM bamazonBid WHERE product_id=?", [answer.product_id],
          function(err, res) {
            if (err) throw err;
            console.log("Your auction was created successfully!");
            console.log(res);
            if (res[0].stock_quantity >= answer.purchase_quantity) {
                //purchase function only works when I have all 5 parameters in purchase()
                purchase(res[0].stock_quantity, answer.product_id, answer.purchase_quantity, res[0].price, res[0].product_name);
                console.log("RECEIPT:")
                console.log("You purchased: " + answer.purchase_quantity + " " + res[0].product_name);
                console.log("Your total cost is $" + (parseInt(answer.purchase_quantity) * res[0].price));
            } else {
                console.log("Insufficient Quantity")
            }
          }
        );
      });
  } //end of bamazonBid()

//start selectAll() to select entire table database from sql
function selectAll () {
    connection.query(
        "SELECT * FROM bamazonBid",
        function(err, res) {
            if (err) throw err;
            console.log(res);
            bamazonBid();
        }
    )
}//end selectAll()


//start purchase function to subtract from stock quantity.
function purchase(stockQuantity, id, quantity, price) {
    newQuantity = parseInt(stockQuantity) - parseInt(quantity);
    connection.query (
        "UPDATE bamazonBid SET ? WHERE ?",
        [
            {stock_quantity: newQuantity},
            {product_id: id},
          ],
    )
}//end purchase()
