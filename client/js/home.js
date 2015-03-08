Template.Home.helpers({
    galleries: function () {
        return Galleries.find();
    }
});

Template.Home.rendered = function() {
    msnry = new Masonry('.banner', {itemSelector: '.gallery-link', isFitWidth: true});
    msnry.on('layoutComplete', function(msnryInstance, laidOutItems) {
        $(laidOutItems[laidOutItems.length - 1].element).addClass('show');
    });
};