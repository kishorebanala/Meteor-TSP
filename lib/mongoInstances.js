/**
 * Created by Kishore on 6/20/2015.
 */

// On the server,
// it is backed by a MongoDB collection named "cities".
Cities = new Mongo.Collection("cities");

// Update route markers every time a better route is found, and draw new polyline in the map, reactively.
RouteMarkers = new Mongo.Collection("routemarkers");

// Test data of locations used by client.
TestLocations = new Mongo.Collection("testlocations");

TestDistanceMatrix = new Mongo.Collection("testdistancematrix");

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