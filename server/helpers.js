/**
 * Created by Kishore on 6/24/2015.
 */

// Add collections to Sortable library.
'use strict';

Sortable.collections = ['cities'];

// Add some data to locations board, if nothing is present.
Meteor.startup(function() {
    // Clear locations data.
    Cities.remove({});

    if (Cities.find().count() === 0) {
        [
            { name: 'New York, NY, USA', latitude: '40.7127837', longitude: '-74.0059413' },
            { name: 'Seattle, WA, USA', latitude: '47.6062095', longitude: '-122.3320708' },
            { name: 'Atlanta, GA, USA', latitude: '33.7489954', longitude: '-84.3879824' },
            { name: 'San Francisco, CA, USA', latitude: '37.7749295', longitude: '-122.4194155' },
            { name: 'Austin, TX, USA', latitude: '30.267153', longitude: '-97.743060' }
        ].forEach(function (location, i) {
                Cities.insert({
                    name: location.name,
                    latitude: location.latitude,
                    longitude: location.longitude,
                    pos: i
                });
            }
        );
        console.log('Launched app with sample data.');
    }

    // Clear route markers.
    RouteMarkers.remove({});
});
/*
 * Custom method, used along with RubaXa Sotrable library.
 * Sortable library has a limitation, the sequential ids of items are not updated on delete.
 * Ex: in 1,2,3,4,5 : on deleting 4, the list still remains as 1,2,3,5 instead of 1,2,3,4.
 * This method updates succeeding ID numbers.
 * @param {String} collectionName: Name of the collection.
 * @param {String} item: pointer to item to be deleted.
 */
Meteor.methods({
   updateCollectionOnDelete: function( collectionName, item ) {
       var collection = Mongo.Collection.get(collectionName);
       var count = collection.find().count();
       var i;
       for(i = item.pos; i < count; i++){
            collection.update({pos: (i+1)}, { $set: {pos: i}});
       }
       console.log("Location %s removed.", item.name);
       collection.remove(item._id);
   },
    updateMarkers: function( collectionName, planCoords ) {
        var markerCollection = Mongo.Collection.get(collectionName);
        markerCollection.update({}, {$set: {markers: planCoords}});
    }
});
