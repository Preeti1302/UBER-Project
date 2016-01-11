
/*
 * GET home page.
 */

exports.customerHome = function(req, res){
  res.render('Customer/customerHome', { title: 'Express' });
};


exports.riderHome = function(req, res){
	  res.render('Customer/riderHome', { title: 'Express' });
	};
	
	
exports.book = function(req, res){
		  res.send({"signup":"Success"});
		};	
	
exports.bookAride = function(req, res){
		  res.render('Customer/GeoLocation.ejs', { title: 'Express' });
		};