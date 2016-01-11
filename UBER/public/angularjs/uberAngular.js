//loading the 'login' angularJS module for Driver
var app = angular.module('UberApp', []);
//defining the login controller
app.controller('UberCtrl', function($scope, $http, $location,$timeout) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.invalid_login = true;
	$scope.unexpected_error = true;

//	signup for Driver
	$scope.invalid_signup = true;
	$scope.unexpected_error = true;
	$scope.success_signup = true;

	$scope.signUpDr = function() {
		$http({
			method : "POST",
			url : '/driverSignIn',
			data : {

				"first_name" : $scope.first_name,
				"last_name":$scope.last_name,
				"email" :$scope.email,
				"contactinfo":$scope.contactinfo,
				"password":$scope.password,
				"address":$scope.address,
				"city_name":$scope.city_name,
				"state":$scope.state,
				"zip_code":$scope.zip_code
			}
		}).success(function(response) {
			//checking the response data for statusCode
			alert(JSON.stringify(response));

			if(response.signup == "Success")
			{
				$scope.invalid_signup = true;
				$scope.unexpected_error = true;
				$scope.success_signup = false;
				window.location = '/redirectToDrLogin';
			}

			else{
				$scope.invalid_signup = false;
				$scope.unexpected_error = true;
				$scope.success_signup = true;
			}
			//window.location = '/fail_login';
		}).error(function(error){
			$scope.invalid_signup = true;
			$scope.unexpected_error = false;
			$scope.success_signup = true;
			//alert("error");
		});

	};

	//LOGIN FOR DRIVER
	$scope.loginDriver = function() {
		$http({
			method : "POST",
			url : '/driverLog',
			data : {
				"email" : $scope.email,
				"password" : $scope.password
			}
		}).success(function(response) {
			//checking the response data for statusCode
			//alert(JSON.stringify(response));

			if(response.login == "Success"){
				$scope.invalid_signup = true;
				$scope.unexpected_error = true;
				$scope.success_signup = false;
				window.location = '/redirectToDrHome';
			}
			else if(response.login == "SuccessWoR"){
				$scope.invalid_signup = false;
				$scope.unexpected_error = true;
				$scope.success_signup = true;
				window.location = '/redirectToDrWOR';
			}

			else if(response.login == "Fail"){
				$scope.invalid_signup = false;
				$scope.unexpected_error = true;
				$scope.success_signup = true;
				//window.location = '/driverLogin';
			}
			else{
				$scope.invalid_signup = true;
				$scope.unexpected_error = false;
				$scope.success_signup = true;
			}

		}).error(function(error){
			alert("error");
		});
	};

	//It takes vehicle number, saves in db and redirect to Background check
	$scope.vehicleValidate = function() {
		$http({
			method : "POST",
			url : '/vehiclecheck',
			data : {
				"vehicle" : $scope.vehicle
			}
		}).success(function(response) {
			//checking the response data for statusCode
			//alert(JSON.stringify(response));

			if(response.vehicle == "Success"){
				$scope.invalid_signup = true;
				$scope.unexpected_error = true;
				$scope.success_signup = false;
				window.location = '/redirectToBackground';
			}

			else if(response.vehicle == "Fail"){
				$scope.invalid_signup = false;
				$scope.unexpected_error = true;
				$scope.success_signup = true;
				//window.location = '/driverLogin';
			}
			else{
				$scope.invalid_signup = true;
				$scope.unexpected_error = false;
				$scope.success_signup = true;
				//window.location = '/driverLogin';
			}

		}).error(function(error){
			alert("error");
		});
	};


	//It takes SSN, saves in db and redirect to Document Upload
	$scope.backgroundcheck= function() {
		$http({
			method : "POST",
			url : '/backgroundcheck',
			data : {
				"ssn1" : $scope.ssn1,
				"ssn2" : $scope.ssn2,
				"ssn3" : $scope.ssn3
			}
		}).success(function(response) {
			//checking the response data for statusCode
			//alert(JSON.stringify(response));

			if(response.ssn == "Success"){
				$scope.invalid_signup = true;
				$scope.unexpected_error = true;
				$scope.success_signup = false;
				window.location = '/redirectToDocumentUpload';
			}

			else if(response.ssn == "Fail"){
				$scope.invalid_signup = false;
				$scope.unexpected_error = true;
				$scope.success_signup = true;
				//window.location = '/driverLogin';
			}
			else{
				$scope.invalid_signup = true;
				$scope.unexpected_error = false;
				$scope.success_signup = true;
				//window.location = '/driverLogin';
			}

		}).error(function(error){
			alert("error");
		});
	};

	//fetch Driver Profile
	$scope.saveDriverProfile = function() {
		alert("in save");
		$http({

			method : "POST",
			url : '/saveDriverProfile',
			data : {
				"ssn" :$scope.ssn,
				"contact":$scope.contact,
				"carDetails":$scope.vehicle,
				"address":$scope.address,
				"city_name":$scope.city,
				"state":$scope.state,
				"zip_code":$scope.zip,
				"email":$scope.email
			}
		}).success(function(response) {
			//checking the response data for statusCode

			alert(JSON.stringify(response));

			if(response.signup == "Success")

				window.location.assign("/redirectToDrNewProfile");
			else
				window.location = '/fail_login';
		}).error(function(error){
			alert("error");
		});
	};

	$scope.goToRideHistory = function(){

		$http({

			method : "POST",
			url : '/goToRideHistory',
			data : {}
		}).success(function(response) {
			//checking the response data for statusCode

			//alert(JSON.stringify(response));

			if(response.ride == "Success")

				window.location.assign("/redirectToDrRideHistory");
			else
				window.location = '/fail_login';
		}).error(function(error){
			alert("error");


		});
	};

//
//	//notification
//
//	$scope.init = function() {
//		$http({
//			method : "POST",
//			url : '/myFunction',
//			data : {
//			}
//		}).success(function(response) {
//			alert("inside success");
//
//			if (response.login == "Fail") {
//
//				alert("You got a error");
//			}
//			else if(response.login == "Success")
//				//Making a get call to the '/redirectToHomepage' API
//				alert("You got a Ride");
//
//		}).error(function(error) {
//
//			alert("You got 2 error");
//		});
//	};
//
//	$scope.intervalFunction = function(){
//		$timeout(function() {
//			$scope.init();
//			$scope.intervalFunction();
//		}, 3000);
//	};
//
//	// Kick off the interval
//	$scope.intervalFunction();


});







