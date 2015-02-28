Galleries = new Mongo.Collection("galleries");

Meteor.startup(function () {
    // If there is no slideshow then create one
    if (Slideshow.find().count() == 0) {
        Slideshow.insert({});
    }
});

Meteor.publish("images", function (options) {
    if (! options.galleryId) return [];

    if (typeof options.limit == 'undefined') {
        options.limit = 99;
    }

    // Check if the gallery requires an answer to a question
    var gallery = Galleries.findOne({_id: options.galleryId});
    if (gallery.question && (!options.answer || options.answer.toLowerCase() != gallery.answer.toLowerCase())) {
        throw new Meteor.Error(401, "Incorrect answer to question", gallery.question);
    }

    console.log('Publishing images...');
    return Images.find({gallery_id: options.galleryId}, {
        fields: {
            _id: 1, 
            date_taken: 1,
            hash: 1,
            relative_path: 1,
            exif: 1,
            gallery_id: 1
        }
    });
});

Meteor.publish("slideshow", function () {
    console.log('Publishing slideshow...')

    return Slideshow.find({});
});
