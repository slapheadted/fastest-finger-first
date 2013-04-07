var io = require('../app').io
  , database = require('./database');

function QuizMaster (opts) {
    this._answerQueue = [];
    this._questions = [];
    this._currentQuestion = 1;
    this._active = false; // Boolean flag for whether quiz has started
    this._answering = false; // Answering boolean flag
}

QuizMaster.prototype.init = function () {
    console.log('quizmaster init');
    // Strip this line?
    io.sockets.on('connection', function(socket) {
        socket.on('pushAnswer', function(data) {
            data.id = socket.id;
            self.registerAnswer(data);
        });
    });
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
    question.question = this._currentQuestion + '. ' + question;
    io.sockets.emit('beginQuiz', {
      question: question
    });
    this._currentQuestion++;
  }
};

QuizMaster.prototype.disableAnswering = function () {
  this._answering = false;
  io.sockets.emit('disableAnswering', {});
};

QuizMaster.prototype.enableAnswering = function () {
  this._answering = true;
  io.sockets.emit('enableAnswering', {});
  // Disable in 5 seconds
  setTimeout(function() { self.disableAnswering(); }, 5000);
};

QuizMaster.prototype.roundTimer = function () {
    setTimeout(function() { self.endRound(); }, 10000);
};

QuizMaster.prototype.registerAnswer = function (data) {
    // Only save answers when permitted
    if (this._answering) {
      this.answerQueue.push(data);
    }
};

module.exports = QuizMaster;