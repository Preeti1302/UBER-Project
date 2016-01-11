 var app = angular.module('UberApp',[])
	
	app.controller('UberCtrl',function ($scope,$http,$location,$window) {
		


//gettrips();
	      //function gettrips(){
	    $scope.gettrips = function() {
			   var request = $http({
		           method: 'GET',
		           url: "/gettrips"
		        	   

		       });

				request.success(
				function(response) {
					if(response.gettrips == "Success")
	            	{
					$scope.car= response.car;
					$scope.city= response.city;
					$scope.driver= response.driver;
					$scope.fare= response.fare;
					$scope.card_number= response.card_number;
					$scope.pickup= response.pickup;				
	            	}
					else{
						window.location.href = '/mytrips';

					}

				});

		   };
		   
	});