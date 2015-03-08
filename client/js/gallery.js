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
    },

    'click .home': function () {
        $('.home').addClass('away').promise().done(function() {
            Router.go('/');
        });
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
};