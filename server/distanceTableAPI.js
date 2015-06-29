/**
 * Created by Kishore on 6/23/2015.
 */

Meteor.methods({
    fetchFromOSRMDistanceAPI: function(query) {
        console.log("fetchFromOSRMDistanceAPI method called");
        var endpoint = "http://router.project-osrm.org/table?"; // End point for OSRM Distance API.

        var url = endpoint + query;

        /*var result = Meteor.http.get(url, {timeout:30000});*/
        var result = HTTP.call("GET", url,{timeout:30000});
        if(result.statusCode==200) {
            console.log("Query executed successfully");
            var respJson = JSON.stringify(result.content);
            console.log("response received: ", respJson);
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = JSON.parse(result.content);
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    },
    fetchFromMapQuestDistanceAPI: function(requestBody) {
        console.log("fetchFromMapQuestDistanceAPI method called");
        var keys = "IDcZeD4DLeRfqNdAXAdgcaQgUz2H1tk2";
        var endpoint = "http://www.mapquestapi.com/directions/v2/routematrix?key=" // End point for OSRM Distance API.
        var url = endpoint + keys + "&" + requestBody;

        /*var result = Meteor.http.get(url, {timeout:30000});*/
        var result = HTTP.call("GET", url, { timeout:30000});
        if(result.statusCode==200) {
            console.log("Query executed successfully");
            var respJson = JSON.parse(result.content);
            console.log("response received: ", respJson);
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = JSON.parse(result.content);
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    }
});