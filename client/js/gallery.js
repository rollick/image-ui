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

Template.Gallery.events({
    'click .control': function () {
        toggleControl();
    }
});

Template.Gallery.helpers({
    question: function () {
        return Session.get('question');
    },
    questionCls: function () {
        return Session.get('question') ? 'question' : '';
    },
    images: function () {
        return Images.find({}, {sort: {date_taken: Session.get('sortDir')}});
    },
    hasControl: function () {
        return Session.get('clientId') == Session.get('slideClientId');
    }
});

Template.Gallery.rendered = function() {
    AnimatedEach.attachHooks(this.find("#links"));

    $('body').keypress(function (eventData, event) {
        if (String.fromCharCode(eventData.keyCode) == 'c') { // 'c' key for control
            toggleControl();
        } else if (String.fromCharCode(eventData.keyCode) == 's') { // 's' key for sort
            Session.set('sortDir', Session.get('sortDir') > 0 ? -1 : 1);
        }
    }); 

    // this.autorun(function (computation) {
    //     // There should only be one Slideshow for now
    //     var slideshow = Slideshow.findOne({gallery_id: });
    //     if (slideshow) { 
    //         Session.set('slideshowId', slideshow._id);
    //         Session.set('currentSlide', slideshow.currentSlide);
    //         Session.set('slideClientId', slideshow.clientId);

    //         // Only do something with the current slide index if the gallery
    //         // has been loaded by the user.
    //         if (! gallery) return;

    //         // Update the current slideshow if the current slide index is different
    //         if (slideshow.currentSlide != gallery.getIndex()) {
    //             gallery.slide(slideshow.currentSlide);
    //         }
    //     }
    // });
    
    // this.autorun(function (computation) {
    //     var currentSlide = Session.get('currentSlide'),
    //         slideshow = Slideshow.findOne();

    //     // Return if the slideshow collection hasn't been loaded
    //     if (! slideshow) return;

    //     // Updating the currentSlide is only possible if:
    //     // 1) the client has been set as the owner of the slideshow
    //     if (slideshow.clientId != Session.get('clientId')) return;

    //     // Now check if the current slide index is different to the 
    //     // stored value in the slideshow collection
    //     if (slideshow && slideshow.currentSlide != currentSlide) {
    //         Slideshow.update({_id: slideshow._id}, {$set: {currentSlide: currentSlide}});
    //     }
    // });
};