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