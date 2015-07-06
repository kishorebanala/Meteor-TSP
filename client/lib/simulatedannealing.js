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

startSimulatedAnnealing = function(distanceMatrix, locationsArray){
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

    // Start with number of all possible routes.
    var temperature = calculateFactorial(locationsArrayLength); //Math.pow(2, locationsArrayLength); //(locationsArrayLength * locationsArrayLength);
    var coolingRate = calculateCoolingRate(locationsArrayLength); // Determine this too from number of cities.
    var absoluteTemperature = 0.001; // Temperature we would like the system to cool down to.
    var nextRoute = [];
    var temp = [];

    console.log("Initial Temp: ", temperature);
    console.log("Cooling rate: ", coolingRate);

    var initialRoute = locationsArray.slice();                // Staring route passed by user.
    var currentBestRoute = initialRoute.slice();           // Best route so far.
    var currentBestRouteCost = routeCost(currentBestRoute, distanceMatrix);

    drawInitialPolyline(initialRoute);      // Show initial or user selected route on map.
    var numberOfIterations = 0;

    while (temperature > absoluteTemperature) {
        /*
         * Loop until system cools down (comes down to absoluteTemperature), at very slow rate (Annealing).
         */

        // Randomly select next route.
        temp = initialRoute.slice();                    // Use temp var, as nextRandomRoute modifies implicitly. Initial route changes too, unlike Java.

        nextRoute = nextRandomRoute(temp);

        var initialRouteCost = routeCost(initialRoute, distanceMatrix);
        var nextRouteCost = routeCost(nextRoute, distanceMatrix);

        //console.log("Initial Route cost: ", initialRouteCost);
        //console.log("Next rand route: ", nextRouteCost);

        if(nextRouteCost < initialRouteCost) {
            //console.log("Next rand route: ", nextRouteCost);
            initialRoute = nextRoute;

            if(nextRouteCost < currentBestRouteCost) {
                currentBestRoute = nextRoute;
                currentBestRouteCost = nextRouteCost;
                Meteor.setTimeout(function(){
                    setNewRoutePath(currentBestRoute);
                }, 1000);
                console.log("Current Best: ", currentBestRouteCost);
            }
        }
        // Jump to next route based on probability function.
        else if(jumpToNextRoute(initialRouteCost, nextRouteCost, temperature)){
            initialRoute = nextRoute;
        }

        // Cool down the system.
        temperature *= coolingRate;
        numberOfIterations += 1;
        //console.log("Temp: ", temperature);
    }
    console.log("Iter count: ", numberOfIterations);
    console.log("Best Route: ", currentBestRoute);
    console.log("Best Route Cost: ", currentBestRouteCost);
    // Draw markers with Tracker Dependency.
    setBestRoutePath(currentBestRoute);
    NProgress.done();

}


