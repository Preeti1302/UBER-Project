//loading the 'login' angularJS module for Driver
var app = angular.module('UberAppAdmin', []);
//defining the login controller
app.controller('UberCtrlAdmin', function($scope, $http, $location) {
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
	$scope.loginAdmin = function() {
		$http({
			method : "POST",
			url : '/AdminSignin',
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
				window.location = '/AdminHome';
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
	
});





