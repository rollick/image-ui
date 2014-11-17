Meteor.startup(function () {
    // If there is no slideshow then create one
    if (Slideshow.find().count() == 0) {
        Slideshow.insert({});
    }
});

Meteor.publish("images", function (limit) {
    if (typeof limit == 'undefined') {
        limit = 99;
    }

    console.log('Publishing images...');

    return Images.find({}, {
        fields: {
            _id: 1, 
            date_taken: 1,
            hash: 1,
            relative_path: 1,
            exif: 1
        }
    });
});

Meteor.publish("slideshow", function () {
    console.log('Publishing slideshow...')

    return Slideshow.find({});
});
