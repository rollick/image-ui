Template.GalleryLink.rendered = function() {
    msnry.addItems(this.firstNode);
    msnry.layout();
};

Template.GalleryLink.events({
    'click div': function (event, template) {
        event.stopPropagation();
        event.preventDefault();

        Router.go('/' + this._id);
    }
});
