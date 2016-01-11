var ejs = require("ejs");
var mongo = require('./mongo');
var mongoose = require('mongoose');
var mq_client = require('../rpc/client');
var mysql = require('./mysql');
var Grid = require('gridfs-stream');
var fs=require('fs');
var mongo=require("../routes/mongo");
mongoURL = 'mongodb://localhost:27017/rideImage';

var drID=null;
///Driver Sign Up
function driverSignIn(req, res) {
	var fName = req.param("first_name");
	var lName = req.param("last_name");
	var emailid = req.param("email");
	var contact = req.param("contactinfo");
	var password = req.param("password");
	var address = req.param("address");
	var cityName = req.param("city_name");
	var state = req.param("state");
	var zip_code = req.param("zip_code");
	console.log(fName + lName + emailid + contact + password + address + cityName + state+ zip_code);
	if(fName!=undefined && fName!=undefined && lName!=undefined && emailid!=undefined && contact!=undefined && password!=undefined && zip_code!=undefined && cityName!=undefined && state!=undefined)
	{
		console.log("here");
		var msg_payload = { "fName": fName, "lName":lName, "email":emailid, "contact":contact,"password": password,"address":address,"cityName":cityName, "state":state,"zip_code":zip_code };

		mq_client.make_request('uber_queue',msg_payload, function(err,results){

			console.log("Hi"+JSON.stringify(results.code));
			if(err){
				throw err;
			}
			else 
			{
				console.log("value of status code at client is : "+results.code);
				if(results.code == 200){
					//req.session.username=results.user;
					console.log("valid Login");
					res.send({"signup":"Success"});

				}
				else if(results.code == 401) {    

					console.log("Invalid Login");
					res.send({"signup":"Fail"});
				}
			}  
		});
	}
};
///// notification



exports.myFunction=	function (req, res) {


	var msg_payload = {"email":req.session.username[0].emailID};

	mq_client.make_request('notify_queue',msg_payload, function(err,results){

		console.log("Hi......"+JSON.stringify(results.user));
		if(err){
			throw err;
		}
		else 
		{
			console.log("value of status code at client is : "+results.code);
			if(results.code == 200){
				console.log("valid Login");
				//req.session.username=results.user;
				res.send({"login":"Success"});


			}
			else if(results.code == 401) {    

				console.log("Invalid Login");
				res.send({"login":"Fail"});

			}
		}  
	});

};


////
//Redirect to driver Login page
function redirectToDrLogin(req,res) {

	
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		ejs.renderFile('./views/SignIn_Driver.ejs',function(err, result) {
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

//Driver Login
function driverLog(req, res) {

	var emailid = req.param("email");
	var password = req.param("password");

	var msg_payload = {"email":emailid, "password": password};

	mq_client.make_request('driverLog_queue',msg_payload, function(err,results){

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
				drID=results.user;
				res.send({"login":"SuccessWoR"});
			}
			else if(results.code == 300) {    

				console.log("valid Login with ride");
				req.session.username=results.user;
				res.send({"login":"Success"});
			}
			else if(results.code == 401){
				console.log("Invalid Login");
				res.send({"login":"Fail"});
			}
		}  
	});

};

//Redirect to driver Home page
function redirectToDrHome(req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username[0].approveStatus == "approved"){
			ejs.renderFile('./views/DriverHome.ejs',{data:req.session.username},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});			
		}
		else {
			ejs.renderFile('./views/DriverHomePage.ejs',{data:req.session.username},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});				
		}
	}
	else{
		res.redirect('/');
	}
};

