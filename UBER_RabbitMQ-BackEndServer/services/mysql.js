var ejs= require('ejs');
var mysql = require('mysql');
var pool=mysql.createPool(
		{
			connectionLimit:100,
			host     : 'localhost',
		    user     : 'root',
		    password : 'Pmapsn@1900',
		    database : 'UBER',
		    port	 : 3308
			
		});
function fetchData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=pool.getConnection(function(err,connection){
		if(err)
			{
			console.log("error");
			}
		else{
			
			connection.query(sqlQuery, function(err, rows, fields) {
				connection.release();
				if(err){
					console.log("ERROR: " + err.message);
				}
				else 
				{	// return err or result
					console.log("DB Results:"+rows);
					callback(err, rows);
				}
			});
			console.log("\nConnection closed..");
			

		}
	});
	
}	

exports.fetchData=fetchData;




function insertData(callback,sqlQuery){
	
	console.log("\nSQL Query::"+sqlQuery);
	
	var connection=pool.getConnection(function(err,connection){
		if(err)
			{
			console.log("error");
			}
		else{
			
			connection.query(sqlQuery, function(err, rows, fields) {
				connection.release();
				if(err){
					console.log("ERROR: " + err.message);
				}
				else 
				{	// return err or result
					console.log("DB Results:"+rows);
					callback(err, rows);
				}
			});
			console.log("\nConnection closed..");
			

		}
	});
	
}	


exports.fetchData=fetchData;
exports.insertData=insertData;