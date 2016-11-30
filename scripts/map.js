// Initialize Google Maps
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7128, lng: -74.0059},
        zoom: 5
    });

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);

    google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
        startApp();
    });
}