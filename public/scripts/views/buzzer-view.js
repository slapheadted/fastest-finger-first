define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'text!templates/buzzer'
], function( $, _, Socket, Backbone, BuzzerTpl) {

  var BuzzerView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(BuzzerTpl),

      initialize: function() {
          var self = this;
          this.socket = Socket.connect('http://192.168.0.8:3000/');
          this.socket.on('startAnswering', function() {
              $(self.el).find('.buzzerWrapper').removeClass('disabled');
          });
          this.socket.on('stopAnswering', function() {
              $(self.el).find('.buzzerWrapper').addClass('disabled');
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
