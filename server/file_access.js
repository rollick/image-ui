// Note: for development we need a separate uploads directory for the 
//       servering the images. Production should use nginx etc.
var fs = Npm.require('fs');
WebApp.connectHandlers.use(function(req, res, next) {
  var re = /^\/(uploads|thumbs)\/(.*)$/.exec(req.url);

  console.log(req.url)

  // Only handle URLs that start with /uploads/*
  if (re !== null) {
      var filePath = process.env.PWD + '/.' + re[1] + '/' + re[2],
          data = fs.readFileSync(filePath, data);

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