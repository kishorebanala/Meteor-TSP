/**
 * Created by Kishore on 6/20/2015.
 */

Meteor.startup(function () {
    // Configure Google Maps and load.
    GoogleMaps.load({
        v: '3',
        key: 'AIzaSyBCyHWSJ7wuGGCPHfc9zMJ0Iv-uhJ21iHo',
        libraries: 'geometry,places'
    });

    // Config SAlert for defaults.
    sAlert.config({
        effect: '',
        position: 'top',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        offset: 0
    });
});

// Route to URLs using Iron - Router
Router.route('/', function(){
    this.render('home');
});

Router.route('/routemap', function(){
    this.render('routemaplayout')
    /*this.layout('routemaplayout')*/
});

Router.route('/sessionexpired', function(){
    this.render('sessionexpiredlayout');
});

Router.route('/playground', function(){
    this.render('playground');
});

/*Router.configure({
    layoutTemplate: 'layout'
});*/

// External simple events.
Template.routemaplayout.events( {
    // Go back to home.
    "click .homenav" : function (event) {
        // This function is called when Find Optimal Route button is pressed.

        console.log("Routing back to home");

        // TODO kill current process.

        // go back to home page.
        Router.go('/');
    }
});

Template.sessionexpiredlayout.events( {
    // Go back to home.
    "click .homenav" : function (event) {
        // This function is called when Find Optimal Route button is pressed.

        console.log("Routing back to home");

        // TODO kill current process.

        // go back to home page.
        Router.go('/');
    }
});