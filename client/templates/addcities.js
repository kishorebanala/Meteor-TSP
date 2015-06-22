/**
 *
 * Created by Kishore on 6/20/2015.
 */


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
