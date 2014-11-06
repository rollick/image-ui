Images = new Mongo.Collection("images");

if (Meteor.isServer) {
  Meteor.publish("images", function (limit) {
    if (typeof limit == 'undefined')
      limit = 99;

    return Images.find({}, {limit: limit, sort: {dateTaken: -1}});
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("images");

  Template.gallery.helpers({
    images: function () {
      return Images.find();
    }
  });

  Template.image.helpers({
    imagePath: function () {
      return "/images" + this.path.match(/\/Users\/onepercentclub\/Pictures\/Trip(.*?)$/)[1];
    }
  });

  Template.image.events({
    'click a': function (event, template) {
      event.preventDefault();

      event = event || window.event;
      var target = event.target || event.srcElement,
        link = target.src ? target.parentNode : target,
        options = {index: link, event: event},
        links = document.getElementsByTagName('a');

      blueimp.Gallery(links, options);
    }
  })
}
