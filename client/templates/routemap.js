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



        var routePlanCoordinates = cityCoordinates(); // Get Lat Long coordinates from mongoDB.
        var routePlan = new google.maps.Polyline({
            path: routePlanCoordinates,
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

    function cityCoordinates(){
        var coordinates = [];

        // Fetch data from MongoDB.
        var citiesArray = Cities.find({}, {sort: {createdAt : -1}}).fetch();

        // Create Lat long Array.
        for(i=0; i < citiesArray.length; i++){
            coordinates.push(new google.maps.LatLng(citiesArray[i].latitude, citiesArray[i].longitude));
        }

        return coordinates;
    }
});
