/**
 * Created by Kishore on 6/23/2015.
 */

Meteor.methods({
    fetchFromOSRMDistanceAPI: function(query) {
        console.log("fetchFromOSRMDistanceAPI method called");
        var endpoint = "http://router.project-osrm.org/table?"; // End point for OSRM Distance API.
        /*var query = "";

        // TODO perform optimization for queries greater than n locations.
        for(i = 0; i < locationsArray.length; i++){
            query += "&loc=" + locationsArray[i].latitude + "," + locationsArray[i].longitude;
        }*/

        var url = endpoint + query;

        console.log(url);

        var result = Meteor.http.get(url, {timeout:30000});
        if(result.statusCode==200) {
            console.log("Query executed successfully");
            var respJson = JSON.stringify(result.content);
            console.log("response received.");
            return respJson;
        } else {
            console.log("Response issue: ", result.statusCode);
            var errorJson = JSON.parse(result.content);
            throw new Meteor.Error(result.statusCode, errorJson.error);
        }
    }
});