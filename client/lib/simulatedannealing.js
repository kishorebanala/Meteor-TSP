/**
 * Created by Kishore on 6/22/2015.
 */

/*
Temperature:
    initial Temperature = // Large Number, to start loop.
    cooling rate = // (Alpha) 0.8 - 0.99
    absolute Temperature = // Smallest number, to end the loop.

// Loop until system cools down, at very slow rate (Annealing).
while(temperature > absTemperature){

    temperature *= coolingRate;
}
*/


simulatedAnnealing = function () {
    locationsArray = Cities.find({}, {sort: {pos: 1}}).fetch();
    // Get distance matrix or fail operation.
    getDistanceMatrix();
}

function startSimulatedAnnealing(distanceMatrix){
    if(distanceMatrix.length < 1){
        console.log("Failed to get Distance Matrix from APIs. Cancelling operation.");
        return false;
    }
    var locationsArrayLength = locationsArray.length;
    if(locationsArrayLength < 1){
        console.log("Invalid locations array, cancelling operation.");
        return false;
    }

    console.log("Simulated Annealing started.");

    var temperature = 10; //(locationsArrayLength * locationsArrayLength); // Change to number of cities times a constant.
    var coolingRate = 0.9; // Determine this too from number of cities.
    var absoluteTemperature = 0.001; // Temperature we would like the system to cool down to.
    var nextRoute = [];
    var temp = [];

    var initialRoute = locationsArray.slice();                // Staring route passed by user.
    var currentBestRoute = initialRoute.slice();           // Best route so far.
    var currentBestRouteCost = routeCost(currentBestRoute, distanceMatrix);

    console.log("Initial best route cost: ", currentBestRouteCost);

    while (temperature > absoluteTemperature) {
        /*
         * Loop until system cools down (comes down to absoluteTemperature), at very slow rate (Annealing).
         */

        // Randomly select next route.
        temp = initialRoute.slice();                    // Use temp var, as nextRandomRoute modifies implicitly. Initial route changes too, unlike Java.

        nextRoute = nextRandomRoute(temp);

        var initialRouteCost = routeCost(initialRoute, distanceMatrix);
        var nextRouteCost = routeCost(nextRoute, distanceMatrix);

        console.log("Initial Route cost: ", initialRouteCost);
        console.log("Next rand route: ", nextRouteCost);

        // If it's better, then switch to it.
        var isLessThan = (Math.round(nextRouteCost) < Math.round(initialRouteCost));
        console.log("isLessthan: ", isLessThan);
        if(isLessThan) {
            console.log("Routes swapped");
            initialRoute = nextRoute;

            var planCoords = getRoutePlanPath(initialRoute);
            Session.set("routePlan", planCoords);

            if(nextRouteCost < currentBestRouteCost) {
                currentBestRoute = nextRoute;
                currentBestRouteCost = nextRouteCost;

                console.log("Current Best cost: ", currentBestRouteCost);
            }
        }
        // Jump to next route based on probability function.
        else if(jumpToNextRoute(initialRouteCost, nextRouteCost, temperature)){
            initialRoute = nextRoute;
        }

        // Cool down the system.
        temperature *= coolingRate;
    }
    console.log("Best Route: ", currentBestRoute);
    console.log("Best Route Cost: ", currentBestRouteCost);
}


/*
Algorithm: Fisher - Yates Random Shuffle.
Input: a tour s, an array of integers

Next Route: Swap two locations (except start and end) in the route.

Output: a tour

*/
// TODO leave start and end points after test.
    function nextRandomRoute(route){
        var i = route.length,
            j = 0,
            temp;

        while (i--) {

            j = Math.floor(Math.random() * (i+1));

            // swap randomly chosen element with current element
            temp = route[i];
            route[i] = route[j];
            route[j] = temp;

        }

        return route;
    }

/*
Function: Compute cost of the Route.
Call Distance matrix with route variables, add them, return cost value;
 */

    function routeCost(route, distanceMatrix){
        // Keep static distance matrix in hand.
        // matrix[route[0]][route[1]] + matrix[route[1]][route[2]] + matrix[route[0]][route[1]] + ...
        var cost = 0;
        var i = 0;
        for(var j = 1; j < route.length; j++){
            i = j-1;
            cost += Number(distanceMatrix[Number(route[i].pos)][Number(route[j].pos)]);
        }
        return cost;
    }

/*
Function: Jump to next route (s, s')
Input: two states s and s'

1.   p = exp ( -(cost(s') - cost(s)) / T)
2.   u = uniformRandom (0, 1)
3.   if u < p
    4.       return true
5.   else
6.       return false

Output: true (if coinFlip resulted in heads) or false

*/

    function jumpToNextRoute(presentCost, nextRouteCost, temperature){

        var p = Math.exp(-(nextRouteCost - presentCost) / temperature);
        var u = Math.floor(Math.random()); // Generates random number between 0 and 1, in decimals. could have any value in range.
                               // Test and change this value if required.
        if( u < p){
            return true;
        }
        else{
            return false;
        }
    }


