define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'views/playerRoundSummary-view',
  'text!templates/buzzer'
], function( $, _, Socket, Backbone, PlayerRoundSummaryView, BuzzerTpl) {

  var BuzzerView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(BuzzerTpl),

      initialize: function() {
          var self = this;
          this.socket = Socket.connect('http://localhost/');
          this.socket.on('startAnswering', function() {
              $(self.el).find('.buzzerWrapper').removeClass('disabled');
          });
          this.socket.on('playerRoundSummary', function(data) {
              var buzzerWrapper = $(self.el).find('.buzzerWrapper');
              buzzerWrapper.addClass('disabled').find('.displayAnswer').eq(data.correct).addClass('correctAnswer');
              var playerRoundSummary = new PlayerRoundSummaryView({ model: data}).render();
          });
          this.socket.on('restoreDefault', function() {
              self.render();
          });
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click .answerButton": "sendAnswer"
      },

      sendAnswer: function(ev) {
          this.socket.emit('lodgedAnswer', { answer: $(this.el).find('.answerButton').index(ev.target) });
          $(this.el).find('.buzzerWrapper').addClass('disabled');
      }
      
  });

  return BuzzerView;

});
