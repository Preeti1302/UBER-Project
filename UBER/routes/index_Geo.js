
/*
 * GET home page.
 */

exports.customerHome = function(req, res){
  res.render('customerHome', { title: 'Express' });
};


exports.riderHome = function(req, res){
	  res.render('riderHome', { title: 'Express' });
	};
	
	
exports.book = function(req, res){
		  res.send({"signup":"Success"});
		};	
	
exports.bookAride = function(req, res){
		  res.render('GeoLocation.ejs', { title: 'Express' });
		};