
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
app.post('/vote', function(req, res) {
    req.body.ip = req.connection.remoteAddress;
    database.createVote(req.body, function(data) {
        data = data || false;
        if (data) io.sockets.emit('newVote', { id: req.body.targetId });
        res.send(data);
    });
});

app.get('/userVoted', function(req, res) {
    database.readUserVoted({ ip: req.connection.remoteAddress }, function(data) {
        data = data || false;
        res.send(data);
    });
});

app.get('/topics', function(req, res) {
    database.readTopics(function(data) {
        data = data || false;
        res.json(data);
    });
});

console.log('Listening on port 3000.');
