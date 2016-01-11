var mongo = require("./mongo");
var mongoURL = "mongodb://127.0.0.1:27017/login";
function handle_request(msg, callback){
	
	var res={};

	mongo.connect(mongoURL, function(){
		console.log('Connected to mongo at: ' + mongoURL);
		var coll = mongo.collection('login');

		coll.insert({firstName:msg.firstName ,lastName:msg.lastName , username: msg.username, password:msg.password}, function(err, user){
			if (user) {
				res.code = "200";
				console.log("Result sent is:"+res.code);
				res.value = "Success Login";
			} 
			callback(null, res);
		});
		
	});
}

exports.handle_request = handle_request;
