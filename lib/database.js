var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeUpNorth');

var topicsSchema = mongoose.Schema({ name: String, description: String, category: String, speaker: Number, dateActive: Date, active: Boolean });
var votesSchema  = mongoose.Schema({ targetId: mongoose.Schema.Types.ObjectId, ip: String });
var usersSchema  = mongoose.Schema({ email: String });

var Topic = mongoose.model('Topic', topicsSchema);
var Vote  = mongoose.model('Vote', votesSchema);
var User  = mongoose.model('User', usersSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

    exports.readTopics = function(cb) {
        var activeTopics = Topic.find({ active: true }); 
        activeTopics.lean().exec(function(err, topics) {
            if (!err) {
                var topicIds = [],
                    i = 0;
                topics.forEach(function(el, index, array) {
                    Vote.count({ targetId: el._id }, function(err, count) {
                        topics[i].voteCount = count;
                        i++;
                        if (i == topics.length) cb(topics); 
                    });
                });
            }
        });
    };

    exports.readUsers = function(query, cb) {
        var cb = cb || query;
        var users = User.find(query);
        var userModels = [];
        users.lean().exec(function(err, users) {
            if (!err) {
                users.forEach(function(el, index, array) {
                    userModels.push(new User(el));
                });
                cb(err, userModels);
            }
        });
    }

    exports.createUser = function(data, cb) {
        var newUser = new User(data);

        newUser.save(cb);
    }

    exports.createVote = function(data, cb) {
        var newVote = new Vote(data);

        newVote.save(function(err, newVote) {
            cb(!err);
        });
    };

    exports.readUserVoted = function(data, cb) {
        Topic.find({ active: true }, 'id', function(err, topics) {
            if (!err) {
                var topicIds = [];
                topics.forEach(function(el, index, array) {
                    topicIds.push(el.id);
                });
                var activeVotes = Vote.findOne({ ip: data.ip }).where('targetId').in(topicIds);
                activeVotes.exec(function(err, vote) {
                    if (vote == null) vote = false;
                    cb(vote);
                });
            }
        });
    };

});

