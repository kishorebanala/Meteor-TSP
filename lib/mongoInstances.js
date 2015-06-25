/**
 * Created by Kishore on 6/20/2015.
 */

// On the server,
// it is backed by a MongoDB collection named "cities".
Cities = new Mongo.Collection("cities");

// Used to add incrementing sequence numbers.
Counter = new Mongo.Collection("counter");

// Test data of locations used by client.
TestData = new Mongo.Collection(("testdata"));

TestData.allow({
    insert: false,
    update: false,
    remove: false
})