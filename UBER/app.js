
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var index = require('./routes/index');
var Admin = require('./routes/Admin');
var cust = require('./routes/signup');

var index1 = require('./routes/index1');
var mapsData=require('./routes/mapsData');
var ride = require('./routes/ride');

var app = express();
var session = require('client-sessions');
var mysql = require('mysql');
var mongoSessionConnectURL = "mongodb://localhost:27017/sessions";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/mongo");

// all environments
app.use(session({   
	  
	cookieName: 'session',    
	secret: 'uber_test_string',    
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,  }));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('views/Admin', path.join(__dirname, 'views/Admin'));
app.set('views/Customer', path.join(__dirname, 'views/Customer'));
app.set('view engine', 'ejs');
app.use(express.favicon());
//app.use();
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', routes.index);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/index', index.index)
app.get('/user', index.user);
app.get('/signUp', index.signUp);
app.get('/mainLogin', index.mainLogin);
app.get('/signUpCust', index.signUpCust);
app.post('/driverSignIn', index.driverSignIn);
app.get('/redirectToDrLogin',index.redirectToDrLogin);
app.get('/redirectToDrHome',index.redirectToDrHome);
app.get('/redirectToBackground',index.redirectToBackground);
app.get('/redirectToDrProfile',index.redirectToDrProfile);
app.get('/redirectToDrEditProfile',index.redirectToDrEditProfile);
app.get('/redirectToDrNewProfile',index.redirectToDrNewProfile);
app.get('/redirectToDrRideHistory',index.redirectToDrRideHistory);
app.post('/saveDriverProfile',index.saveDriverProfile);
app.get('/driverLogin', index.driverLogin);
app.post('/driverLog', index.driverLog);
app.post('/backgroundcheck', index.backgroundcheck);
app.get('/background-check', index.redirectToBackground);
app.post('/liscUpload',index.liscUpload);
app.get('/redirectToDocumentUpload',index.redirectToDocumentUpload);
app.post('/vehiclecheck', index.vehiclecheck);
app.get('/documents', index.documentUpload);
app.get('/video', index.welcomeVideo);
app.get('/logout', index.logout);
app.post('/goToRideHistory',index.goToRideHistory);
app.get('/redirectToDrWOR',index.redirectToDrWOR);
app.post('/myFunction',index.myFunction);
app.get('/billInfo',index.billInfo);


//Admin
app.post('/redirectToAdminLogin',Admin.redirectToAdminLogin);
app.post('/AdminSignin',Admin.AdminSignin);
app.get('/AdminHome',Admin.AdminHome);
app.get('/addDriverPage', Admin.addDriverPage);
app.get('/addCustomerPage', Admin.addCustomerPage);
app.get('/driverAdminSignIn', Admin.driverAdminSignIn);
app.get('/viewDriver', Admin.viewDriver);

//Customer
app.post('/signup', cust.signup);
app.get('/signup_Cust', cust.signup_Cust);
app.post('/custLog', cust.customerLog);
app.get('/redirectToCustHome', cust.redirectToCustHome);


app.get('/bookAride', index1.bookAride);
app.post('/book',index1.book);
app.post('/ride',ride.ride);
app.post('/locationdest',cust.locationdest);
app.post('/locationdestDriver',cust.locationdestDriver);


mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});
