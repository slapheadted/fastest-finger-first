
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , database = require('./lib/database');

var app = module.exports = express.createServer();

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

// Routes
app.post('/lodgeVote', function(req, res) {
    req.body.ip = req.connection.remoteAddress;
    database.createVote(req.body, function(data) {
        var result = data ? true : false;
        res.send(result);
    });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
