
    var app = angular.module('UberApp',[])
	
	app.controller('UberCtrl',function ($scope,$http,$location,$window) {
		
	    
		$scope.signup = function() {
			$http({
	            method: 'POST',
	            url: '/signup',
	            data: { "email": $scope.email, "password": $scope.password,
	            	    "first_name": $scope.first_name ,"last_name": $scope.last_name,"contact": $scope.mobile,
	            	    "card_number": $scope.card_number,"card_code": $scope.card_code,
	            	    "card_expiration_month": $scope.card_expiration_month,"card_expiration_year": $scope.card_expiration_year,
	            	    "billing_zip": $scope.billing_zip}
	            
	         }).success(function(response){
	           
	            alert(JSON.stringify(response));
	            
	            if(response.signup == "Success")
	           		window.location.href = '/signup_Cust';
	            else
	            	window.location.href = '/signup';
	        }).error(function(error){
	            alert("error");
	        });
	    };
	    
	  //LOGIN FOR CUSTOMER
		$scope.loginCustomer = function() {
			$http({
				method : "POST",
				url : '/custLog',
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
					window.location = '/redirectToCustHome';
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
		
		$scope.add_user = function() {
			window.location.href = '/adduser';
		};
		
		$scope.view_driver = function() {
			window.location.href = '/viewdriver';
		};
		
		$scope.view_user = function() {
			window.location.href = '/viewuser';
		};
		
		$scope.show_statistics = function() {
			window.location.href = '/showstatistics';
		};
	    
		$scope.search_bill = function() {
			window.location.href = '/searchbill';
		};
	    
		$scope.adddriver = function() {
			$http({
	            method: 'POST',
	            url: '/adddriver',
	            data: { "email": $scope.email, "password": $scope.password,
	            	    "first_name": $scope.first_name ,"last_name": $scope.last_name,"mobile": $scope.mobile,
	            	    "city": $scope.city }
	            
	         }).success(function(response){
	           
	            alert(JSON.stringify(response));
	            
	            if(response.adddriver == "Success")
	           		window.location.href = '/admin';
	            else
	            	window.location.href = '/fail_login';
	        }).error(function(error){
	            alert("error");
	        });
	    };
	     
	    
	    $scope.viewdriver = function() {
			$http({
	            method: 'POST',
	            url: '/viewdriver',
	            data: {  "first_name": $scope.first_name , "last_name": $scope.last_name }
            	    
	            
	         }).success(function(response){
	           
	            alert(JSON.stringify(response));
	            
	            if(response.viewdriver == "Success")
	            	{
	            	$scope.email = response.email;
	            	$scope.city = response.city;
	            	$scope.mobile = response.mobile;
	            	$scope.first_name = response.first_name;
	            	$scope.last_name = response.last_name;
	            	
	           		//window.location( '/viewdriver');
	            	}
	            else
	            	window.location.href = '/viewdriver';
	        }).error(function(error){
	            alert("error");
	        });
	    };
		
	    
	    $scope.adduser = function() {
			$http({
	            method: 'POST',
	            url: '/adduser',
	            data: {  "email": $scope.email, "password": $scope.password,
            	    "first_name": $scope.first_name ,"last_name": $scope.last_name,"mobile": $scope.mobile,
            	    "lang": $scope.lang,"card_number": $scope.card_number,"card_code": $scope.card_code,
            	    "card_expiration_month": $scope.card_expiration_month,"card_expiration_year": $scope.card_expiration_year,
            	    "billing_zip": $scope.billing_zip }
	            
	         }).success(function(response){
	           
	            alert(JSON.stringify(response));
	            
	            if(response.adduser == "Success")
	           		window.location.href = '/admin';
	            else
	            	window.location.href = '/fail_login';
	        }).error(function(error){
	            alert("error");
	        });
	    };
	    $scope.viewuser = function() {
			$http({
	            method: 'POST',
	            url: '/viewuser',
	            data: {  "email": $scope.email }
	            
	         }).success(function(response){
	           
	            alert(JSON.stringify(response));
	            
	            if(response.viewuser == "Success")
	            	{
	            	
					$scope.last_name= response.last_name;
					$scope.email= response.email;
					$scope.mobile= response.mobile;
					$scope.first_name= response.first_name;
					alert(JSON.stringify(response));
	            	
	           		//window.location.href = '/viewuser';
	            	}
	            else{
	            	console.log("IN ELSE BLOCK OF VIEW USER");
	            	window.location.href = '/viewuser';
	            }
	        }).error(function(error){
	            alert("error");
	        });
	    };
		
		
		
		   $scope.searchbill = function() {
			   var request = $http({
		           method: 'POST',
		           url: "/searchbill",
		        	   data: {  "billid": $scope.billid }	   
		       });

				request.success(
				function(response) {
					if(response.viewuser == "Success")
	            	{
					$scope.car= response.car;
					$scope.city= response.city;
					$scope.date= response.date;
					$scope.fare= response.fare;
					$scope.did= response.did;
					$scope.cid= response.cid;	
					$scope.distance= response.distance;
					$scope.saddress= response.saddress;
					$scope.daddress= response.daddress;
	            	}
					else
						{
						window.location.href = '/searchbill';
						}

				});

		   };
		
		   
		   
		   
	});

