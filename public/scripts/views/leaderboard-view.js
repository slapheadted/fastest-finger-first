define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'views/leaderboardRow-view',
  'text!templates/leaderboard'
], function( $, _, Socket, Backbone, LeaderboardRowView, LeaderboardTpl) {

  var LeaderboardView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(LeaderboardTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click .startQuiz": "startQuiz"
      },

      startQuiz: function(ev) {
          ev.preventDefault();
          var self = this;
          var socket = Socket.connect('http://localhost');
          socket.emit('startQuiz');
      }
      
  });

  return LeaderboardView;

});
