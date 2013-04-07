
/**
 * Module dependencies.
 */

var express = require('express')
  , io = require('socket.io')
  , crypto = require('crypto');

var app = express()
  , server = require('http').createServer(app)
  , io = io.listen(server)
  , routes = require('./routes')
  , database = require('./lib/database');

// Make Socket.IO available in modules
module.exports.io = io;

// Pull in Quiz Master
var QuizMaster = require('./lib/quizMaster');

// Initialize server
server.listen(3000);

// Configuration
app.configure(function(){
  app.set("view options", {layout: false});
  app.use(express.cookieParser('fhJY382YDAWXI'));
  app.use(express.session({cookie: { path: '/', httpOnly: true, expires: false}, secret: 'fhJY382YDAWXI'}));
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
var quizMaster = new QuizMaster();
quizMaster.init();

io.sockets.on('connection', function (socket) {
  socket.on('startQuiz', function (data) {
    quizMaster.beginQuiz();
  });
});

// Quiz: Begin
//quizMaster.beginQuiz();
    
// HTTP Routes
app.post('/loginAdmin', function(req, res) {
  var error = false;

  database.readUsers({
    username: 'admin',
    password: req.body.password
  }, function(err, users) {
    if (err) {
      error = err;
    } else {
      if (users.length === 0) {
        error = 'Password does not match';
      } else {
        console.log('Admin logged in');
        req.session.username = 'admin';
        // Hash the username and password as a pseudo-secure admin token
        var sha = crypto.createHash('sha1');
        sha.update(req.body.username + req.body.password);
        req.session.admin = sha.digest('hex');
      }
    }

    res.send({success: (error === false), error: error, session: req.session});
  });
});

app.post('/loginPlayer', function(req, res) {

  var error = false;

  // Check to see if a user already exists
  database.readUsers({
    username: req.body.username
  }, function(err, users) {
    if (err) {
      error = err;
    } else {
      // Check if user exists, if not, create it
      if (users.length === 0) {
        // New user logging in
        database.createUser({
          username: req.body.username
        }, function(err) {
          if (err) {
            error = err;
          } else {
            console.log('Created and logged in user', req.body.username);
          }
        });
      } else {
        console.log('Logged in user', req.body.username);
      }

      // Either way, set a username session key
      req.session.username = req.body.username;
      res.send({success: (error === false), error: error, session: req.session});

      // Inform connected clients
      io.sockets.emit('newUser', {
          username: req.body.username
        });

    }
  });

});

// HTTP API Routes
app.post('/answer', function(req, res) {
  var error = false;
  if (!req.session.username) {
    error = "You are not logged in.";
  } else {
    database.answerQuestion(req.body.question, req.body.answer, req.session.username,
      function(err, question) {
        if (err) {
          error = err;
        }


      });
  }
  res.send({success: (error === false), error: error, session: req.session});
});

console.log('Listening on port 3000.');