//Redirect to driver profile
exports.redirectToDrProfile = function (req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username){
			ejs.renderFile('./views/DriverProfile.ejs',{data:req.session.username},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});			
		}
	}
	else{
		res.redirect('/');
	}
};
//Redirect to editing the profile
exports.redirectToDrEditProfile = function (req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username){
			ejs.renderFile('./views/EditDriverProfile.ejs',{data:req.session.username},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});			
		}
	}
	else{
		res.redirect('/');
	}
};
//Edits driver profile
exports.saveDriverProfile=function (req, res) {
	var ssn = req.param("ssn");
	var emailid = req.param("email");
	var contact = req.param("contact");
	var carDetails = req.param("carDetails");
	var address = req.param("address");
	var cityName = req.param("city_name");
	var state = req.param("state");
	var zip_code = req.param("zip_code");
	var pastEmail = req.session.username[0].emailID;
	console.log(contact + carDetails + address + cityName + state+ zip_code+emailid);
	if(ssn!=undefined && contact!=undefined && carDetails!=undefined && zip_code!=undefined && cityName!=undefined && state!=undefined)
	{
		console.log("here");
		var msg_payload = { "ssn":ssn, "email":emailid, "contact":contact,"carDetails": carDetails,"address":address,"cityName":cityName, "state":state,"zip_code":zip_code , "pastEmail":pastEmail };

		mq_client.make_request('editDriver_queue',msg_payload, function(err,results){

			console.log(JSON.stringify(results.code));
			console.log(JSON.stringify(results.user));
			if(err){
				throw err;
			}
			else 
			{
				console.log("value of status code at client is : "+results.code);
				if(results.code == 200){
					console.log("New user set to session");
					req.session.username1=results.user;
					console.log(JSON.stringify(req.session.username1));
					console.log("valid Login");
					res.send({"signup":"Success"});

				}
				else if(results.code == 401) {    

					console.log("Invalid Login");
					res.send({"signup":"Fail"});
				}
			}  
		});
	}
};

//rideHistory
exports.goToRideHistory=function(req,res)
{
	var pastEmail = req.session.username[0].emailID;
	
	if(pastEmail!=undefined)
	{
		console.log("here");
		var msg_payload = {"pastEmail":pastEmail };

		mq_client.make_request('DrRideHistory_queue',msg_payload, function(err,results){

			console.log(JSON.stringify(results.code));
			console.log(JSON.stringify(results.user));
			if(err){
				throw err;
			}
			else 
			{
				console.log("value of status code at client is : "+results.code);
				if(results.code == 200){
					console.log("store fetched data in session");
					req.session.DrrideHistory=results.user;
					console.log(JSON.stringify(req.session.username1));
					console.log(JSON.stringify(req.session.DrrideHistory));
					console.log("valid Login");
					res.send({"ride":"Success"});

				}
				else if(results.code == 401) {    

					console.log("Invalid driver");
					res.send({"ride":"Fail"});
				}
			}  
		});
	}
}

exports.redirectToDrWOR = function (req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username){
			ejs.renderFile('./views/DriverHomeRide.ejs',{data:req.session.username,data1:req.session.DrrideHistory},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});			
		}
	}
	else{
		res.redirect('/');
	}
};

//Redirect to driver profile
exports.redirectToDrRideHistory = function (req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username){
			ejs.renderFile('./views/DrRideHistory.ejs',{data:req.session.username,data1:req.session.DrrideHistory},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});			
		}
	}
	else{
		res.redirect('/');
	}
};


//Redirect to driver profile
exports.redirectToDrNewProfile = function (req,res) {

	if(req.session.username1){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		if(req.session.username1){
			ejs.renderFile('./views/DriverProfile.ejs',{data:req.session.username1},function(err, result) {
				// render on success
				if (!err) {
					res.end(result);
					console.log("Session:  "+JSON.stringify(req.session.username1));

				}
				// render or error
				else {
					res.end('An error occurred');
					console.log(err);
				}
			});			
		}
	}
	else{
		res.redirect('/');
	}
};

