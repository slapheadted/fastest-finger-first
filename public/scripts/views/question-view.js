define([ 'jquery',
  'underscore',
  'socketio',
  'backbone',
  'text!templates/question'
], function( $, _, Socket, Backbone, QuestionTpl) {

  var QuestionView = Backbone.View.extend({
  
      template: _.template(QuestionTpl),

      initialize: function() {
          this.socket = Socket.connect('http://localhost');
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
      }
      
  });

  return QuestionView;

});
