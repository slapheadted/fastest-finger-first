var io = require('../app').io
  , database = require('./database');

function QuizMaster (opts) {
    this._answerQueue = [];
    this._questions = [];
}
QuizMaster.prototype.init = function () {
    console.log('quizmaster init');
    var self = this;
    database.readQuestions(function(err, questions) {
      self._questions = questions;
    });
};

QuizMaster.prototype.beginQuiz = function () {
    io.sockets.emit('beginningQuiz', {});
};

QuizMaster.prototype.disableAnswering = function () {
    // set class property
    // emit
};

QuizMaster.prototype.enableAnswering = function () {
    // set class property
    // emit
};

QuizMaster.prototype.enableAnswering= function () {
    setTimeout(function() { self.enableAnswering(); }, 5000);
};

QuizMaster.prototype.roundTimer = function () {
    setTimeout(function() { self.endRound(); }, 10000);
}

QuizMaster.prototype.loadAnswers = function () {
    // mongo find
};

QuizMaster.prototype.registerAnswer = function (data) {
    // encapsulated for easy substitution of persistence
    this.answerQueue.push(data);
};

// Gameplay
io.sockets.on('connection', function(socket) {
    socket.on('pushAnswer', function(data) {
        data.id = socket.id;
        self.registerAnswer(data);
    });
});

var QuizMaster = new QuizMaster();
QuizMaster.init();
