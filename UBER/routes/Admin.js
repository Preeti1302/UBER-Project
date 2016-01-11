var ejs = require("ejs");
var mongo = require('./mongo');
var mongoose = require('mongoose');
var mq_client = require('../rpc/client');
var mysql = require('./mysql');
var Grid = require('gridfs-stream');
var fs=require('fs');
var mongo=require("../routes/mongo");
mongoURL = 'mongodb://localhost:27017/rideImage';


///Admin Sign in

exports.redirectToAdminLogin=function(req,res) {
	
	ejs.renderFile('./views/Admin/SignIn_Admin.ejs',function(err, result) {
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
	
};

exports.AdminHome=function(req,res) {
	
	if(req.session.Admin){
	ejs.renderFile('./views/Admin/AdminHome.ejs',function(err, result) {
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
	else{}
		
};

exports.addDriverPage=function(req,res) {
	
	if(req.session.Admin){
	ejs.renderFile('./views/Admin/AddDriverProfile.ejs',function(err, result) {
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
	else{}
		
};

exports.viewDriver=function(req,res) {
	
	if(req.session.Admin){
	ejs.renderFile('./views/Admin/ViewDriverProfile.ejs',function(err, result) {
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
	else{}
		
};


exports.addCustomerPage=function(req,res) {
	
	if(req.session.Admin){
	ejs.renderFile('./views/Admin/AddCustomerProfile.ejs',function(err, result) {
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
	else{}
		
};


//Admin Login
exports.AdminSignin=function(req, res) {

	var emailid = req.param("email");
	var password = req.param("password");
	if(emailid=="Admin@gmail.com" && password=="Admin")
		{
		console.log("valid Login");
		req.session.Admin="Admin@gmail.com";
		res.send({"login":"Success"});
		}
	else {    

		console.log("Invalid Login");
		res.send({"login":"Fail"});

	}
};

exports.driverAdminSignIn=function (req, res) {
	var fName = req.param("first_name");
	var lName = req.param("last_name");
	var emailid = req.param("email");
	var contact = req.param("contact");
	var password = req.param("password");
	var address = req.param("address");
	var cityName = req.param("city");
	var state = req.param("state");
	var carDetails = req.param("vehicle");
	var ssn = req.param("ssn");
	var zip_code = req.param("zip");
	//console.log(fName + lName + emailid + contact + password + address + cityName + state+ zip_code);
	if(fName!=undefined && fName!=undefined && lName!=undefined && emailid!=undefined && contact!=undefined && password!=undefined && zip_code!=undefined && cityName!=undefined && state!=undefined&& carDetails!=undefined && ssn!=undefined && password!=undefined)
	{
		console.log("here");
		var msg_payload = { "fName": fName, "lName":lName, "email":emailid, "contact":contact,"password": password,"address":address,"cityName":cityName, "state":state,"zip_code":zip_code, "carDetails":carDetails,"ssn":ssn };

		mq_client.make_request('adminDriver_queue',msg_payload, function(err,results){

			console.log("Hi"+JSON.stringify(results.code));
			if(err){
				throw err;
			}
			else 
			{
				console.log("value of status code at client is : "+results.code);
				if(results.code == 200){
					req.session.username=results.user;
					console.log("valid Login");
					ejs.renderFile('./views/Admin/AddDriverProfile.ejs',function(err, result) {
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
				else if(results.code == 401) {    

					console.log("Invalid Login");
					res.send({"signup":"Fail"});
				}
			}  
		});
	}
};
