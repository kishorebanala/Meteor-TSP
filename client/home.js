/**
 * Created by Kishore on 7/1/2015.
 */

Template.home.events({
    "click .testdata": function (event) {
        // This function is called when use test data button is pressed.

        console.log("Using Test Data");

        Session.set("isTestData", true);

        // go to route map page.
        Router.go('/routemap');
    }
});