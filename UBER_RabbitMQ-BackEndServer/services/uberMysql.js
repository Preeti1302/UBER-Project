var mysql = require('./mysql');
var ejs = require('ejs');



//handlenotify_request

function handlenotify_request(msg, callback){
	var res={};

	loginUser = "select * from rides where driverID ='" + msg.email + "' and rideStatus='started'";
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
				}
			}	
		},loginUser);		
	}

}

function handle_request(msg, callback){
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
					var inserted = "insert into drivers (firstName, lastName, emailID ,phoneNumber,password,city, address, state, zipCode) values('"+msg.fName + "'" + ",'" + msg.lName + "'" + ",'" + msg.email + "'" +",'"+msg.contact + "'"+",'" + msg.password +  "'"+",'" + msg.cityName + "'" + ",'" + msg.address + "'" + ",'" + msg.state + "'" +",'"+msg.zip_code + "')";

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

function handle_driverLogin(msg, callback){
	var res={};
	console.log("heloooo");
	loginDriver = "select * from drivers where emailID ='" + msg.email + "' and password = '"+msg.password+"'";
	console.log(loginDriver);

	if (msg.email != undefined) {

		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("there");
			} else {
				if (user.length > 0) {
					console.log("Account exists");
					var rideStatus="select * from rides where driverID='"+msg.email+"' and rideStatus  = 'started'";
					mysql.fetchData(function(err, user1) {
						if (err) {
							throw err;
							console.log("there");
						} else {
							if (user1.length > 0) {
								console.log("Account exists");
								res.code="200";
								res.user=user1;
								res.value = "Success validation";
							}
							else {
								res.code="300";
								res.user=user;
								res.value = "Success validation";
							}
						}	callback(null, res);	
					},rideStatus);
				}
				else {
					res.code="401";
					res.value="Failed Login";
				}
			}		
			
		},loginDriver);		
	}
}

function handle_vehicleValidation(msg, callback){
	var res={};
	console.log("heloooo");
	vehicleNumber = "update drivers set carDetails = '"+ msg.vehicle +"' where emailID ='" + msg.email+"'";
	console.log(vehicleNumber);
	if (msg.email != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("vehicle is here");
			} else {
				if(user!=undefined){
					console.log("Data updated successfully");
					res.code="200";
					res.user=user;
					res.value = "Successfully updated";
				}
				else {
					res.code="401";
					res.value="Failed Login";
				}
			}		

			callback(null, res);
		},vehicleNumber);		
	}
}

function handle_SSNValidation(msg, callback){
	var res={};
	console.log("heloooo");
	SSN = "update drivers set idDriver = '"+ msg.SSN +"' where emailID ='" + msg.email+"'";
	console.log(SSN);
	if (msg.email != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("vehicle is here");
			} else {
				if(user!=undefined){
					console.log("Data updated successfully");
					res.code="200";
					res.user=user;
					res.value = "Successfully updated";
				}
				else {
					res.code="401";
					res.value="Failed Login";
				}
			}		

			callback(null, res);
		},SSN);		
	}
}



function handle_editDriver(msg, callback){
	var res={};
	console.log("heloooo");
	SSN = "update drivers set idDriver = '"+ msg.ssn  +"', phoneNumber='"+ msg.contact +"', address='"+msg.address +"', city='"+msg.cityName+"',state = '"+msg.state +"',zipCode = '"+msg.zip_code +"',carDetails = '"+msg.carDetails +"' ,emailID = '"+msg.email +"' where emailID ='" + msg.pastEmail+"'";
	console.log(SSN);
	if (msg.email != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("vehicle is here");
			} else {
				if(user!=undefined){
					console.log("Data updated successfully");
					//res.code="200";
					res.value = "Successfully updated";
					//res.user=user;
					///
					loginDriver = "select * from drivers where emailID ='" + msg.email +"'";
					console.log(loginDriver);
					mysql.fetchData(function(err, user1) {
						if (err) {
							throw err;
							console.log("there");
						} else {
							if (user1.length > 0) {
								console.log("Account exists");
								res.code="200";
								res.user=user1;
								//res.value = "Success validation";
								console.log(user1);
							}
							else {
								res.code="401";
								res.value="Failed Login";
							}
						}		

						callback(null, res);
					},loginDriver);		
				}
				else {
					res.code="401";
					res.value="Failed Login";
				}
			}		
		},SSN);		
	}
}

//ride history for driver
function handle_DrRideHistory_queue(msg, callback){
	var res={};
	console.log("heloooo");
	rides = "select * from rides where driverID ='" + msg.pastEmail+"' and rideStatus='finished'";
	console.log(rides);
	if (msg.pastEmail != undefined) {
		mysql.fetchData(function(err, user) {
			if (err) {
				throw err;
				console.log("rides is here");
			} else {
				if(user.length>0){
					//console.log("Data updated successfully");
					res.code="200";
					res.value = "Successfully fetched rides";
					res.user=user;
				}
				else {
					res.code="401";
					res.value="Failed Login";
				}
			}		
			callback(null, res);
		},rides);		
	}
}
exports.handle_SSNValidation=handle_SSNValidation;
exports.handle_request = handle_request;
exports.handlenotify_request = handlenotify_request;
exports.handle_driverLogin = handle_driverLogin;
exports.handle_vehicleValidation = handle_vehicleValidation;
exports.handle_editDriver=handle_editDriver;
exports.handle_DrRideHistory_queue=handle_DrRideHistory_queue;
