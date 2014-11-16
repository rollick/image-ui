Meteor.subscribe("images");

Template.gallery.helpers({
  images: function () {
    return Images.find({}, {sort: {dateTaken: -1}});
  }
});

Template.gallery.rendered = function() {
  AnimatedEach.attachHooks(this.find(".links"), this.find("body"));
};

Template.image.helpers({
  imagePath: function () {
    return "/uploads" + this.relative_path;
  },

  thumbPath: function () {
    return "/thumbs/" + this.hash + ".jpg";
  }
});

Template.image.events({
  'click a': function (event, template) {
    event.preventDefault();

    event = event || window.event;
    var target = event.target || event.srcElement,
      link = target.src ? target.parentNode : target,
      options = {index: link, event: event},
      links = document.getElementById('links').getElementsByTagName('a');

    blueimp.Gallery(links, options);
  }
});
