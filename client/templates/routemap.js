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

    var routePlan = new google.maps.Polyline({
        geodesic: true,
        strokeColor: '#0066FF',
        strokeOpacity: 0.8,
        strokeWeight: 4
    });

    GoogleMaps.ready('optimizedroutemap', function (map) {
        console.log("Google Maps is ready.");
        googleMap = map.instance;
        this.mapInstance = map.instance;
        // TODO get data from session and Throw error if session has expired.
        // var citiesArray = Session.get("locationsData");

        var citiesArray = Cities.find({}, {sort: {pos: 1}}).fetch();

        var routePlanCoordinates = cityCoordinates(citiesArray, map); // Get Lat Long coordinates from mongoDB.

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

    var newRoutePath = [];
    var routePathDep = new Tracker.Dependency;

    var getNewRoutePath = function () {
            routePathDep.depend();
            return newRoutePath;
        };

    setNewRoutePath = function (newPath) {
            console.log("New route path set.");
            newRoutePath = newPath;
            routePathDep.changed();
        };

    Tracker.autorun(function(){
        // TODO draw new ploylines
        console.log("Drawing new route path.");
        var newPath = getRoutePlanPoints(getNewRoutePath());
        routePlan.setPath(newPath);
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
        // TODO Add markers.
        console.log("Adding Markers.");
        var bestPath = getRoutePlanPoints(getBestRoutePath());
        //addMarkers(bestPath, this.mapInstance);
        GoogleMaps.ready('optimizedroutemap', function (map) {
            for (i = 0; i < bestPath.length; i++) {

                var image = new google.maps.MarkerImage('img/marker' + (i + 1) + '.png',
                    new google.maps.Size(20, 34),
                    new google.maps.Point(0, 0),
                    new google.maps.Point(10, 34));

                var marker = new google.maps.Marker({
                    position: bestPath[i],
                    map: map.instance,
                    icon: image
                });
            }
        });
    });

});
// End optimizedroute map onCreated.

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

Template.routemaplayout.events( {
    // Go back to home.
    "click .homenav" : function (event) {
        // This function is called when Find Optimal Route button is pressed.

        console.log("Routing back to home");

        // TODO kill current process.

        // go to home page.
        Router.go('/');
    }
});

// TODO move to seperate place, add comments.

Template.routemap.onRendered(function(){
    sAlert.info('Starting Simulated Annealing.', {effect: 'stackslide', position: 'top-right', timeout: '4000', onRouteClose: false, stack: true, offset: '80px'});
    // Start simulated annealing.

    // Start spinner.
    NProgress.start();

    // Check if test data.
    var isTestData = Session.get("isTestData");
    console.log("Is using test data: ", isTestData);
    if((typeof isTestData !== 'undefined') && isTestData){
        // TODO do this asynchronously.
        if(TestLocations.find().count() < 1){
            sAlert.info("Loading Test Data, might take few seconds for first time.", {effect: 'stackslide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: true, offset: '80px'});
            //NProgress.start();
            Meteor.call('populateTestData', function(err, res){
                if(err){
                    console.log("Failed to populate test data");
                }
                else{
                    console.log("Insert test data success.")
                }
            });
        }
        if(TestDistanceMatrix.find().count() < 1){
            sAlert.info("Loading Test Data, might take few seconds for first time.", {effect: 'stackslide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: true, offset: '80px'});
            //NProgress.start();
            Meteor.call('populateTestDistMatrixData', function(err, res){
                if(err){
                    console.log("Failed to populate test data");
                }
                else{
                    console.log("Insert test data success.");
                }
            });

        }
        // TODO Run Async or only after making sure data is present.
        var testDistMatrix = TestDistanceMatrix.find({}, {sort: {pos: 1}}).fetch();
        //console.log("testDistMatrix: ", testDistMatrix[0].distance_matrix);
        var testLocations = TestLocations.find({}, {sort: {pos: 1}}).fetch();
        //console.log("testLoc Length: ", testLocations.length);
        startSimulatedAnnealing(testDistMatrix[0].distance_matrix, testLocations);
    }
    else{
        // Run Simulated Annealing Asynchronously. It stops if calls to API fails.
        runSimulatedAnnealingAsync();
    }

    // TODO move distance matrix functions to utils file.
    // Get Distance Matrix Synchronously.

    // TODO add markers from final return data.
    //this.mapInstance;

});
function cityCoordinates(citiesArray, map){
    var coordinates = [];
    var lats = 0;
    var longs = 0;

    // TODO debug only, set sessions from seperate function if useful.
    var arrLength = citiesArray.length;
    // Create Lat long Array.
    for(i=0; i < arrLength; i++){
        var curLat = citiesArray[i].lat;
        var curLong = citiesArray[i].lng;
        coordinates.push(new google.maps.LatLng(curLat, curLong));
        lats += Number(curLat);
        longs += Number(curLong);
    }

    map.instance.setCenter(new google.maps.LatLng(lats/arrLength, longs/arrLength));
    // TODO set zoom by distance.
    map.instance.setZoom(5);

    return coordinates;
}