/**
 * Created by Kishore on 7/6/2015.
 */

Meteor.startup(function() {

    if(TestLocations.find().count() === 0){
        Meteor.call('populateTestLocationsData', function(err, res){
            if(err){
                console.log("Failed to populate test data");
            }
            else{
                console.log("Insert test data success.")
            }
        });
    }
    if(TestDistanceMatrix.find().count() === 0){
        Meteor.call('populateTestDistMatrixData', function(err, res){
            if(err){
                console.log("Failed to populate test data");
            }
            else{
                console.log("Insert test data success.");
            }
        });
    }
});

Meteor.methods({
    populateTestLocationsData: function() {
        var data = JSON.parse(Assets.getText("testdata/USCitiesGeoLocations.json"));
        data.locations.forEach(function (item, index, array) {
            TestLocations.insert(item);
        });
        console.log("Test Locations Data inserted");
    },
    populateTestDistMatrixData: function() {
        var data = JSON.parse(Assets.getText("testdata/USCitiesDistanceMatrix.json"));
        TestDistanceMatrix.insert({
            distance_matrix: data.distance_table
        });
        console.log("Test Locations Data inserted");
    },
    getTestLocationsData: function() {
        var testLocations = TestLocations.find({}, {sort: {pos: 1}}).fetch();
        return testLocations;
    },
    getTestDistanceMatrixData: function() {
        var testDistMatrix = TestDistanceMatrix.find({}, {sort: {pos: 1}}).fetch();
        return testDistMatrix[0].distance_matrix;
    }
});

