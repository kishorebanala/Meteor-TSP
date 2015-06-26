/**
 *
 * Created by Kishore on 6/20/2015.
 */

Template.leaderboard.helpers({
    cities: function () {
        return Cities.find({}, {sort: {pos: 1}});
    },
    locationsSortableOptions: {
        sortField: 'pos', // Should be specified, defaults to 'order'.
        group: {
            name: 'typeDefinition',
            put: true     // Allow adding new elements.
        },
        // event handler for reordering attributes
        onSort: function (event) {
            console.log('Item %s went from #%d to #%d',
                event.data.name, event.oldIndex, event.newIndex
            );
        }
    }
});

Template.leaderboard.events({
    "click .delete": function () {
        var curCitiesCount = Cities.find({}, {sort: {pos: 1}}).count();
        if (curCitiesCount < 2) {
            // TODO change to pop-up alert.
            sAlert.error('Cannot delete, Add at least two items to compute route.', {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
            console.log("Cannot delete, Add at least two items to compute route.");
            return;
        }
        Meteor.call('updateCollectionOnDelete', 'cities', this);
        //Cities.remove(this._id);
    },

    "submit .new-location": function (event) {
        // This function is called when the new task form is submitted
        var text = event.target.text.value;

        if (text == "" || text == null) {
            sAlert.error('Location name/code cannot be empty.', {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
            return false;
        }

        var formattedCityJson;

        //TODO Change error throwing mechanism for false requests.
        Meteor.call('fetchFromGoogleMapsAPI', text, function (err, respJson) {
            if (err) {
                var reason = "Error: " + err.reason;
                sAlert.error(reason, {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                console.log("error occured on receiving data on server. ", err);
            } else {
                if(respJson.status == "OK") {
                    formattedCityJson = respJson.results[0]; // Get first array of results. Ignore others as of now.
                    /*
                     * Get last element from the collection, and append its position number by 1.
                     * This works, as there is at least one element in the collection, all the time.
                     * Though its not optimal to query db for adding each field, this works best in this instance,
                     * as the number of cities added will usually be in the range of [3 - 100] most of the time,
                     * and it doesn't has to wait on others for events.
                     */
                    var newPos = Cities.findOne({}, {sort: {pos: -1}});

                    // Insert into collection.
                    Cities.insert({
                        name: formattedCityJson.formatted_address,
                        latitude: formattedCityJson.geometry.location.lat,
                        longitude: formattedCityJson.geometry.location.lng,
                        pos: (newPos.pos + 1)
                    });
                }
                else{
                    // TODO Change to pop-up alert.
                    sAlert.error('Invalid location name/code.', {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
                }
            }
        });

        // Clear form
        event.target.text.value = "";

        // Prevent default form submit
        return false;
    },

    "click .request": function (event) {
        // This function is called when Find Optimal Route button is pressed.

        console.log("Button Clicked");

        // TODO set message of console in dom.
        if(Cities.find().count() < 2){
            sAlert.error('Enter at least two locations to compute route.', {effect: 'genie', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '80px'});
            return;
        }

        // go to route map page.
        Router.go('/routemap');
    }
});
/*
 * Get the incrementing Id number for each location added. This is required to track cities while shuffling.
 */
function getNextSequenceNumber(loc_name){
    Counter.update(loc_name, {$inc: {seq: 1}});

    var ret = Counter.find("seq");

    console.log(ret);

    return ret.seq;
}