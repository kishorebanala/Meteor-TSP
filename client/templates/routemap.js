Template.routemap.helpers({
    optimizedRouteMapOptions: function () {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            console.log("Map Loaded.");
            var mapOptions = {
                center: new google.maps.LatLng(26.820553, 30.802498),
                zoom: 2
            };
            return mapOptions;
        }
    }
});

Template.routemap.onCreated(function () {

});
// End optimizedroute map onCreated.

Template.routemap.events(function () {

});

Template.routemap.onRendered(function(){
    var routePlan = new google.maps.Polyline({    // Draw poly lines.
        geodesic: true,
        strokeColor: '#0066FF',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('optimizedroutemap', function (map) {
        console.log("Google Maps is ready.");
        googleMap = map.instance;
        // TODO get data from session and Throw error if session has expired.
        // var citiesArray = Session.get("locationsData");

        var citiesArray = Cities.find({}, {sort: {pos: 1}}).fetch();

        var routePlanCoordinates = cityCoordinates(citiesArray, map); // Get Lat Long coordinates from mongoDB.
        addMarkers(routePlanCoordinates, map);        // Add Markers.
        var initialPlan = new google.maps.Polyline({    // Draw poly lines.
            path: routePlanCoordinates,
            geodesic: true,
            strokeColor: '#FF8080',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map.instance
        });
        // End Draw Polyline
        routePlan.setMap(map.instance);

    });
    Session.set("routePath", []);
    routePlan.setPath(Session.get("routePath"));
    // End optimizedroute map ready.
    sAlert.error('Starting Simulated Annealing.', {effect: 'genie', position: 'top-right', timeout: '5000', onRouteClose: false, stack: false, offset: '80px'});
    // Start simulated annealing.
    simulatedAnnealing();
});

function addMarkers(routePlanCoordinates, map){
    for(i = 0;  i < routePlanCoordinates.length; i++) {

        var image = new google.maps.MarkerImage('img/marker' + (i+1) + '.png',
            new google.maps.Size(20, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34));

        var marker = new google.maps.Marker({
            position: routePlanCoordinates[i],
            map: map.instance,
            icon: image
        });
    }
}

var lats = 0;
var longs = 0;
function cityCoordinates(citiesArray, map){
    var coordinates = [];

    // TODO debug only, set sessions from seperate function if useful.
    var arrLength = citiesArray.length;
    // Create Lat long Array.
    for(i=0; i < arrLength; i++){
        var curLat = citiesArray[i].latitude;
        var curLong = citiesArray[i].longitude;
        coordinates.push(new google.maps.LatLng(curLat, curLong));
        lats += Number(curLat);
        longs += Number(curLong);
    }

    map.instance.setCenter(new google.maps.LatLng(lats/arrLength, longs/arrLength));
    // TODO set zoom by distance.
    map.instance.setZoom(5);

    return coordinates;
}

/**
 * Calculate map zoom and center options using location data.
 */
function getMapDisplayOptions(locationData){

}