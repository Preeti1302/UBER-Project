/**
 * http://usejsdoc.org/
 */

//Start location of the distance matrix    
var start;

//End location of the distance matrix
var end;

 var functioncount=0;
 
var info = new Array();

//Locations of drivers
var locations = [
   ['<h4>SAP Centre</h4>', 37.333031,-121.900797],
   ['<h4>Sunnyvale Hindu Temple</h4>', 37.405052,-122.013994],
   ['<h4>Colonnade </h4>', 37.333261,-121.884503],
 ];


function notifyDriver(info){
	
	//alert("The driver at shortest distance from the current user is at distance-->"+info[0].distance+" at location "+info[0].location);
	alert("Notify driver at location "+info[0].location+" to pick up rider from location "+info[0].rider);
	
	
}


//Function which gets the response from Distance Matrix
function callback(response,status){

//if the returned status from distance matrix is  OK
if(status==google.maps.DistanceMatrixStatus.OK){

  //alert("Driver found ! At distance ----->"+response.rows[0].elements[0].distance.value+" from the current user at location!"+response.destinationAddresses);
  //alert("response is "+JSON.stringify(response));
  info.push({rider:response.originAddresses,location:response.destinationAddresses,distance:response.rows[0].elements[0].distance.value});
  functioncount++;
  //Add distance to the drivers array
  
  //drivers[driverCount]=response.rows[0].elements[0].distance.value;
  //driverCount++;  
  
  //*drivers.sort(function(a, b){return a-b});
  info.sort(function(a,b){return a.distance - b.distance;});
  
  
  //getDriver(drivers,response);
    
}
else
alert("Distance not found !");

//alert("function count is "+functioncount);
if(functioncount>=3)
	notifyDriver(info);
else
	alert("function count not 3");

}

//Function which ccalculateDistancealculates distance between two points
function calculateDistance(start,end){

//alert("In calculate distance function !");
var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
{
  origins : [start],
  destinations : [end],
  travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: false,
            avoidTolls: false      

},callback);


}


//Function which handles current position location error
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

//The main function which gets loaded
function initAutocomplete() {

 var flag=0; 
 
 //Map variable
 var map= new google.maps.Map(document.getElementById('map'), {
    //center: {lat: -34.397, lng: 150.644},
    zoom: 15
  });
 
 
    
 // Setup the different icons and shadows
 var iconURLPrefix = 'http://maps.google.com/mapfiles/ms/icons/';
    
 
 //icons for Uber cars   
 var icons = [
            iconURLPrefix + 'blue-dot.png'
            ]
    
  
 var iconsLength = icons.length;

 var infowindow = new google.maps.InfoWindow({
 maxWidth: 160
 });

var markers = new Array();
    
var iconCounter = 0;
    
// Add the markers of Uber cars to the map
for (var i = 0; i < locations.length; i++) {  
var marker = new google.maps.Marker({
position: new google.maps.LatLng(locations[i][1], locations[i][2]),
map: map,
 icon: icons[iconCounter]
      });

 markers.push(marker);

 google.maps.event.addListener(marker, 'click', (function(marker, i) {
  return function() {
  infowindow.setContent(locations[i][0]);
  infowindow.open(map, marker);
 }
      })(marker, i));
      
  iconCounter++;
      // We only have a limited number of possible icon colors, so we may have to restart the counter
      if(iconCounter >= iconsLength) {
      	iconCounter = 0;
      }
  }
 
    
 
 //For current location
  if (navigator.geolocation) {
  flag=1;
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

       map.setCenter(pos);   
       //alert("Latitude for pos is"+pos.lat);
       //alert("Longitude for pos is"+pos.lng);
       
       
       /*start = pos;
       
        for(var i = 0;i<locations.length;i++){
   
   		var loc={ 
        lat: locations[i][1], 
        lng: locations[i][2]
    	};
       //alert("location is ----------->"+loc.lat+ "and "+loc.lng);
       calculateDistance(start,loc);
       //alert("after calling calculate distance"+driverCount);
    }
     */
         
     
           
    var marker = new google.maps.Marker({
    position: pos,
    map: map,
    title: 'You are here !'
  });
  
}, function() {
      
      
      handleLocationError(true, infoWindow, map.getCenter());
      
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }


//
   

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  //var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    
    
    if (places.length == 0) {
      return;
    }
       
       
    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

   
   end = place.geometry.location;
   //alert("Destination is "+end);
     
      // Create a marker for each place.
           markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
 
  
  
  
}