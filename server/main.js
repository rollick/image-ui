Meteor.publish("images", function (limit) {
if (typeof limit == 'undefined')
  limit = 99;

console.log('Publishing images...')

return Images.find({}, {
  fields: {
    _id: 1, 
    dateTaken: 1,
    hash: 1,
    relative_path: 1
  }});
});
