
/**
 * Module dependencies.
 */

var express = require('express')
  , io = require('socket.io');

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server)
  , routes = require('./routes')
  , database = require('./lib/database');

// Make Socket.IO available in modules
module.exports.io = io;

// Pull in Quiz Master
var quizMaster = require('./lib/quizMaster');

// Initialize server
server.listen(3000);

// Configuration
app.configure(function(){
  app.set("view options", {layout: false});
  app.use(express.cookieParser('fhJY382YDAWXI'));
  app.use(express.session({secret: 'fhJY382YDAWXI'}));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.use(database);
//var quizMaster = new quizMaster();

// Quiz: Begin
//quizMaster.beginQuiz();
    
// HTTP Routes
app.post('/loginPlayer', function(req, res) {

  var error = false;

  // Check to see if a user already exists
  database.readUsers({
    email: req.body.email
  }, function(err, users) {
    if (err) {
      error = err;
    } else {
      // Check if user exists, if not, create it
      if (users.length === 0) {
        // New user logging in
        database.createUser({
          email: req.body.email
        }, function(err) {
          if (err) {
            error = err;
          } else {
            console.log('Created and logged in user', req.body.email);
          }
        });
      } else {
        console.log('Logged in user', req.body.email);
      }

      // Either way, set a username session key
      req.session.username = req.body.email;
      res.send({success: (error === false), error: error});

    }
  });

});

console.log('Listening on port 3000.');