/*
Algorithm: Fisher - Yates Random Shuffle.
Input: a tour s, an array of integers

Next Route: Swap two locations (except start and end) in the route.

Output: a tour

*/
function nextRandomRoute(route){
    var i = route.length -1,
        j = 0,
        temp;

    while (i--) {

        j = Math.floor(Math.random() * (i+1));

        // swap randomly chosen element with current element
        if(!(i ==0 || j == 0)) {
            temp = route[i];
            route[i] = route[j];
            route[j] = temp;
        }
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

// Factorial of a number.
function calculateFactorial(num){
    if (num === 0)
    { return 1; }
    else
    { return num * calculateFactorial( num - 1 ); }
}

// Calculate based on number of locations passed.
function calculateCoolingRate(num){
    var coolRate = "0.9";
    if(num < 5){
        return 0.99;
    }
    for(var i=0; i < Math.round(num/4); i++){
        coolRate += "9";
    }
    return Number(coolRate);
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

    runSimulatedAnnealingWithTestData = function () {
        Meteor.call('getTestLocationsData', function(err, res){
           if(err){
               console.log("Failed to get test locations data.");
           }
            else{
               var locationsData = res;
               Meteor.call('getTestDistanceMatrixData', function(err, distMatrix){
                   if(err){
                       console.log("Failed to get test distance matrix data.");
                   }
                   else{
                       console.log("Starting simulated annealing from call back");
                       startSimulatedAnnealing(distMatrix, locationsData);
                   }
               })
           }
        });
    }

    // TODO pass in locations query.
    runSimulatedAnnealingAsync = function() {
        var locationsArray = Cities.find({}, {sort: {pos: 1}}).fetch();
        var locationsQuery = generateLocationsQuery(locationsArray, true); // Get query for MapQuest API as default.
        var distMatrix = [];

        Meteor.call('fetchFromMapQuestDistanceAPI', locationsQuery, function (err, respJson) {
            if (err) {
                getDistanceMatrixFromBackUpAPI(locationsArray);
                var reason = "Error: " + err.reason;
                sAlert.error(reason, {effect: 'stackslide', position: 'top-right', timeout: '5000', onRouteClose: false, stack: true, offset: '80px'});
                sAlert.error("Failed to get data from MapQuest API. Trying with BackUp APIs.", {effect: 'stackslide', position: 'top-right', timeout: '5000', onRouteClose: false, stack: true, offset: '80px'});
                console.log("error occured on receiving data on fetchFromMapQuestDistanceAPI. ", err);
            } else {
                console.log("Response JSON for MapQuest: ", respJson);
                if(respJson.info.statuscode == Number(0)){
                    distMatrix = respJson.distance;
                    Session.set('isDistMatReady', true);
                    startSimulatedAnnealing(distMatrix, locationsArray);
                }
                else{
                    getDistanceMatrixFromBackUpAPI(locationsArray);
                    sAlert.error("Failed to get data from MapQuest API. Trying with BackUp APIs.", {effect: 'stackslide', position: 'top-right', timeout: '6000', onRouteClose: false, stack: true, offset: '80px'});
                    console.log("Failed to get data from MapQuest API. Trying with BackUp APIs.");
                }
            }
        });
    }

    // TODO generate different queries for locations more than 25, or if one of the api fails.

    function generateLocationsQuery(locationsArray, isMapQuest){
        var locationsQuery= "";
        if(isMapQuest){
            var arrLength = locationsArray.length;
            locationsQuery = "json={locations: [ ";
            for (i = 0; i < arrLength; i++) {
                locationsQuery += "{latLng: {lat:" + locationsArray[i].lat + ",lng:" + locationsArray[i].lng + "}}";
                // Add coma at the end for each location except the last one. Works better than imploding array at minimal expense.
                if(i != (arrLength-1)){
                    locationsQuery += ",";
                }
            }
            locationsQuery += " ], options: {allToAll: true}}";

        }
        else {
             // Create locations query in OSRM format.
             // Since there are at least two locations all the time, and zeroth loc in query doesn't has '&',
             // Add zeroth manually instead of declaring blank var, and loop through to add rest.
            locationsQuery = "loc=" + locationsArray[0].lat + "," + locationsArray[0].lng;
            var i;
            for (i = 1; i < locationsArray.length; i++) {
                locationsQuery += "&loc=" + locationsArray[i].lat + "," + locationsArray[i].lng;
            }
        }

        return locationsQuery;
    }

    function getDistanceMatrixFromBackUpAPI(locationsArray){
        var locationsQuery = generateLocationsQuery(locationsArray, false); // This Query is not for default MapQuest API.
        Meteor.call('fetchFromOSRMDistanceAPI', locationsQuery, function (err, respJson) {
            if (err) {
                var reason = "Error: " + err.reason;
                sAlert.error(reason, {effect: 'stackslide', position: 'top-right', timeout: '5000', onRouteClose: false, stack: true, offset: '80px'});
                sAlert.error("Failed to get data from Backup APIs too. May be try again later?", {effect: 'stackslide', position: 'top-right', timeout: 'none', onRouteClose: false, stack: true, offset: '80px'});
                console.log("error occured on receiving data on fetchFromOSRMDistanceAPI. ", err);
            } else {
                if(respJson != null && respJson.distance_table != null){
                    console.log("Query successful from OSRM", respJson.distance_table);
                    startSimulatedAnnealing(respJson.distance_table, locationsArray);
                }
                else {
                    console.log("error occured on receiving data on fetchFromOSRMDistanceAPI. ");
                    sAlert.error("Failed to get data from Backup APIs too, May be try again later?.", {effect: 'stackslide', position: 'top-right', timeout: 'none', onRouteClose: false, stack: true, offset: '80px'});
                }
            }
        });
    }
