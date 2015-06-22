Template.routemap.helpers({
    googleRouteMapOptions: function () {
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded()) {
            // Map initialization options
            console.log("Map Loaded.");
            var mapOptions = {
                center: new google.maps.LatLng(38.9687099, -92.095297),
                zoom: 8
            };
            return mapOptions;
        }
    }
});

Template.routemap.onCreated(function () {
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('googleroutemap', function (map) {
        console.log("Google Maps is ready.");
        var flightPlanCoordinates = [
            new google.maps.LatLng(38.9687099, -92.095297),
            new google.maps.LatLng(41.8781136, -87.6297982),
            new google.maps.LatLng(38.9687099, -92.095297),
            new google.maps.LatLng(41.2033216, -77.1945247)
        ];
        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            geodesic: true,
            strokeColor: '#0066FF',
            strokeOpacity: 0.8,
            strokeWeight: 4,
            map: map.instance
        });

        /*var marker = new google.maps.Marker({
            position: map.options.center,
            markerStart:true,
            map: map.instance
        });*/
    });
});
