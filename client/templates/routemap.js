Template.initialroute.helpers({
    initialRouteMapOptions: function () {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            console.log("Map Loaded.");
            var mapOptions = {
                center: new google.maps.LatLng(38.9687099, -92.095297),
                zoom: 6
            };
            return mapOptions;
        }
    }
});

Template.initialroute.onCreated(function () {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('initialroutemap', function (map) {
        console.log("Google Maps is ready.");

        // Fetch data from MongoDB.
        var citiesArray = Cities.find({}, {sort: {pos : 1}}).fetch();

        var routePlanCoordinates = cityCoordinates(citiesArray); // Get Lat Long coordinates from mongoDB.
        addMarkers(routePlanCoordinates, map);             // Add Markers.
        var routePlan = new google.maps.Polyline({    // Draw poly lines.
            path: routePlanCoordinates,
            geodesic: true,
            strokeColor: '#0066FF',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map.instance
        });
        // End Draw Ployline
    });
    // End initial route map ready.
});
// End initial route map onCreated.

Template.optimizedroute.helpers({
    optimizedRouteMapOptions: function () {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            console.log("Map Loaded.");
            var mapOptions = {
                center: new google.maps.LatLng(38.9687099, -92.095297),
                zoom: 6
            };
            return mapOptions;
        }
    }
});

Template.optimizedroute.onCreated(function () {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('optimizedroutemap', function (map) {
        console.log("Google Maps is ready.");

        // Fetch data from MongoDB.
        var citiesArray = Cities.find({}, {sort: {pos : 1}}).fetch();

        var routePlanCoordinates = cityCoordinates(citiesArray); // Get Lat Long coordinates from mongoDB.
        addMarkers(routePlanCoordinates, map);        // Add Markers.
        var routePlan = new google.maps.Polyline({    // Draw poly lines.
            path: routePlanCoordinates,
            geodesic: true,
            strokeColor: '#0066FF',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map.instance
        });
        // End Draw Ployline
    });
    // End optimizedroute map ready.
});
// End optimizedroute map onCreated.

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

function cityCoordinates(citiesArray){
    var coordinates = [];

    // Create Lat long Array.
    for(i=0; i < citiesArray.length; i++){
        coordinates.push(new google.maps.LatLng(citiesArray[i].latitude, citiesArray[i].longitude));
    }

    return coordinates;
}