//super simple rpc server example
var amqp = require('amqp')
, util = require('util');

var adminDriver = require('./services/adminDriver')
var signup = require('./services/signup_serverside')
var uber = require('./services/uberMysql')
var bookRide = require('./services/BookARide')

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
	
		console.log("listening on uber_queue");
		cnn.queue('uber_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handle_request(message, function(err,res){
				console.log("In server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		
		
		console.log("listening on uber_queue");
		cnn.queue('notify_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handlenotify_request(message, function(err,res){
				console.log("In server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		
		
		console.log("listening on bookride_queue");
		cnn.queue('bookride_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				bookRide.handle_bookride(message, function(err,res){
				console.log("In server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		
		console.log("listening on vehicle_queue");
		cnn.queue('vehicle_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handle_vehicleValidation(message, function(err,res){
				console.log("In vehicle server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		console.log("listening on SSN_queue");
		cnn.queue('SSN_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handle_SSNValidation(message, function(err,res){
				console.log("In SSN server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		
		console.log("listening on editDriver_queue");
		cnn.queue('DrRideHistory_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handle_DrRideHistory_queue(message, function(err,res){
				console.log("In SSN server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		
		console.log("listening on editDriver_queue");
		cnn.queue('editDriver_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handle_editDriver(message, function(err,res){
				console.log("In SSN server.js*********");	
                 console.log(res.code);
					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		console.log("listening on driverLog_queue");
		cnn.queue('driverLog_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				uber.handle_driverLogin(message, function(err,res){

					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		console.log("listening on customerLog_queue");
		cnn.queue('customerLog_queue', function(q){
			q.subscribe(function(message, headers, deliveryInfo, m){
				util.log(util.format( deliveryInfo.routingKey, message));
				util.log("Message: "+JSON.stringify(message));
				util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
				signup.handle_custLogin(message, function(err,res){

					//return index sent
					cnn.publish(m.replyTo, res, {
						contentType:'application/json',
						contentEncoding:'utf-8',
						correlationId:m.correlationId
					});
				});
			});
		});
		
		
	console.log("listening on adminDriver_queue");
	cnn.queue('adminDriver_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			adminDriver.handle_addDriverRequest(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	console.log("listening on signup_queue");
	cnn.queue('signup_queue', function(q){
		q.subscribe(function(message, headers, deliveryInfo, m){
			util.log(util.format( deliveryInfo.routingKey, message));
			util.log("Message: "+JSON.stringify(message));
			util.log("DeliveryInfo: "+JSON.stringify(deliveryInfo));
			signup.handle_request(message, function(err,res){

				//return index sent
				cnn.publish(m.replyTo, res, {
					contentType:'application/json',
					contentEncoding:'utf-8',
					correlationId:m.correlationId
				});
			});
		});
	});
	
});