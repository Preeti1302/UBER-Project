var mysql = require('./mysql');
var ejs = require('ejs');


function handle_bookride(msg, callback){
	var res={};
	console.log(msg.riderID+msg.driverID);
	var inserted = "insert into billinginfo (date,pickupTime,distanceCovered,sourceAddress,destinationAddress,driverID,customerID,rideCost) values(CURDATE(),CURRENT_TIMESTAMP,'"+msg.dist+"','"+msg.src+"','"+msg.dest+"','"+msg.driverID+"','"+msg.riderID+"',"+msg.rideCost+")";

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
								///
								var inserted1 = "insert into rides (pickUpLocation,dropOffLocation,DateTime,driverID,customerID,rideStatus) values('"+msg.src+"','" + msg.dist+"',CURRENT_TIMESTAMP,'"+msg.driverID+"','"+msg.riderID+"','started')";
console.log(inserted1);
								mysql.insertData(function(err, user2) {
									if (err) {
										throw err;
									} else {
										if (user2 != undefined) {
											console.log(user2);
											console.log("valid Login");
											//res.user1 = user1;
											//res.code="200";
											console.log("****************This is the res.code******************");
											//console.log(res.code);
										//	res.value = "Success SignUp";
										} else {

											//res.code="401";
										}						
									}
									
								}, inserted1);

								
								///
								
								
							} else {

								res.code="401";
							}						
						}
						callback(null, res);
					}, inserted);
			
					
					
	}



exports.handle_bookride=handle_bookride;
