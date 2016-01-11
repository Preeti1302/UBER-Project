var ejs = require("ejs");
var mysql = require('./mysql');


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
	var msg_payload = { "dest": dest, "src": src, "dist" :dist,"driverID" : req.session.driverID, "riderID" :req.session.username };
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
			console.log(results.email);
			req.session.driverID=results.email;
			req.session.driverName=results.Fname;
		}  
	},query);


	
}
