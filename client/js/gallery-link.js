Template.GalleryLink.rendered = function() {
    // only layout gallery links if not a phone
    if (! Meteor.Device.isPhone()) {
        msnry.addItems(this.firstNode);
        msnry.layout();
    } else {
        $(this.firstNode).addClass('show mobile')
    }
};

Template.GalleryLink.events({
    'click div': function (event, template) {
        event.stopPropagation();
        event.preventDefault();

        Router.go('/' + this._id);
    }
});
