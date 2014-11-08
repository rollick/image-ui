Images = new Mongo.Collection("images");

if (Meteor.isServer) {
  // Note: for development we need a separate uploads directory for the 
  //       servering the images. Production should use nginx etc.
  var fs = Npm.require('fs');
  WebApp.connectHandlers.use(function(req, res, next) {
      var re = /^\/uploads\/(.*)$/.exec(req.url);

      // Only handle URLs that start with /uploads/*
      if (re !== null) {   
          var filePath = process.env.PWD + '/.uploads/' + re[1];
          var data = fs.readFileSync(filePath, data);
          res.writeHead(200, {
            'Content-Type': 'image'
          });

          res.write(data);
          res.end();
      } else {  
          // Other urls will have default behaviors
          next();
      }
  });

  Meteor.publish("images", function (limit) {
    if (typeof limit == 'undefined')
      limit = 99;

    console.log('Publishing images...')

    return Images.find();
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("images");

  Template.gallery.helpers({
    images: function () {
      return Images.find({}, {sort: {dateTaken: 1}}).fetch();
    }
  });

  Template.gallery.rendered = function() {
    AnimatedEach.attachHooks(this.find(".links"));
  };

  Template.image.helpers({
    imagePath: function () {
      return "/uploads/images" + this.path.match(/\/Users\/onepercentclub\/Pictures\/Trip(.*?)$/)[1];
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
  });
}
