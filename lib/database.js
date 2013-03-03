var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('nodeUpNorth', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        db.collection('votes', {safe:true}, function(err, collection) {
            if (err) {
                console.log("There's been an error connecting to the DB.");
            }
        });
    }
});

exports.createVote = function(data, cb) {
    db.collection('votes', function(err, collection) {
        collection.insert(data, {safe:true}, function(err, result) {
            cb(!err);
        });
    });
};
