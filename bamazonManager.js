var inquirer = require("inquirer");

var mysql = require("mysql");

var Table = require("cli-table");


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
	console.log(" 				Welcome Manager!");
	console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");
	
	menu();
});



function menu() {



	inquirer.prompt([
		{
			type: "list",
			name: "search",
			message: "What would u like to do today?", 
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
		}
	]).then(function (choice) {
		selection = choice.search;

		switch(selection) {
			case "View Products for Sale":
				viewProducts();
				break;

			case "View Low Inventory":
				lowInventory();
				break;

			case "Add to Inventory":
				addInventory();
				break;

			case "Add New Product":
				addProduct();
				break;

			case "Quit":
				console.log("Good Bye Manager!");
				process.exit();
		}
	});
}


function viewProducts() {
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
		console.log(" 				Gen's Bamazon Inventory");
		console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");

		console.log(t.toString());

		menu();
	});
}


function lowInventory() {
	connection.query("SELECT * FROM products WHERE stockQuantity < 5", function(err, data) {
		if (err) throw err;
		//console.log(data);
		if (data.length !== 0) {
			var l = new Table({
				head: ['ID Number', 'Product', 'Department', 'Price', 'Quantity Available']
			});
			
			for (var i = 0; i < data.length; i++) {
				l.push([data[i].id, data[i].productName, data[i].departmentName, '$' + data[i].price.toFixed(2), data[i].stockQuantity]);
			}
			console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
			console.log(" 			These items are low on inventory");
			console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
			console.log(l.toString());

			menu();

		}
		else {
			console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
			console.log(" 		There is currently no items low on inventory!!");
			console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		

			menu();
		}
	});
}

function addInventory() {

	connection.query("SELECT * FROM products", function(err, data) {
		if (err) throw err;

		//console.log(data);
		inquirer.prompt([
			{
				type: "input",
				name: "inputID",
				message: "Please enter product ID",
				validate: function(value) {
					if (isNaN(value) == false && value < (data.length + 1)) {
						return true;
					}
					 else {
						console.log("\nInvalid ID, try typing again\n");
						return false;
					}
				}
			}
		]).then(function(res) {
			itemId = res.inputID;
			databaseIndex = itemId - 1;

			//console.log(data[databaseIndex]);

			item = data[databaseIndex].productName;
			itemInStock = data[databaseIndex].stockQuantity;
			inquirer.prompt([
				{
					type: "input",
					name: "addUnits",
					message: "How much inventory would you like to add?",
					validate: function(value) {
						if (isNaN(value) == false) {
							return true
						} 
						else if (parseInt(value) === 0 || isNaN(value) == true) {
							console.log("\nError, input a non-zero amount\n");
							return false;
						}
					}
				}					
			]).then(function(res2) {
				addUnits = parseInt(res2.addUnits);
				newQuantity = itemInStock + addUnits;

				connection.query("UPDATE products SET stockQuantity=? WHERE id=?",[newQuantity, itemId],function(err,data2) {
					console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
					console.log(item + "'s inventory has been updated to a quantity of " + newQuantity);
					console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");		
					menu();
				});
			});
		});
	});
}

function addProduct() {
	inquirer.prompt([
		{
			type: 'input',
			name: 'productName',
			message: 'Please enter the new product name.',
		},
		{
			type: 'input',
			name: 'departmentName',
			message: 'Which department does the new product belong to?',
		},
		{
			type: 'input',
			name: 'price',
			message: 'What is the price per unit?',
			validate: function(value) {
				if (isNaN(value) == false) {
					return true
				} 
				else {
					console.log("\nError, input a non-zero amount\n");
					return false;
				}
			}
		},
		{
			type: 'input',
			name: 'stockQuantity',
			message: 'How many items are in stock?',
			validate: function(value) {
				if (isNaN(value) == false) {
					return true
				} 
				else {
					console.log("\nError, input a non-zero amount\n");
					return false;
				}
			}
		},
		{
			name: 'productSales',
		    type: 'input',
		    message: "Input 0 as product Sales for this department",
			validate: function(value) {
				if (isNaN(value) == false && parseInt(value) === 0) {
					return true
				} 
				else {
					console.log("\nEnter 0\n");
					return false;
				}
			}
		}

	]).then(function(newProduct) {
		console.log(newProduct);
		connection.query("INSERT INTO products SET ?",[newProduct],function(err,data) {
			console.log("\n- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");		
			console.log("New product has been added to the inventory.");
			console.log("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -\n");		

			menu();
		});
	});
}