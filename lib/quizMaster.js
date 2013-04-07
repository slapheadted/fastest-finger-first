var io = require('../app').io
  , database = require('./database');

function QuizMaster (opts) {
    this._answerQueue = [];
    this._questions = [];
    this._currentQuestion = 0;
    this._active = false; // Boolean flag for whether quiz has started
    this._answering = false; // Answering boolean flag
    this._loggedIn = []; // Array of logged in users
    this._connections = [];
    this._responses = {}; // Set of question/answers for each user, keyed by question ID

    this._leaderboard = {};
}

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
    this._currentQuestion++;
  }
};

QuizMaster.prototype.login = function(socket, username) {
  var self = this;
  // Inform connected clients
  io.sockets.emit('newUser', {
      username: username
    });

  socket.username = username;

  // Add user to logged-in list
  this._loggedIn.push(username);
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

    this._responses[questionId] = this._responses[questionId] || {};

    this._leaderboard[questionId] = this._leaderboard[questionId] || {};
    this._leaderboard[questionId].position = this._leaderboard[questionId].position || 0;
    this._leaderboard[questionId][user] = {
      position: this._leaderboard[questionId].position++,
      username: user,
      points: 9000
    };

    if (!this._responses[questionId][user]) { // Prevent answering more than once
      this._responses[questionId][user] = {answer: answer, correct: correct};
    }

    console.log('User', user, 'got question', question, (correct) ? 'right' : 'wrong');
  }
};

QuizMaster.prototype.disableAnswering = function () {
  this._answering = false;
  io.sockets.emit('stopAnswering', this._leaderboard);
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
