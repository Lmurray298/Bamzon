var inquirer = require("inquirer");
var mysql = require("mysql");


var PORT = 3306;


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password:"",
    database: "bamazon"

});

function promptUserPurchase(){
    console.log("working")

    inquirer.prompt([
        {
            type: "input",
            name: "item_id",
            message: " Please enter Item ID",
            validate: validateInput,
            filter: Number
        },
        {
            type: "input",
            name: "quanity",
            message: "how many do you need",
            validate: validateInput,
            filter: Number
        }

    ]).then(function(input){
        var item= input.item_id;
        var quanity = input.quanity;

        var queryStr = "SELECT * FROM prducts WHERE ?";

        connection.query(queryStr, {item_id: item}, function(err, data){
            if (err) throw err;

            if(data.length === 0){
                console.log("Error: Invalid Id");
                displayInventory();

            } else{
                var productData = data[0];

                if (quanity <= productData.stock_quanity){
                    console.log("It is in stock");

                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

                    connection.query(updateQueryStr, function(err, data){
                        if (err) throw err;

                        console.log("Order has been placed. Your total is $ Your total is $" + productData.price * quantity);
                        console.log('Thank you for shopping with us!');
                        console.log("\n---------------------------------------------------------------------\n");
                        
                        connection.end();
                    })
                } else {
					console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
					console.log('Please modify your order.');
					console.log("\n---------------------------------------------------------------------\n");

					displayInventory();
				}
			}
		})
    })

}
function displayInventory() {
	

	queryStr = 'SELECT * FROM products';

	
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

	  	
	  	promptUserPurchase();
	})
}


function runBamazon() {
	displayInventory();
}

runBamazon();


 


