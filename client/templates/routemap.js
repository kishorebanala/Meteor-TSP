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
    },
    bestRouteCost: function() {
        return Session.get('bestCost');
    }
});

Template.routemap.onCreated(function () {

    if(typeof google === 'undefined'){
        console.log("Session might have expired.");
        Router.go('/sessionexpired');
        return false;
    }

    // Show progress bar.
    NProgress.start();

    // Declaring route polyline out of GoogleMaps ready callback scope has bought up many advantages. With google map's inside setter functions, drawing new polylines
    // has been easier now. And also, this allows us to route user on blank template page on session expire or refresh.
    var initialPolyline = new google.maps.Polyline({    // Draw poly lines
        geodesic: true,
        strokeColor: '#FF8080',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    var newRoutePolyline = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#0066FF',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    GoogleMaps.ready('optimizedroutemap', function (map) {
        console.log("Google Maps is ready.");
        initialPolyline.setMap(map.instance);
        newRoutePolyline.setMap(map.instance);
    });

    var newRoutePath = [];
    var routePathDep = new Tracker.Dependency;


    var getNewRoutePath = function () {
            routePathDep.depend();
            return newRoutePath;
        };

    setNewRoutePath = function (newPath) {
            //console.log("New route path set.");
            newRoutePath = newPath;
            routePathDep.changed();
        };

    Tracker.autorun(function(){
        //console.log("Drawing new route path.");
        var newPath = getRoutePlanPoints(getNewRoutePath());
        newRoutePolyline.setPath(newPath);
    });

    var bestRoute = [];
    var bestRouteDep = new Tracker.Dependency;

    var getBestRoutePath = function () {
        routePathDep.depend();
        return newRoutePath;
    };

    setBestRoutePath = function (newPath) {
        console.log("New route path set.");
        newRoutePath = newPath;
        routePathDep.changed();
    };

    Tracker.autorun(function(){
        console.log("Adding Markers.");
        var bestPath = getRoutePlanPoints(getBestRoutePath());
        for (i = 0; i < bestPath.length; i++) {

            var image = new google.maps.MarkerImage('img/marker' + (i + 1) + '.png',
                new google.maps.Size(20, 34),
                new google.maps.Point(0, 0),
                new google.maps.Point(10, 34));

            var marker = new google.maps.Marker({
                position: bestPath[i],
                map: GoogleMaps.maps.optimizedroutemap.instance,
                icon: image
            });
        }
    });

    drawInitialPolyline = function(routePlan){
        var routePlanPoints = getRoutePlanPoints(routePlan);
        initialPolyline.setPath(routePlanPoints);
        setMapOptions(routePlan, GoogleMaps.maps.optimizedroutemap.instance);
    }

});
// End optimizedroute map onCreated.

Template.routemap.onRendered(function(){
    var isTestData = Session.get("isTestData");
    console.log("Is using test data: ", isTestData);
    sAlert.info('Starting Simulated Annealing.', {effect: 'stackslide', position: 'top-right', timeout: '4000', onRouteClose: false, stack: true, offset: '80px'});
    // Wait for maps to load.
    // TODO check timeout.
    Meteor.setTimeout(function(){
        if((typeof isTestData !== 'undefined') && isTestData){
            //startSimulatedAnnealing(testDistMatrix[0].distance_matrix, testLocations);
            // TODO Render test data and draw polylines is breaking, try to do it in pipeline.
            runSimulatedAnnealingWithTestData();
        }
        else{
            // Run Simulated Annealing Asynchronously. It stops if calls to API fails.
            runSimulatedAnnealingAsync();
        }
    }, 2000);
});

// Wait for the route map template to render: (Making sure all divs with maps and css elements are loaded.)
Template.routemap.rendered = function(){

};

// TODO Rename function and add comments.
function getRoutePlanPoints(newRoute){
    var coordinates = [];

    var arrLength = newRoute.length;
    // Create Lat long Array.
    for(i=0; i < arrLength; i++){
        var curLat = newRoute[i].lat;
        var curLong = newRoute[i].lng;
        coordinates.push(new google.maps.LatLng(curLat, curLong));
    }

    return coordinates;
}

function setMapOptions(locationsArray, map){
    var lats = 0;
    var longs = 0;
    var arrLength = locationsArray.length;

    // Create Lat long Array.
    for(i=0; i < arrLength; i++){
        var curLat = locationsArray[i].lat;
        var curLong = locationsArray[i].lng;
        lats += Number(curLat);
        longs += Number(curLong);
    }

    map.setCenter(new google.maps.LatLng(lats/arrLength, longs/arrLength));
    map.setZoom(4);
}