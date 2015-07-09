// On the server,
// it is backed by a MongoDB collection named "cities".

Cities = new Mongo.Collection("cities");

if (Meteor.isClient) {

  Router.route('/', function () {
    this.render('hello');
  });

  // Load Google Maps
  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.leaderboard.helpers({
    cities: function () {
      return Cities.find({}, {sort: {createdAt: -1}});
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
      var formattedCity;

      //TODO Change error throwing mechanism for false requests.
      Meteor.call('fetchFromService', text, function (err, respJson) {
        if (err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err);
        } else {
          console.log("respJson: ", respJson);

          if(respJson.status == "OK") {
            formattedCityJson = respJson;
            formattedCity = formattedCityJson.results[0].formatted_address;

            Cities.insert({
              name: formattedCity,
              createdAt: new Date() // current time
            });
          }
          else{
            window.alert("Invalid City name/code. ");
          }
          console.log("formatted City: ", formattedCity);
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

      Router.route('/route', function() {
        this.render('ROUTE');
      });

      if(Cities.length < 1){
        // TODO Set error message.
        return;
      }

      // Debug
      document.getElementById("request").innerHTML = "Button Pressed";


      // Get all Cities names.
      var citiesReq = Cities.find(

      )
    }
  });

  Template.city.helpers({
    selected: function () {
      return Session.equals("selectedPlayer", this._id) ? "selected" : '';
    }
  });

  Template.city.events({
    'click': function () {
      Session.set("selectedPlayer", this._id);
    }
  });
}

// On server startup, create some cities if the database is empty.
if (Meteor.isServer) {

}