var inquirer = require("inquirer");
var mysql = require("mysql");

var Table = require("cli-table");

var cart = [];
var userTotal = 0;

// ---------- mySQL connection ----------  //
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazonDB"
});

connection.connect(function(err) {
	if (err) {
		console.error("error connecting: " + err.stack);
	}
	console.log("connected as id " + connection.threadId);

	console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
	console.log(" 			Welcome to Gen's Bamazon Store");
	console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
	
	menu();
});


// -----
function menu() {



	inquirer.prompt([
		{
			type: "list",
			name: "search",
			message: "What would u like to do today?", 
			choices: ["Browse Inventory", "Add to Cart", "View Cart", "Checkout", "Quit"]
		}
	]).then(function (choice) {
		selection = choice.search;

		switch(selection) {
			case "Browse Inventory":
				browseInventory();
				break;

			case "Add to Cart":
				addToCart();
				break;

			case "View Cart":
				viewCart();
				break;

			case "Checkout":
				checkout();
				break;

			case "Quit":
				console.log("Thanks for coming to Gen's Bamazon! Have a good day. Bye!");
				process.exit();
		}
	});
}




function browseInventory() {
	connection.query("SELECT * FROM products", function(err, data) {
		if (err) throw err;

		//console.log(data);

		var t = new Table({
			head: ["ID", "Product Name", "Department", "Price ($)", "Stock Quantity"]
		});

		for (var i = 0; i < data.length; i++) {
			t.push([data[i].id, data[i].productName, data[i].departmentName, data[i].price.toFixed(2), data[i].stockQuantity]);
		}

		console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
		console.log(" 				Gen's Bamazon Store");
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");

		console.log(t.toString());

		menu();
	});
}



function addToCart() {
	connection.query("SELECT * FROM products", function(err, data) {
		if (err) throw err;

		//console.log(data);
		inquirer.prompt([
			{
				type: "input",
				name: "inputID",
				message: "What is the ID of the product you would like to buy?",
				validate: function(value) {
					if (isNaN(value) == false && value < (data.length + 1)) {
						return true;
					}
					 else {
						console.log("\nInvalid ID, try typing again\n");
						return false;					}
				}
			}
		]).then(function(res) {
			itemId = res.inputID;
			databaseIndex = itemId - 1;

			//console.log(data[databaseIndex]);

			item = data[databaseIndex].productName;
			department = data[databaseIndex].departmentName;
			cost = data[databaseIndex].price;
			itemInStock = data[databaseIndex].stockQuantity;

			inquirer.prompt([
				{
					type: "input",
					name: "units",
					message: "How many " + item + " would you like to purchase?",
					validate: function(value){
						if (isNaN(value) == false && parseInt(value) !== 0 && parseInt(value) <= itemInStock) {
							return true
						} 
						else if (parseInt(value) === 0 || isNaN(value) == true) {
							console.log("\nError, input a non-zero amount\n");
							return false;
						}
						else {
							console.log("\nInsufficient quantity! We only have " + itemInStock + " left in our inventory. \n");
							return false;
						}
					}
				}					
			]).then(function(res2) {
				units = res2.units;
				cart.push({
					item: item,
					department: department,
					units: units,
					cost: cost,
					total: units * cost
				});
				console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
				console.log("				Item has been added to your cart.");
				console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");

				menu();
			})
		});	
	});
}





function viewCart() {
	if(cart.length !== 0) {
		console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
		console.log("					Your Cart");
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
		var c = new Table({
			head: ["Product Name","Department","Price($)","User Quantity", "Total"],
			colWidths: [26, 17, 11, 15, 9]
		});

		
		for (var i = 0; i < cart.length; i++) {
			c.push([cart[i].item, cart[i].department, cart[i].cost.toFixed(2), cart[i].units, cart[i].total.toFixed(2)]);
		}
		console.log(c.toString());

		menu();
	}
	else {
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
		console.log("			Empty Cart\n");
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
		menu();

	}

}

function checkout() {
	if(cart.length !== 0) {
		console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
		console.log("				Ready for Checkout?");
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
		var c = new Table({
			head: ["Product Name","Department","Price($)","User Quantity", "Total"],
			colWidths: [26, 17, 11, 15, 9]
		});

		
		for (var i = 0; i < cart.length; i++) {
			c.push([cart[i].item, cart[i].department, cart[i].cost.toFixed(2), cart[i].units, cart[i].total.toFixed(2)]);
			userTotal += cart[i].total;

		}
		console.log(c.toString());
		console.log("The total cost is: $" + userTotal.toFixed(2));

		inquirer.prompt([
			{
				type: "confirm",
				name: "checkout",
				message: "Are you ready to check out?",
				default: true
			}

		]).then(function(res3) {
			if (res3.checkout === true) {
				updateDB(userTotal);
			}
			else {
				console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
				console.log("				Decided to shop more? ");
				console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
				menu();
			}
		});
	}
	else {
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
		console.log("		Nothing to Check out...\n");
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
		menu();

	}
}

function updateDB(userTotal) {
	var userItem = cart.shift();
	// console.log(userItem);

	var itemName = userItem.item;
	var userUnits = userItem.units;
	var itemTotal = userItem.total;
	
	//console.log(itemName);
	connection.query("SELECT stockQuantity, productSales FROM products WHERE productName=?", [itemName], function(err,res) {
		var currentQuantity = res[0].stockQuantity;
		var currentSales = res[0].productSales;

		connection.query("UPDATE products SET stockQuantity=?, productSales=? WHERE productName=?", [currentQuantity -= userUnits, currentSales += itemTotal, itemName], function(err,res2) {
			if(err) throw err;
			//console.log("updated\n");

			if (cart.length != 0) {
				updateDB(userTotal);
				}	
			else {
				console.log("Your total today was $" + userTotal.toFixed(2));
				console.log("Thank you for shopping at Gen's Bamazon Store and have a great day!");

				connection.end();		        	
	      	}
		});
	});
}