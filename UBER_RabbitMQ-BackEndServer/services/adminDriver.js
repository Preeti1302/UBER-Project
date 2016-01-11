var mysql = require('./mysql');
var ejs = require('ejs');

exports.handle_addDriverRequest= function(msg, callback){
	var res={};

	loginUser = "select * from drivers where emailID ='" + msg.email + "'";
	console.log(loginUser);
	if (msg.email != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
			} else {
				if (user.length > 0) {
					console.log("Account already exists");
					res.code="200";
					res.user=user;
					res.value = "Success validation";
				}
				else {
					console.log("here it is");
					var inserted = "insert into drivers (idDriver, firstName, lastName, emailID ,phoneNumber,password,city, address, state, zipCode, carDetails) values('"+msg.ssn+" ' "+",'"+msg.fName + "'" + ",'" + msg.lName + "'" + ",'" + msg.email + "'" +",'"+msg.contact + "'"+",'" + msg.password +  "'"+",'" + msg.cityName + "'" + ",'" + msg.address + "'" + ",'" + msg.state + "'" +",'"+msg.zip_code +"'"+",'" + msg.carDetails + "')";

					mysql.insertData(function(err, user1) {
						if (err) {
							throw err;
						} else {
							if (user1 != undefined) {
								console.log(user1);
								console.log("valid Login");
								res.user1 = user1;
								res.code="200";
								console.log("****************This is the res.code******************");
								console.log(res.code);
								res.value = "Success SignUp";
							} else {

								res.code="401";
							}						
						}
						callback(null, res);
					}, inserted);
				}
			}	
		},loginUser);		
	}

}