function signUp(req,res) {

	ejs.renderFile('./views/SignUp.ejs',function(err, result) {
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

function mainLogin(req,res) {

	ejs.renderFile('./views/Main_Login.ejs',function(err, result) {
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


function signUpCust(req,res) {

	ejs.renderFile('./views/Customer/signup_Customer.ejs',function(err, result) {
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

function index(req,res) {

	ejs.renderFile('./views/HomePage.ejs',function(err, result) {
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



function user(req,res) {

	ejs.renderFile('./views/DriverHomePage.ejs',{data:req.session.username},function(err, result) {
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

//Vehicle Validation and update in table
function vehiclecheck(req,res) {
	var vehicleNum = req.param("vehicle");
	var data = req.session.username;
	var email =data[0].emailID;
	console.log(email);
	if(vehicleNum!=undefined){
		var msg_payload = { "vehicle": vehicleNum , "email":email};
		console.log("itheeeeeee "+JSON.stringify(msg_payload));
		mq_client.make_request('vehicle_queue',msg_payload, function(err,results){

			console.log("Hi"+JSON.stringify(results.code));
			if(err){
				throw err;
			}
			else 
			{
				console.log("value of status code at client is : "+results.code);
				if(results.code == 200){
					console.log("Vehicle added");
					res.send({"vehicle":"Success"});

				}
				else if(results.code == 401) {    

					console.log("Invalid Login");
					res.send({"vehicle":"Fail"});
				}
			}  
		});
	}
};

//Redirect to driver background
function redirectToBackground(req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		ejs.renderFile('./views/BackgroundCheck.ejs',{data:req.session.username},function(err, result) {
			// render on success
			if (!err) {
				res.end(result);
				console.log("Session in vehicle:  "+JSON.stringify(req.session.username));
			}
			// render or error
			else {
				res.end('An error occurred');
				console.log(err);
			}
		});	
	}
	else{
		res.redirect('/');
	}
};

//Background Check
function backgroundcheck(req,res) {

	var SSN = req.param("ssn1")+req.param("ssn2")+req.param("ssn3");
	var data = req.session.username;
	var email =data[0].emailID;
	console.log(email);
	if(req.param("ssn1")!=undefined && req.param("ssn2")!=undefined && req.param("ssn3")!=undefined)
	{

		var msg_payload = { "SSN": SSN , "email":email};
		console.log(JSON.stringify(msg_payload));
		mq_client.make_request('SSN_queue',msg_payload, function(err,results){

			console.log("Hi"+JSON.stringify(results.code));
			if(err){
				throw err;
			}
			else 
			{
				console.log("value of status code at client is : "+results.code);
				if(results.code == 200){
					console.log("SSN added");
					res.send({"ssn":"Success"});

				}
				else if(results.code == 401) {    

					console.log("Invalid SSN");
					res.send({"ssn":"Fail"});
				}
			}  
		});
	}
};

//Redirect to Document Upload
function redirectToDocumentUpload(req,res) {

	if(req.session.username){
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		ejs.renderFile('./views/DocumentUpload.ejs',{data:req.session.username},function(err, result) {
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
	else{
		res.redirect('/');
	}
};

exports.liscUpload = function(req,res){

	console.log("inside liscupload");
	console.log(req.param("img111"));
	console.log(req.files);
	var email =(req.session.username[0].emailID).toString();
	console.log("inupload : "+email);
	var imgPath= req.files.img111.path
	var imgImage= req.files.img111;
	console.log("image path"+imgPath);
	console.log("image "+JSON.stringify(imgImage));

	if((email).length==1)
	{
		console.log("in if");
		var conn = mongoose.createConnection('localhost', 'driverLicense', 27017 );
		Grid.mongo = mongoose.mongo;
		conn.once('open',function(){
			console.log('open connection');
			var gfs=Grid(conn.db);

			var wrt = gfs.createWriteStream({

				filename:email
			});
			fs.createReadStream(imgPath).pipe(wrt);

			wrt.on('close',function(file){
				conn.once('open',function(){

					readstream.on('close', function () {
						console.log('file has been written fully!');

					});
				});
				console.log(file.filename + 'Wrte');
				res.render("Video");
			});
		});
	}
	else{
		console.log("in else");
		var conn = mongoose.createConnection('localhost', 'driverLicense', 27017 );
		Grid.mongo =mongoose.mongo;
		conn.once('open',function(){
			console.log('open connection');
			var gfs=Grid(conn.db);

			var wrt = gfs.createWriteStream({
				filename:email
			});
			fs.createReadStream(imgPath).pipe(wrt);
			console.log("here we are");
			wrt.on('close',function(file){
				console.log("here we are");
				conn.once('open',function(){
					//readstream.pipe(res);
					//	console.log("here we are");
					readstream.on('close', function () {
						console.log('file has been written fully!');

					});
				});
				console.log(file.filename + 'Wrte');
				res.render("Video");
			});
		});
	}
};

//readLicense
//exports.readLicense=function(req,res){
//var d_id = (req.param("id")).toString();
//console.log("driver id get image "+d_id);
//var conn = mongoose.createConnection('localhost', 'driverLicense', 27017 );
//Grid.mongo =mongoose.mongo;
//var gfs=Grid(conn.db);
//conn.once('open',function(){
////var fs_write_stream = fs.createWriteStream(res);

////read from mongodb
//var readstream = gfs.createReadStream({
//filename: d_id
//});
//readstream.pipe(res);
//readstream.on('close', function () {
//console.log('file has been written fully!');
//});
//});
//};

////read multiple ride iage
//exports.uploadRideImage =function(req,res){
//console.log(req.files);
////var d_id= 5;
////var c_id =(req.session.data.c_id).toString();
//var c_id = 5;
//console.log("inupload : "+c_id);
//var img= req.files.img_1.path
//var img1= req.files.img_1;
//console.log("image path"+img);
//console.log("image "+JSON.stringify(img1));
//var rand=Math.floor((Math.random() * 100) + 1);
//var c_id1=rand.toString()+c_id;
//mongo.connect(mongoURL, function() {
//console.log("connected to mongo at " + mongoURL);
//var coll = mongo.collection('rideImage');
//coll.insert({"c_id":c_id,"rand_id" : c_id1}
//, function(err, doc) {
//if (err) {
//throw err;
//} else {	

//var conn = mongoose.createConnection('localhost', 'rideImage', 27017 );
//Grid.mongo =mongoose.mongo;

////var imgname="abc"+i;
//conn.once('open',function(){
//console.log('open connection');
//var gfs=Grid(conn.db);

//var wrt = gfs.createWriteStream({

//filename:c_id1
//});

//fs.createReadStream(img).pipe(wrt);
//wrt.on('close',function(file){
//conn.once('open',function(){
////var fs_write_stream = fs.createWriteStream(res);

////read from mongodb
////var readstream = gfs.createReadStream({
////filename: d_id
////});
////readstream.pipe(res);
//readstream.on('close', function () {
//console.log('file has been written fully!');

//});
//});
//console.log(file.filename + 'Wrte');
//res.send();
//});
////}
////})
////});



//});

//}})});
////var d_id =(req.session.d_id).toString;

//}


//};
function documentUpload(req,res) {

	ejs.renderFile('./views/DocumentUpload.ejs',function(err, result) {
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

function welcomeVideo(req,res) {

	ejs.renderFile('./views/Video.ejs',function(err, result) {
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


exports.billInfo=function(req,res) {

	var query ="select * from billinfo where driverID='"+req.session.username[0].emailID+"'";
	console.log("Executing the query bill info: ");
	console.log(query);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
			console.log("error occured " + err.message);
		}
		else 
		{
			console.log("successfull!\n");
			ejs.renderFile('./views/Bill.ejs',{data:drID,data1:results},function(err, result) {
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
			
//			console.log(JSON.stringify(results));
//			console.log(JSON.stringify(results[0].emailID));
//			console.log(JSON.stringify(results[0].firstName));
//			//driverID=results[0].emailID;
//			req.session.RidedriverID=(JSON.stringify(results));
//			req.session.RidedriverName=(JSON.stringify(results[0].firstName));
//			
//			console.log("*******");
//			console.log(req.session.RidedriverID);
		}  
	},query);
}




function driverLogin(req,res) {

	ejs.renderFile('./views/SignIn_Driver.ejs',function(err, result) {
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

exports.logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
	ejs.renderFile('./views/HomePage.ejs', function(err, result){});
};




exports.index = index;
exports.user = user;
exports.backgroundcheck=backgroundcheck;
exports.vehiclecheck=vehiclecheck;
exports.documentUpload=documentUpload;
exports.welcomeVideo=welcomeVideo;
exports.signUp = signUp;
exports.mainLogin = mainLogin;
exports.signUpCust = signUpCust;
exports.driverSignIn=driverSignIn;
exports.driverLogin=driverLogin;
exports.driverLog=driverLog;
exports.redirectToDrLogin=redirectToDrLogin;
exports.redirectToDrHome=redirectToDrHome;
exports.redirectToBackground=redirectToBackground;
exports.redirectToDocumentUpload=redirectToDocumentUpload;