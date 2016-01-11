var session = require('client-sessions');

var mq_client = require('../rpc/client');
var util = require("util");
var http = require('http');
var ejs = require('ejs');
var mysql = require('./mysql');
var driverID=null;


exports.signup_Cust =	function (req,res) {

	ejs.renderFile('./views/Signin_Customer.ejs',function(err, result) {
		// render on success
		if (!err) {
			res.end(result);
		}
		// render or error
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
}	

exports.signup = function(req,res)
{	
	var email= req.param("email");
	var password = req.param("password");
	var first_name = req.param("first_name");
	var last_name=req.param("last_name");
	var contact = req.param("contact");
	var card_number = req.param("card_number") ;
	var card_code = req.param("card_code") ;
	var card_expiration_month = req.param("card_expiration_month") ;
	var card_expiration_year = req.param("card_expiration_year") ;
	var billing_zip = req.param("billing_zip") ;
	console.log("signup client");
	var msg_payload = { "email": email, "password": password,"first_name" :first_name ,"last_name" : last_name, "contact" : contact, "card_number" : card_number, "card_code" : card_code, "card_expiration_month" : card_expiration_month, "card_expiration_year" : card_expiration_year, "billing_zip" : billing_zip};
	mq_client.make_request('signup_queue', msg_payload, function(err,result){
		console.log("result in client %j",result.user);
		if(err){
			throw err;
		}
		else 
		{
			if(result.code == 200){
				console.log("valid signup");
				console.log(res.code);
				req.session.username=res.user;
				console.log(req.session.username);
				res.send({"signup":"Success"});
			}
			else {    

				console.log("Invalid signup");
				res.send({"signup":"Fail"});
			}
		}  
	});
};

//Customer Login
exports.customerLog = function(req, res) {

	var emailid = req.param("email");
	var password = req.param("password");

	var msg_payload = {"email":emailid, "password": password};

	mq_client.make_request('customerLog_queue',msg_payload, function(err,results){

		console.log("Hi"+JSON.stringify(results.user));
		if(err){
			throw err;
		}
		else 
		{
			console.log("value of status code at client is : "+results.code);
			if(results.code == 200){
				console.log("valid Login");
				req.session.username=results.user;
				console.log(JSON.stringify(req.session.username));
				res.send({"login":"Success"});


			}
			else if(results.code == 401) {    

				console.log("Invalid Login");
				res.send({"login":"Fail"});

			}
		}  
	});

};

exports.redirectToCustHome =function (req,res) {

	if(req.session.username){
		ejs.renderFile('./views/Customer/customerHome.ejs',function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});
	}
}




//Function which gets the nearest driver location from the map and gets the related driverid from db 
exports.locationdestDriver=function(req,res) {

	var dest = req.param("dest");
	
	console.log("Driver is at:")
	console.log(dest);
	
	
	var query ="select * from drivers where Location='"+dest+"'";
	console.log("Executing the query : ");
	console.log(query);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
			console.log("error occured " + err.message);
		}
		else 
		{
			console.log("successfull!\n");
			console.log(JSON.stringify(results));
			console.log(JSON.stringify(results[0].emailID));
			console.log(JSON.stringify(results[0].firstName));
			driverID=results[0].emailID;
			req.session.RidedriverID=(JSON.stringify(results));
			req.session.RidedriverName=(JSON.stringify(results[0].firstName));
			
			console.log("*******");
			console.log(req.session.RidedriverID);
		}  
	},query);
}


//Function which gets Source,Destination & Distance from the map and the passes these values to the ride table
exports.locationdest=function(req,res) {

	var dest = req.param("dest");
	var src = req.param("src");
	var dist=req.param("dist");
	console.log("Destination is :");
	console.log(dest)
	console.log("Source is:");
	console.log(src);
	console.log("Distance is:");
	console.log(dist);
	/// billing algo
	
	var fixedrate=2.35;
	var distrecieved=dist/1000*0.62;
	var total =distrecieved*2.35;
	console.log(total);
//	if(CURDATE)
	
	
	///
	console.log("driver id is..........."+driverID);
	
	console.log("IN LOCATION DEST*********"+req.session.RidedriverID);
	console.log("customer session"+JSON.stringify(req.session.username));
	var msg_payload = { "dest": dest, "src": src, "dist" :dist,"driverID" : driverID, "riderID" :req.session.username[0].email,"rideCost":total };
   mq_client.make_request('bookride_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
			throw err;
		}
		else 
		{
        
			if(results.code == 200){
				console.log("valid Login");
				
				res.send({"login":"Success"});
			}
			
			
			else {    
				
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
			
		}  
	});

}
