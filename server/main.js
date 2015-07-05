Meteor.startup(function () {
    // If there is no slideshow then create one
    if (Slideshow.find().count() == 0) {
        Slideshow.insert({});
    }
});

Meteor.publish("galleries", function () {
    console.log('Publishing galleries...');
    return Galleries.find({}, {
        fields: {
            _id: 1,
            name: 1
        }
    });
});

Meteor.publish("images", function (options) {
    if (! options.galleryId) {
        return this.stop();
    }

    if (typeof options.limit == 'undefined') {
        options.limit = 99;
    }

    // Check if the gallery requires an answer to a question
    var gallery = Galleries.findOne({_id: options.galleryId});
    if (gallery.question && (!options.answer || options.answer.toLowerCase() != gallery.answer.toLowerCase())) {
        throw new Meteor.Error(401, "Incorrect answer to question", gallery.question);
    }

    console.log('Publishing images...');

    var fields = {
        _id: 1, 
        date_taken: 1,
        hash: 1,
        relative_path: 1,
        exif: 1,
        gallery_id: 1,
        tags: 1
    };

    // Images can be filtered by one or more sets of 
    // tags. eg:
    // tags = ['red', 'blue'] or
    // tags = [['red', 'blue'], ['green', 'brown']]
    var tags = options.tags;
    if (_.isArray(tags) && ! _.isEmpty(tags)) {
        var tagsQuery = {$or: []};

        // Test if a single set of tags or multiple
        if (_.isArray(tags[0])) {
            // Return an array of image cursors based on 
            // each set of tags.
            _.each(tags, function (tagSet) {
                tagsQuery['$or'].push({tags: {$all: tagSet}});      
            });
        } else {
            tagsQuery['$or'].push({tags: {$all: tags}});
        }

        // Return a image cursor based on tags.
        console.log(JSON.stringify(tagsQuery));

        return Images.find({
            $and: [
                {gallery_id: options.galleryId},
                tagsQuery
            ]
        }, {
            fields: fields
        });
    } else {
        // Return a image cursor based without tags query.
        return Images.find({gallery_id: options.galleryId}, {
            fields: fields
        });  
    }

});

Meteor.publish("slideshow", function () {
    console.log('Publishing slideshow...')

    return Slideshow.find({});
});
