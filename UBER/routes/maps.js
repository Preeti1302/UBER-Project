/**
 * New node file
 */


var app = angular.module('myApp', []);
app.controller('mapController', function($scope,$http) {


	/*$scope.initialize = function(){

		var currentLocation;

		console.log("Initialize()\n");
		
		var mapProp = {
				center:new google.maps.LatLng(51.508742,-0.120850),
				zoom:13,
				mapTypeId:google.maps.MapTypeId.ROADMAP
		};
		console.log("Creating map object\n");
		var map=new google.maps.Map(document.getElementById("mapdivision"),mapProp);

		//var infoWindow = new google.maps.InfoWindow({map: map});

		// Set current location
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				currentLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
				};

				var marker = new google.maps.Marker({
					position: currentLocation,
				});

				// To add the marker to the map, call setMap();
				marker.setMap(map);

				//infoWindow.setPosition(currentLocation);
				//infoWindow.setContent('Location found.');
				map.setCenter(currentLocation);
			}, function() {
				handleLocationError(true, infoWindow, map.getCenter());
			});
		} else {
			// Browser doesn't support Geolocation
			handleLocationError(false, infoWindow, map.getCenter());
		}

		// get geolocation for destination

		var geocoder = new google.maps.Geocoder();

		//var address = document.getElementById('address').value;
		geocoder.geocode({'address': $scope.address}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
				});
			} else {
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});

		// calculate route

		// draw the route on to the map
	};

	function handleLocationError(browserHasGeolocation, infoWindow, pos) {
		infoWindow.setPosition(pos);
		infoWindow.setContent(browserHasGeolocation ?
				'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	}		
*/
	var updateProfile = function () {
		console.log("updateProfile() function called! \n\n");
		
		var email = req.param("emailID");
		var name = req.param("exampleInputName2");
		var password = req.param("password");
		var mobile = req.param("mobile");
		
		var msg_payload = { "email": email, "password": password };
			
		console.log("In POST Request = email:"+ email+" "+password);
		
		mq_client.make_request('login_queue',msg_payload, function(err,results){
			
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
		
	};
	
	var section = 5;
	$scope.section = function (id) {
		section = id;   
		
		if (id == 3){
			updateProfile();
		}
	};

	$scope.is = function (id) {
		return section == id;
	};
	
	$scope.logout = function () {
		console.log("logout() function called! \n\n");
	};
	
	
	$scope.redirectToBookaRide = function (id) {
		console.log("redirectToBookaRide\n\n");
		
		
		$http({
			
			method : "POST",
			url : '/book',
		
		}).success(function(response) {
			//checking the response data for statusCode
			
			//alert(JSON.stringify(response));
	        
	        if(response.signup == "Success")
	        	
	       		window.location.assign("/bookAride");
	        else
	        	window.location = '/fail_login';
	    }).error(function(error){
	        alert("error");
	   
		
	})
	};
});