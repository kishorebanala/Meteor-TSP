/**
 * Created by Kishore on 6/17/2015.
 */
/*
* Google Maps API Endpoint.
* */

if(Meteor.isServer){
    Meteor.methods({
        fetchFromService: function(query) {
            var url = "http://maps.googleapis.com/maps/api/geocode/json?address="+query;
            //synchronous GET
            //Meteor.http.accessKey = 'AIzaSyBCyHWSJ7wuGGCPHfc9zMJ0Iv-uhJ21iHo';
            var result = Meteor.http.get(url, {timeout:30000});
            if(result.statusCode==200) {
                var respJson = JSON.parse(result.content);
                console.log("response received.");
                return respJson;
            } else {
                console.log("Response issue: ", result.statusCode);
                var errorJson = JSON.parse(result.content);
                throw new Meteor.Error(result.statusCode, errorJson.error);
            }
        }
    });
}