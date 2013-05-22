
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

// Prioritize XHR long-polling over WebSockets
io.configure(function(){
  io.set('transports', [
     'xhr-polling'
    , 'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'jsonp-polling'
  ]);
  // Jesus Christ this couldn't have saved our arses any more!
  io.set('close timeout', 60*60*24); // 24h time out
});

// Make Socket.IO available in modules
module.exports.io = io;

// Pull in Quiz Master
var QuizMaster = require('./lib/quizMaster');

// Initialize server
server.listen(3000);

// Configuration
app.configure(function(){
  app.set("view options", {layout: false});
  app.use(express.cookieParser());
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


// For each socket connection, listen to events from them
// We store the username on the socket for convenience later on
io.sockets.on('connection', function (socket) {
  socket.on('startQuiz', function (data) {
    quizMaster.beginQuiz();
  });


  // Users don't have a username until they log in
  socket.username = false;

  // Listen for new users on frontend
  socket.on('newUser', function(data) {
    // Inform QuizMaster of the user login
    quizMaster.login(socket, data.username);
  });

  // Simple proxy, QuizMaster re-emits the event globally
  socket.on('enableAnswering', function() {
    quizMaster.enableAnswering();
  });

  // Simple proxy, QuizMaster 
  socket.on('disableAnswering', function() {
    quizMaster.disableAnswering();
  });

  socket.on('lodgedAnswer', function(data) {
    quizMaster.answerQuestion(data.answer, this.username);
  });

  socket.on('disconnect', function() {
    quizMaster.logout(this.username);
  });

  socket.on('loginPlayer', function(data) {
    var error = false;

    // Check to see if a user already exists
    database.readUsers({
      username: data.username
    }, function(err, users) {
      if (err) {
        error = err;
      } else {
        // New user logging in
        database.createUser({
          username: data.username
        }, function(err) {
          console.log('-------------------------------', err);
          if (err) {
            error = err;
          } else {
            console.log('Created and logged in user', data.username);
          }

          // New user, log them in
          if (!error) {
            quizMaster.login(socket, data.username);
          }

          socket.emit('loginPlayerResponse', {success: (error === false), error: error, username: data.username});

        });

      }
    });
  });

  socket.on('loginAdmin', function(data) {
    var error = false;

    database.readUsers({
      username: 'admin',
      password: data.password
    }, function(err, users) {
      if (err) {
        error = err;
      } else {
        if (users.length === 0) {
          error = 'Password does not match';
        } else {
          console.log('Admin logged in');
          quizMaster.login(socket, 'admin');
        }
      }

      socket.emit('loginAdminResponse', {success: (error === false), error: error});
    });
  });

});

// Quiz: Begin
//quizMaster.beginQuiz();
    
// HTTP GET Routes
app.get('/loggedIn', function(req, res) {
  res.send(quizMaster.loggedIn());
});

// HTTP POST Routes

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
