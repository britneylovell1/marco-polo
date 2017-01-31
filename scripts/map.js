// Initialize Google Maps
function initMap() {
	var seattle = {lat: 47.608013, lng: -122.335167};
	var nyc = {lat: 40.7128, lng: -74.0059};
	var spokane = {lat: 47.658779, lng: -117.426048	};
	
  var map = new google.maps.Map(document.getElementById('map'), {
      center: spokane,
      zoom: 7
  });

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
}
