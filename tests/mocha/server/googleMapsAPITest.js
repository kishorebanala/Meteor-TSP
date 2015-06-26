/**
 * Created by Kishore on 6/25/2015.
 */

if (!(typeof MochaWeb === 'undefined')){
    MochaWeb.testOnly(function(){
        describe("Google Maps API Test", function() {
            it("should get values from api call", function(callback){
                Meteor.call('fetchFromGoogleMapsAPI', "63368", function (err, respJson){
                    try {
                        chai.assert(!err);
                        chai.assert.equal(respJson.status, "OK");
                        callback();
                    }
                    catch(err){
                        callback(err);
                    }
                });
            })
        })
    });
}