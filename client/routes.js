answerTimer = questionTimer = gallery = null;

Router.route('/', {
    onBeforeAction: function () {
        filled_areas = new Array();
        max_x = document.body.clientWidth;
        max_y = document.body.clientHeight;

        Session.setDefault('showGalleryLinks', false);
        this.next();
    },

    subscriptions: function() {
        Meteor.subscribe('galleries', { 
            onReady: function (response) {
                Session.set('showGalleryLinks', true);
            }
        });
    },

    action: function () {
        // render all templates and regions for this route
        this.render('Home');
    }
});

Router.route('/:galleryId', {
    onStop: function () {
        Session.set('answer', null);
        Session.set('question', null);
        Session.set('incorrectAnswer', null);
        
        Meteor.clearTimeout(answerTimer);
        Meteor.clearTimeout(questionTimer);
    },

    subscriptions: function() {
        Session.set('loading', true);

        var galleryId = this.params.galleryId,
            answer = Session.get('answer');

        // Return if the slideshow collection hasn't been loaded
        // if (! galleryId) return;

        // Fetch images based on galleryId.
        // Pass gallery question answer if one is set.
        this.subscribe("images", {galleryId: galleryId, answer: answer}, {
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

                Session.set('loading', false);
            }, 
            onReady: function (response) {
                Session.set('incorrectAnswer', false);
                Session.set('loading', false);

                // Setting incorrect above will briefly indicate to the user
                // that they have correctly answered the question. Below will
                // set question to null causing the images to display.
                Meteor.clearTimeout(questionTimer);
                questionTimer = Meteor.setTimeout(function () {
                    Session.set('question', null);
                }, 500)
            }
        });
    },

    action: function () {
        this.render('Gallery');
    }
});
