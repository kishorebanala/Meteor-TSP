/**
 * Created by Kishore on 6/20/2015.
 */

// Load Google Maps

Meteor.startup(function () {
    GoogleMaps.load({
        v: '3',
        key: 'AIzaSyBCyHWSJ7wuGGCPHfc9zMJ0Iv-uhJ21iHo',
        libraries: 'geometry,places'
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

Router.route('/playground', function(){
    this.render('playground');
});

/*Router.configure({
    layoutTemplate: 'layout'
});*/