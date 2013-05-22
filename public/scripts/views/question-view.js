define([ 'jquery',
  'underscore',
  'socketio',
  'backbone',
  'text!templates/question'
], function( $, _, Socket, Backbone, QuestionTpl) {

  var QuestionView = Backbone.View.extend({
  
      template: _.template(QuestionTpl),

      initialize: function() {
          var self = this;
          this.socket = Socket.connect('http://192.168.0.5:3000/');
          this.socket.on('showAnswer', function() {
              $(self.el).find('.displayAnswer').not('.correct').css('opacity', '0.3');
              // insert next button here
          });
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
          $(ev.target).addClass('hide');
          this.socket.emit('enableAnswering');
          $(this.el).find('.displayAnswerWrapper').removeClass('hide');
      }
      
  });

  return QuestionView;

});
