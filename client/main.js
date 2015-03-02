Meteor.subscribe('slideshow');

Meteor.startup(function () {
    Session.setDefault('sortDir', 1);
    Session.set('clientId', Math.random().toString(36).slice(2));
    Session.setDefault('answer', null);
    Session.setDefault('incorrectAnswer', null);
    Session.setDefault('galleryId', null);
});
