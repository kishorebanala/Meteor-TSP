/**
 *
 * Created by Kishore on 6/20/2015.
 */
Meteor.startup(function(){
    // Initialize Counter to zero. This is used to add auto-incrementing id numbers to collections.
    Counter.insert({
        locid: "loc_id",
        seq: 0
    })
})

Template.leaderboard.helpers({
    cities: function () {
        return Cities.find({}, {sort: {createdAt: 1}});
    }
});

Template.leaderboard.events({
    "click .delete": function () {
        Cities.remove(this._id);
    },

    "submit .new-task": function (event) {
        // This function is called when the new task form is submitted
        var text = event.target.text.value;

        if (text == "" || text == null) {
            return;
        }

        var formattedCityJson;

        //TODO Change error throwing mechanism for false requests.
        Meteor.call('fetchFromGoogleMapsAPI', text, function (err, respJson) {
            if (err) {
                window.alert("Error: " + err.reason);
                console.log("error occured on receiving data on server. ", err);
            } else {
                if(respJson.status == "OK") {
                    formattedCityJson = respJson.results[0]; // Get first array of results. Ignore others as of now.

                    Cities.insert({
                        name: formattedCityJson.formatted_address,
                        latitude: formattedCityJson.geometry.location.lat,
                        longitude: formattedCityJson.geometry.location.lng,
                        createdAt: new Date() // current time
                    });
                }
                else{
                    window.alert("Invalid City name/code. ");
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

        /*if(Cities.length < 1){
            // TODO Set error message.
            console.log("No Cities given.");
            return;
        }*/

        // TODO go to map.
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