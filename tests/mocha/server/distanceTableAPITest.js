/**
 * Created by Kishore on 6/25/2015.
 */

if (!(typeof MochaWeb === 'undefined')){
    MochaWeb.testOnly(function(){
        //TODO test it before deploying.
        describe("OSRM Distance Matrix API Test", function() {
            it("should get values from api call", function(callback){

                var query = "loc=52.554070,13.160621&loc=52.431272,13.720654&loc=52.554070,13.720654&loc=52.554070,13.160621";

                Meteor.call('fetchFromOSRMDistanceAPI', query, function (err, respJson){
                    try {
                        chai.assert(!err);
                        /*chai.assert(respJson.distance_table);*/
                        callback();
                    }
                    catch(err){
                        callback(err);
                    }
                });
            })
        })/*,
        describe("MapQuest Distance Matrix API Test", function() {
            it("should get values from api call", function(callback){

                var requestBody = {
                    locations: [
                        "52.554070,13.160621",
                        "41.878113,-87.629798",
                        "38.951674,-92.332540",
                        "30.267153,-97.743060"
                    ],
                    options:
                    {
                        allToAll: true
                    }


                };

                Meteor.call('fetchFromMapQuestDistanceAPI', requestBody, function (err, respJson){
                    try {
                        chai.assert(!err);
                        /!*chai.assert.include(respJson, 'distance_table');*!/
                        callback();
                    }
                    catch(err){
                        callback(err);
                    }
                });
            })
        })*/
    });
}