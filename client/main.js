Meteor.subscribe('images');
Meteor.subscribe('slideshow');
    
window.gallery = gallery = null;

Meteor.startup(function () {
    Session.set('clientId', Math.random().toString(36).slice(2));

    Tracker.autorun(function (computation) {
        // There should only be one Slideshow for now
        var slideshow = Slideshow.findOne();
        if (slideshow) { 
            Session.set('slideshowId', slideshow._id);
            Session.set('currentSlide', slideshow.currentSlide);
            Session.set('slideClientId', slideshow.clientId);

            // Only do something with the current slide index if the gallery
            // has been loaded by the user.
            if (! gallery) return;

            // Update the current slideshow if the current slide index is different
            if (slideshow.currentSlide != gallery.getIndex()) {
                gallery.slide(slideshow.currentSlide);
            }
        }
    });
    
    Tracker.autorun(function (computation) {
        var currentSlide = Session.get('currentSlide'),
            slideshow = Slideshow.findOne();

        // Return if the slideshow collection hasn't been loaded
        if (! slideshow) return;

        // Updating the currentSlide is only possible if:
        // 1) the client has been set as the owner of the slideshow
        if (slideshow.clientId != Session.get('clientId')) return;

        // Now check if the current slide index is different to the 
        // stored value in the slideshow collection
        if (slideshow && slideshow.currentSlide != currentSlide) {
            Slideshow.update({_id: slideshow._id}, {$set: {currentSlide: currentSlide}});
        }
    });
});

function toggleControl() {
    // Toggle the control of the slideshow, or leave as is if 
    // controlled by another user.
    var data = {clientId: null};

    if (Session.get('clientId') != Session.get('slideClientId')) {
        data.clientId = Session.get('clientId');

        // Set the slide to the current index value
        data.currentSlide = gallery.getIndex();
    }

    Slideshow.update({_id: Session.get('slideshowId')}, {$set: data});
};

Template.main.events({
    'click .control': function () {
        toggleControl();
    }
});

Template.main.helpers({
    hasControl: function () {
        return Session.get('clientId') == Session.get('slideClientId');
    }
});

Template.gallery.rendered = function () {
    $('body').on('keydown', function (event) { 
        if (event.keyCode == 83) { // 's' key
            toggleControl();
        }
    }); 
};

Template.gallery.helpers({
  images: function () {
    return Images.find({}, {sort: {dateTaken: -1}});
  }
});

Template.image.helpers({
  imagePath: function () {
    return '/uploads' + this.relative_path;
  },

  thumbPath: function () {
    return '/thumbs/' + this.hash + '.jpg';
  }
});

Template.image.events({
  'click a': function (event, template) {
    event.preventDefault();

    event = event || window.event;
    var target = event.target || event.srcElement,
      link = target.src ? target.parentNode : target,
      links = document.getElementById('links').getElementsByTagName('a');
      
    var options = {
        index: link, 
        event: event,
        onslide: function (index, slide) {
            Session.set('currentSlide', index);
        },
        onclosed: function () {
            window.gallery = null;
        }
    };

    window.gallery = blueimp.Gallery(links, options);
  }
});
