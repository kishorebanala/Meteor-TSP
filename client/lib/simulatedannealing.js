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
function simulatedannealing() {
    var temperature = 10000; // Change to number of cities times a constant.
    var coolingRate = 0.999; // Determine this too from number of cities.
    var absoluteTemperature = 0.001; // Temperature we would like the system to cool down to.

    while (temperature > absoluteTemperature) {
        /*
         * Loop until system cools down (comes down to absoluteTemperature), at very slow rate (Annealing).
         */



        temperature *= coolingRate;
    }
}


/*
TODO Load next random map to calling function, using lazy loading, recursively.
Algorithm: Fisher - Yates Random Shuffle.
Input: a tour s, an array of integers

Next Route: Swap two cities (except start and end) in the route, recursively.

Output: a tour

*/
    function nextRandomRoute(initialRoute){
        var i = initialRoute.length,
            j = 0,
            temp;

        while (i--) {

            j = Math.floor(Math.random() * (i+1));

            // swap randomly chosen element with current element
            temp = initialRoute[i];
            initialRoute[i] = initialRoute[j];
            initialRoute[j] = temp;

        }

        return initialRoute;
    }

/*
Function: Compute cost of the Route.
Call Distance matrix with route variables, add them, return cost value;
 */

    function computeRouteCost(route){
        // Keep static distance matrix in hand.
        // matrix[route[0]][route[1]] + matrix[route[1]][route[2]] + matrix[route[0]][route[1]] + ...
        var cost = 0;
        var matrix = {}; // TODO temp var, remove after using original.
        for(i = 0; i < route.length; i++){
            j = i+1;
            cost += matrix[route[i],route[j]];
        }
        return cost;
    }

/*
Algorithm: expCoinFlip (s, s')
Input: two states s and s'

1.   p = exp ( -(cost(s') - cost(s)) / T)
2.   u = uniformRandom (0, 1)
3.   if u < p
    4.       return true
5.   else
6.       return false

Output: true (if coinFlip resulted in heads) or false

*/

    function jumpToNextRoute(presentCost, nextRouteCost){

        var p = Math.exp(-(nextRouteCost - presentCost) / temperature);
        var u = Math.random(); // Generates random number between 0 and 1, in decimals. could have any value in range.
                               // Test and change this value if required.
        if( u < p){
            return true;
        }
        else{
            return false;
        }
    }


/*

Cost Computation:

    Matrix[cities][cities] (Transpose Matrix)

for 3 * 3:
A B C
A 0 2 3
B 2 0 4
C 3 4 0

Getting values out of matrix:
    Map<city, index>

    eg: {(A, 1), (B,2), (C,3)}
Distance from B -> C = Matrix[2][3] or Matrix[B][C]*/

    getDistanceMatrix = function (locationsQuery) {
        // TODO Add to mongoDB collections?
        var distanceMatrix;

        // Use OSRM Distance API to compute distance matrix.
        Meteor.call('fetchFromOSRMDistanceAPI', locationsQuery, function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on fetchFromOSRMDistanceAPI. ", err);
            } else {
                console.log("respJson: ", respJson);
                distanceMatrix = respJson.distance_table;
            }
        });
        Session.set("distanceMatrixKey", distanceMatrix); // Keep distanceMatrix in the session, as we might need it again.
        return distanceMatrix;
    };

    function distance(city1, city2){
        var distanceMatrix  = Session.get("distanceMatrixKey");
        // TODO Check numberic values of city1 and city2;
        return distanceMatrix[city1][city2];
    }
