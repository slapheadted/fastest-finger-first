define([ 'jquery',
  'underscore',
  'socketio',
  'backbone',
  'text!templates/question'
], function( $, _, Socket, Backbone, QuestionTpl) {

  var QuestionView = Backbone.View.extend({
  
      template: _.template(QuestionTpl),

      initialize: function() {
          this.socket = Socket.connect('http://192.168.0.6:3000/');
      },
      
      render: function() {
          $(this.el).html(this.template({ model: this.model }));
          return this;
      },
      
      events: {
          "click .enableAnswering": "enableAnswering"
      },

      enableAnswering: function(ev) {
          ev.preventDefault();
          this.socket.emit('enableAnswering');
          $(this.el).find('.displayAnswerWrapper').removeClass('hide');
      }
      
  });

  return QuestionView;

});