/*

Distance Matrix:

    Matrix[cities][cities] (Transpose Matrix)

for 3 * 3:
A B C
A 0 2 3
B 2 0 4
C 3 4 0

Getting values out of matrix:
    Map<city, index>

    eg: {(A, 1), (B,2), (C,3)}
Distance from B -> C = Matrix[2][3] or Matrix[B][C]

APIs for getting Distance Matrix:

By default, use MapQuest API as it has more uptime and support. But, MapQuest fails for calculating distance between intercontinental cities.
If MapQuest API fails, use OSRM API as back-up resource. OSRM is capable of calculating Intercontinental distance matrix, but this API is not for its up time,
maintenance and IP blocking for incorrect request format.

*/

    function getDistanceMatrix() {
        // Use OSRM Distance API to compute distance matrix.
        var locationsQuery = generateLocationsQuery(locationsArray, true); // Get query for MapQuest API as default.

        Meteor.call('fetchFromMapQuestDistanceAPI', locationsQuery, function (err, respJson) {
            if (err) {
                getDistanceMatrixFromBackUpAPI();
                var reason = "Error: " + err.reason;
                sAlert.error(reason, {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                sAlert.error("Failed to get data from MapQuest API. Trying with BackUp APIs.", {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                console.log("error occured on receiving data on fetchFromMapQuestDistanceAPI. ", err);
            } else {
                console.log("Response JSON for MapQuest: ", respJson);
                if(respJson.info.statuscode == Number(0)){
                    var distMatrix = respJson.distance;
                    console.log("All good at MQ: ", distMatrix);
                    startSimulatedAnnealing(distMatrix);
                }
                else{
                    getDistanceMatrixFromBackUpAPI();
                    sAlert.error("Failed to get data from MapQuest API. Trying with BackUp APIs.", {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                    console.log("Failed to get data from MapQuest API. Trying with BackUp APIs.");
                }
            }
        });
        /*var isErr = false;

        var respJson = Meteor.call('fetchFromOSRMDistanceAPI', locationsQuery);
        console.log("OSRM: ", respJson);
        if(respJson == null){
            isErr = true;
        }
        else{
            if(respJson.info.statuscode != Number(0)){
                isErr = true;
                sAlert.error("Failed to get data from MapQuest API. Trying with BackUp APIs.", {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                console.log("Failed to get data from MapQuest API. Trying with BackUp APIs.");
            }
            else{
                distanceMatrix = respJson.distance;
            }
        }
        if(isErr){
            distanceMatrix = getDistanceMatrixFromBackUpAPI(locationsArray);
        }*/
    };

    // TODO generate different queries for locations more than 25, or if one of the api fails.

    function generateLocationsQuery(isMapQuest){
        var locationsQuery= "";
        if(isMapQuest){
            var arrLength = locationsArray.length;
            locationsQuery = "json={locations: [ ";
            for (i = 0; i < arrLength; i++) {
                locationsQuery += "{latLng: {lat:" + locationsArray[i].latitude + ",lng:" + locationsArray[i].longitude + "}}";
                // Add coma at the end for each location except the last one. Works better than imploding array at minimal expense.
                if(i != (arrLength-1)){
                    locationsQuery += ",";
                }
            }
            locationsQuery += " ], options: {allToAll: true}}";

        }
        else {
            /*
             * Create locations query in OSRM format.
             * Since there are at least two locations all the time, and zeroth loc in query doesn't has '&',
             * Add zeroth manually instead of declaring blank var, and loop through to add rest.
             */
            locationsQuery = "loc=" + locationsArray[0].latitude + "," + locationsArray[0].longitude;
            var i;
            for (i = 1; i < locationsArray.length; i++) {
                locationsQuery += "&loc=" + locationsArray[i].latitude + "," + locationsArray[i].longitude;
            }
        }

        return locationsQuery;
    }

    function getDistanceMatrixFromBackUpAPI(){
        var locationsQuery = generateLocationsQuery(locationsArray, false); // This Query is not for default MapQuest API.
        Meteor.call('fetchFromOSRMDistanceAPI', locationsQuery, function (err, respJson) {
            if (err) {
                var reason = "Error: " + err.reason;
                sAlert.error(reason, {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                sAlert.error("Failed to get data from Backup APIs too. May be try again later?", {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                console.log("error occured on receiving data on fetchFromOSRMDistanceAPI. ", err);
            } else {
                if(respJson != null && respJson.distance_table != null){
                    console.log("Query successful from OSRM", respJson.distance_table);
                    Session.set("distanceMatrix", respJson.distance_table);
                    distanceMatrixReady.set(true);
                }
                else {
                    console.log("error occured on receiving data on fetchFromOSRMDistanceAPI. ");
                    sAlert.error("Failed to get data from Backup APIs too, May be try again later?.", {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                }
            }
        });
    }

    function getRoutePlanPath(initialRoute){
        var coordinates = [];

        // TODO debug only, set sessions from seperate function if useful.
        var arrLength = initialRoute.length;
        // Create Lat long Array.
        for(i=0; i < arrLength; i++){
            var curLat = initialRoute[i].latitude;
            var curLong = initialRoute[i].longitude;
            coordinates.push(new google.maps.LatLng(curLat, curLong));
        }

        return coordinates;
    }

    function distance(city1, city2){
        var distanceMatrix  = Session.get("distanceMatrixKey");
        // TODO Check numberic values of city1 and city2;
        return distanceMatrix[city1][city2];
    }
