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
    loaderCls: function () {
        return Session.get('loading') ? 'show' : '';
    },

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
    $('.home').removeClass('away');
};