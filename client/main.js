Meteor.subscribe('slideshow');

Session.setDefault('answer', null);
Session.setDefault('incorrectAnswer', null);
Session.setDefault('galleryId', null);
    
window.gallery = gallery = null;
answerTimer = questionTimer = null;

var min_x = 0,
    max_x = 0,
    min_y = 0,
    max_y = 0,
    filled_areas = new Array();

function check_overlap(area) {
    for (var i = 0; i < filled_areas.length; i++) {
        check_area = filled_areas[i];
        
        var bottom1 = area.y + area.height;
            bottom2 = check_area.y + check_area.height,
            top1 = area.y,
            top2 = check_area.y,
            left1 = area.x,
            left2 = check_area.x,
            right1 = area.x + area.width,
            right2 = check_area.x + check_area.width;

        if (bottom1 < top2 || top1 > bottom2 || right1 < left2 || left1 > right2) {
            continue;
        }
        return true;
    }
    return false;
}

Meteor.startup(function () {
    Session.setDefault('sortDir', 1);
    Session.set('clientId', Math.random().toString(36).slice(2));

    // Tracker.autorun(function (computation) {
    //     // There should only be one Slideshow for now
    //     var slideshow = Slideshow.findOne();
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
    
    // Tracker.autorun(function (computation) {
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

    Tracker.autorun(function (computation) {
        var galleryId = Session.get('galleryId'),
            answer = Session.get('answer');

        // Return if the slideshow collection hasn't been loaded
        // if (! galleryId) return;

        // Fetch images based on galleryId.
        // Pass gallery question answer if one is set.
        self.gallerySubscription = Meteor.subscribe("images", {galleryId: galleryId, answer: answer}, {
            onError: function (response) {
                // Is it a question / answer error?
                if (response.error == 401) {
                    // Display question with answer form by setting the question variable
                    Session.set('question', response.details);

                    // If there is already an answer then the visitor has entered
                    // an incorrect answer. Set variable to indicate this.
                    if (Session.get('answer')) {
                        Session.set('incorrectAnswer', true);

                        // clear incorrect answer flag after short time
                        Meteor.clearTimeout(answerTimer);
                        answerTimer = Meteor.setTimeout(function () {
                            Session.set('incorrectAnswer', null);
                        }, 500)
                    }
                }
            }, 
            onReady: function (response) {
                Session.set('incorrectAnswer', false);

                // Setting incorrect above will briefly indicate to the user
                // that they have correctly answered the question. Below will
                // set question to null causing the images to display.
                Meteor.clearTimeout(questionTimer);
                questionTimer = Meteor.setTimeout(function () {
                    Session.set('question', null);
                }, 500)
            }
        });
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

function toggleSort() {
    // Toggle sorting the gallery.
    Session.set('sortDir', Session.get('sortDir') > 0 ? -1 : 1);
}

Router.route('/', function () {
    filled_areas = new Array();
    max_x = document.body.clientWidth - document.body.clientWidth/10;
    max_y = document.body.clientHeight - document.body.clientHeight/10;

    Session.setDefault('galleryId', null);

    Session.setDefault('showGalleryLinks', false);
    Meteor.subscribe('galleries', { 
        onReady: function (response) {
            Session.set('showGalleryLinks', true);
        }
    });
    this.render('Home');
});

Router.route('/:galleryId', function () {
    Session.set('answer', null);
    Session.set('question', null);
    Session.set('incorrectAnswer', null);
    Session.set('galleryId', this.params.galleryId);

    Meteor.clearTimeout(answerTimer);
    Meteor.clearTimeout(questionTimer);
    this.render('Gallery');
});

Template.Home.helpers({
    galleries: function () {
        return Galleries.find();
    }
});

Template.GalleryLink.rendered = function() {
    var element = $(this.firstNode),
        rand_x = 0,
        rand_y = 0,
        area;

    do {
        rand_x = Math.round(min_x + ((max_x - min_x)*(Math.random() % 1)));
        rand_y = Math.round(min_y + ((max_y - min_y)*(Math.random() % 1)));
        area = {x: rand_x, y: rand_y, width: element.width(), height: element.height()};
    } while(check_overlap(area));
    
    filled_areas.push(area);

    // display gallery link with random delay
    var items = [100, 200, 300, 400, 500],
        delay = items[Math.floor(Math.random()*items.length)];

    element.css({left:rand_x, top: rand_y}).delay(delay).addClass('show');
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

    $('body').on('keydown', function (event) {
        if (event.keyCode == 67) { // 'c' key for control
            toggleControl();
        } else if (event.keyCode == 83) { // 's' key for sort
            toggleSort();
        }
    }); 
};

Template.Question.events({
    'submit': function (event, template) {
        event.stopPropagation();
        event.preventDefault();

        var answer = template.find('.qa .answer input').value;
        Session.set('answer', answer);
    },

    'keyup input': function (event, template) {
        var answer = template.find('.qa .answer input').value;
        if (answer.length == 0) Session.set('incorrectAnswer', null);
    }
});

Template.Question.helpers({
    cls: function () {
        if (Session.get('incorrectAnswer') == null) {
            return '';
        } else if (Session.get('incorrectAnswer')) {
            return 'incorrect';
        } else {
            return 'correct';
        }
    }
});

Template.Question.rendered = function() {
    this.find('input').focus();
}

Template.Image.helpers({
  imagePath: function () {
    // Image size returned should be based on browser window size
    var maxSize = Math.max(window.outerWidth, window.outerHeight),
        sizeLabel = 'small';

    if (maxSize > 640 && maxSize <= 1024) {
        sizeLabel = 'medium';
    } else if (maxSize > 1024 && maxSize <= 1280) {
        sizeLabel = 'large';
    } else {
        sizeLabel = 'xlarge';
    }

    return '/resized/' + this.hash + '_' + sizeLabel + '.jpg';
  },

  thumbPath: function () {
    return '/resized/' + this.hash + '_thumb.jpg';
  }
});

Template.Image.events({
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
