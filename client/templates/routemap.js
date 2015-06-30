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

    var routePlan = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#0066FF',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    GoogleMaps.ready('optimizedroutemap', function (map) {
        console.log("Google Maps is ready.");
        googleMap = map.instance;
        // TODO get data from session and Throw error if session has expired.
        // var citiesArray = Session.get("locationsData");

        var citiesArray = Cities.find({}, {sort: {pos: 1}}).fetch();

        var routePlanCoordinates = cityCoordinates(citiesArray, map); // Get Lat Long coordinates from mongoDB.
        RouteMarkers.insert({
           markers: routePlanCoordinates
        });
        addMarkers(routePlanCoordinates, map);        // Add Markers.
        var initialPlan = new google.maps.Polyline({    // Draw poly lines.
            path: routePlanCoordinates,
            geodesic: true,
            strokeColor: '#FF8080',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map.instance
        });

        routePlan.setMap(map.instance);
    });

    var markers = {};

    RouteMarkers.find().observe({
        added: function(document) {
            /*// Create a marker for this document
            var marker = new google.maps.Marker({
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: new google.maps.LatLng(document.lat, document.lng),
                map: map.instance,
                // We store the document _id on the marker in order
                // to update the document within the 'dragend' event below.
                id: document._id
            });

            // This listener lets us drag markers on the map and update their corresponding document.
            google.maps.event.addListener(marker, 'dragend', function(event) {
                Markers.update(marker.id, { $set: { lat: event.latLng.lat(), lng: event.latLng.lng() }});
            });

            // Store this marker instance within the markers object.
            markers[document._id] = marker;*/
        },
        changed: function(newDocument, oldDocument) {
            console.log("Markers changed: from Mongo Collection.", newDocument.markers);

            var newPath = [];
            var curLat;
            var curLong;
            for(var i = 0; i < newDocument.markers.length; i++) {
                curLat = newDocument.markers[i].A;
                curLong = newDocument.markers[i].F;
                newPath.push(new google.maps.LatLng(curLat, curLong))
            }
            routePlan.setPath(newPath);
            /*google.maps.event.addListener(routePlan, function(event) {
                routePlan.setPath(newDocument);
            });*/

        },
        removed: function(oldDocument) {
        }
    });
});
// End optimizedroute map onCreated.

Template.routemap.events(function () {

});

Template.routemap.onRendered(function(){
    sAlert.info('Starting Simulated Annealing.', {effect: 'stackslide', position: 'top-right', timeout: '4000', onRouteClose: false, stack: true, offset: '80px'});
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