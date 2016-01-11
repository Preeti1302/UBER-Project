
var util = require("util");
var mysql = require('./mysql');
var ejs = require('ejs');

function handle_request(msg, callback){
	var res={};
	console.log("in signup handle req"+ msg);
	var loginUser = "select * from customers where email ='" + msg.email + "'";
	console.log(loginUser);
	if (msg.email != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("there");
			} else {
				if (user.length > 0) {
					console.log("Account already exists");
					res.code="200";
					res.value = "Success validation";
				}
				else {
					console.log("here it is");
					console.log(msg.first_name);
					var inserted ="insert into customers(firstName,lastName,zipCode,phoneNumber,email,creditCardDetails,password) VALUES('" + msg.first_name + "'" + ",'" + msg.last_name + "'" + ",'" + msg.billing_zip +"'" + ",'" + msg.contact + "'" + ",'" + msg.email +"'" + ",'" + msg.card_number + "'" + ",'" + msg.password +"')";
					mysql.insertData(function(err, user1) {
						if (err) {
							throw err;
						} else {
							if (user1 != undefined) {
								console.log(user1);
								console.log("valid signup");
								res.code="200";
								res.user=user1;
								console.log(res.code);
								console.log(res.user);
								res.value = "Success SignUp";

							} else {
								res.code="401";								
							}						
						}callback(null,res);

					}, inserted);
				}
			}	

		},loginUser);		
	}

}


exports.handle_custLogin= function (msg, callback){
	var res={};
	console.log("heloooo");
	loginCust = "select * from customers where email ='" + msg.email + "' and password = '"+msg.password+"'";
	console.log(loginCust);
	if (msg.email != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("there");
			} else {
				if (user.length > 0) {
					console.log("Account exists");
					res.code="200";
					res.user=user;
					res.value = "Success validation";
				}
				else {
					res.code="401";
					res.value="Failed Login";
				}
			}		

			callback(null, res);
		},loginCust);		
	}
}



exports.handle_request = handle_request;



