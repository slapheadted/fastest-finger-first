var io = require('../app').io
  , database = require('./database');

function QuizMaster (opts) {
    this._init();
}

QuizMaster.prototype._init = function() {
  this._answerQueue = [];
  this._questions = [];
  this._currentQuestion = 0;
  this._active = false; // Boolean flag for whether quiz has started
  this._answering = false; // Answering boolean flag
  this._loggedIn = []; // Array of logged in users
  this._connections = [];
  this._responses = {}; // Set of question/answers for each user, keyed by question ID

  this._sockets = {};

  this._leaderboard = {};
  this._scores = [];
};

QuizMaster.prototype.init = function (username) {
    console.log('quizmaster init');
    var self = this;
    database.readQuestions(function(err, questions) {
      self._questions = questions;
    });
};

QuizMaster.prototype.beginQuiz = function () {
  if (!this._active) {
    this._active = true;
    // Emit start quiz with first question
    // Strip out `correct` for client?
    var question = this._questions[0];
    // Prefix '1. ' to the question
    question.question = (this._currentQuestion + 1) + '. ' + question.question;
    io.sockets.emit('startQuestion', {
      question: question
    });
  } else if (this._currentQuestion < this._questions.length) { // Obligatory 'I am an idiot' fix
    var question = this._questions[this._currentQuestion];
    // Prefix '1. ' to the question
    question.question = (this._currentQuestion + 1) + '. ' + question.question;
    io.sockets.emit('startQuestion', {
      question: question
    });
  } else {
    // Don't do anything - it's the end of the quiz!
  }
};

QuizMaster.prototype.login = function(socket, username) {
  var self = this;
  // Set the username
  socket.username = username;

  // Add user to logged-in list
  this._loggedIn.push(username);
  this._sockets[username] = socket;

  // Inform connected clients
  var users = [];
  for (var l in this._loggedIn) {
    if (this._loggedIn[l] !== 'admin') {
      users.push({
        position: l,
        username: this._loggedIn[l],
        points: 0
      });
    }
  }

  io.sockets.emit('newUser', users);
};

QuizMaster.prototype.loggedIn = function() {
  return this._loggedIn;
};

QuizMaster.prototype.logout = function(username) {
  // Inform connected clients
  io.sockets.emit('disconnectedUser', {
      username: username
    });

  // Remove the user from the logged-in list
  console.error('index', this._loggedIn.indexOf(username));
  this._loggedIn.splice(this._loggedIn.indexOf(username), 1);
};

QuizMaster.prototype.answerQuestion = function(answer, user) {
  if (this._answering) {
    var correct = false;
    var question = 'unknown';
    var questionId = this._questions[this._currentQuestion]._id;

    // Check if the answer is correct
    for (var q in this._questions) {
      if (this._questions[q]._id == questionId) {
        correct = this._questions[q].answers[answer].correct;
        question = this._questions[q].question;
      }
    }

    this._responses[this._currentQuestion] = this._responses[this._currentQuestion] || {};

    this._leaderboard[this._currentQuestion] = this._leaderboard[this._currentQuestion] || {};
    this._leaderboard[this._currentQuestion].position = this._leaderboard[this._currentQuestion].position || 1;
    var points = 0;
    var position = this._leaderboard[this._currentQuestion].position;
    if (position < 10 && correct) { // Only get points if higher than 10th place, and correct answer
      points = 100 - (position - 1) * 10;
    }

    this._leaderboard[this._currentQuestion][user] = {
      position: this._leaderboard[this._currentQuestion].position++,
      username: user,
      points: points
    };

    console.log('--------------------------------------------------');
    console.log(this._leaderboard);
    console.log('--------------------------------------------------');

    if (!this._responses[this._currentQuestion][user]) { // Prevent answering more than once
      this._responses[this._currentQuestion][user] = {answer: answer, correct: correct};
    }

    console.log('User', user, 'got question', question, (correct) ? 'right' : 'wrong');
  }
};

QuizMaster.prototype.disableAnswering = function () {

  if (this._answering) { // HIGHLY EVIL FUCKING WITHCRAFT ALERT
  this._answering = false;
    for (var l in this._loggedIn) {
      console.log('----------------fjdskfjdsk---------------');
      console.log(this._currentQuestion);
      console.log('----------------fjdskfjdsk---------------');
      var question = this._questions[this._currentQuestion];
      // find correct answer
      var answer = null;
      for (var a in question.answers) {
        if (question.answers[a].correct) {
          answer = a;
        }
      }

      // If the user answered in time...
      var pos = 100;
      if (this._leaderboard[this._currentQuestion] && this._leaderboard[this._currentQuestion][this._loggedIn[l]]) {
        var pos = this._leaderboard[this._currentQuestion][this._loggedIn[l]].position;
      } else {
        // Give them stock entries if they didn't
        this._leaderboard[this._currentQuestion] = this._leaderboard[this._currentQuestion] || {};
        this._leaderboard[this._currentQuestion][this._loggedIn[l]] = {
          position: 100,
          username: this._loggedIn[l],
          points: 0
        };
      }

      this._sockets[this._loggedIn[l]].emit('playerRoundSummary', {
        position: pos,
        answer: answer
      });
    }

    // Calculate a structure suitable for the front-end (re-map into an array)

    var users = [];
    for (var l in this._loggedIn) {
      if (this._loggedIn[l] !== 'admin') {
        var userDetail = this._leaderboard[this._currentQuestion][this._loggedIn[l]]
        userInfo = {
          points: 0,
          username: this._loggedIn[l],
          position: null
        };
        for (var c in this._leaderboard) {
          for (var i in this._leaderboard[c]) {
            if (i == this._loggedIn[l]) {
              userInfo.points += this._leaderboard[c][this._loggedIn[l]].points;
            }
          }
        }
        users.push(userInfo);
      }
    }

    // Sort by points
    users.sort(function(a, b) {
          return ((a.points < b.points) ? -1 : ((a.points > b.points) ? 1 : 0));
    });

    // Assign positions
    for (var p in users) {
      users[p].position = (p + 1);
    }

    io.sockets.emit('stopAnswering', users);
    this._currentQuestion++;

    if (this._currentQuestion >= this._questions.length) {
      io.sockets.emit('endQuiz', users);
    }
  }
};

QuizMaster.prototype.enableAnswering = function () {
  this._answering = true;
  io.sockets.emit('startAnswering', {});
  // Disable in 5 seconds
  var self = this;
  setTimeout(function() { self.disableAnswering(); }, 5000);
};

QuizMaster.prototype.registerAnswer = function (data) {
    // Only save answers when permitted
    if (this._answering) {
      this.answerQueue.push(data);
    }
};

module.exports = QuizMaster;
