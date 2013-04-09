var _ = require('underscore');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodeUpNorth');

var topicsSchema = mongoose.Schema({ name: String, description: String, category: String, speaker: Number, dateActive: Date, active: Boolean });
var votesSchema  = mongoose.Schema({ targetId: mongoose.Schema.Types.ObjectId, ip: String });
var usersSchema  = mongoose.Schema({ email: String });
var answersSchema  = mongoose.Schema({ answer: String, img: String, correct: Boolean });
var responsesSchema  = mongoose.Schema({ answer: String, username: String });
var questionsSchema  = mongoose.Schema({ question: String, answers: [answersSchema], responses: [responsesSchema] });

var Topic = mongoose.model('Topic', topicsSchema);
var Vote  = mongoose.model('Vote', votesSchema);
var User  = mongoose.model('User', usersSchema);
var Response  = mongoose.model('Response', responsesSchema);
var Question  = mongoose.model('Question', questionsSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {

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

    exports.readQuestions = function(query, cb) {
        var cb = cb || query; // Make `query` optional
        var questions = Question.find(query);
        var questionModels = [];
        questions.lean().exec(function(err, questions) {
            if (!err) {
                cb(err, questions);
            }
        });
    };

    exports.answerQuestion = function(question, answer, username, cb) {
        if (!question || !answer) {
            return cb(new Error("Question ID and an answer string are required"));
        }

        Question.find({
            '_id': question
        }, function(err, question) {
            // Create a model
            var questionModel = new Question(question);
            questionModel.responses.push(new Response({
                username: username,
                answer: answer
            }));

            questionModel.save();
        });
    };

    exports.readUsers = function(query, cb) {
        var cb = cb || query; // Make `query` optional
        var users = User.find(query);
        var userModels = [];
        users.lean().exec(function(err, users) {
            if (!err) {
                cb(err, users);
            }
        });
    };

    exports.createUser = function(data, cb) {
        var newUser = new User(data);
        var users = User.find({
            username: newUser.name
        });
        uses.lean().exec(function(err, users) {
            if (users.length) {
                // Username taken
                return cb('Username taken');
            }

            return newUser.save(cb);
        });
    };

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

// });

