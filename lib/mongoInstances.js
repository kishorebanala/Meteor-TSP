/**
 * Created by Kishore on 6/20/2015.
 */

// On the server,
// it is backed by a MongoDB collection named "cities".
Cities = new Mongo.Collection("cities");

// Test data of locations used by client.
TestLocations = new Mongo.Collection("testlocations");

TestDistanceMatrix = new Mongo.Collection("testdistancematrix");

// Make sure test data is not removed by user.
TestLocations.allow({
    insert: false,
    update: false,
    remove: false
});

TestDistanceMatrix.allow({
    insert: false,
    update: false,
    remove: false
});