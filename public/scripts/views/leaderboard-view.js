define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'views/leaderboardRow-view',
  'views/question-view',
  'text!templates/leaderboard'
], function( $, _, Socket, Backbone, LeaderboardRowView, QuestionView, LeaderboardTpl) {

  var LeaderboardView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(LeaderboardTpl),

      initialize: function() {
          // Huge Warning! Don't ignore models and collections like we have here
          // We didn't have time to implement proper socket-to-model
          var self = this;
          this.collection = [];
          this.collection = [
              { username: "Chris", position: 1, points: 20 },
              { username: "Craig", position: 2, points: 19 }
          ];
          this.socket = Socket.connect('http://192.168.0.8:3000/');
          this.socket.on('leaderboardChange', function(data) {
              self.model = data;
              self.render();
          });
          this.socket.on('stopAnswering', function(data) {
              self.model = data;
              self.render();
          });
          this.socket.on('startQuestion', function(data) {
              var questionView = new QuestionView({ model: data });
              questionView.render();
              $(self.el).html(questionView.el);
          });
      },
      
      renderItem: function(model) {
          var leaderboardRowView = new LeaderboardRowView({ model: model });
          leaderboardRowView.render();
          $('.headings').after(leaderboardRowView.el);
      },

      render: function() {
          this.$el.html(this.template());
          // Aargh! This is not good use of BB, purely hack.
          this.collection.sort(function(a, b) { return a.position + b.position });
          this.collection.forEach(this.renderItem);
          return this;
      },
      
      events: {
          "click .startQuiz": "startQuiz"
      },

      startQuiz: function(ev) {
          ev.preventDefault();
          this.socket.emit('startQuiz');
      }
      
  });

  return LeaderboardView;

});
