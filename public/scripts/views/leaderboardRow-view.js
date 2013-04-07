define([
  'jquery',
  'underscore',
  'backbone',
  'views/leaderboardRow-view',
  'text!templates/leaderboard'
], function( $, _, Backbone, LeaderboardRowView, LeaderboardTpl) {

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
          var post = $.post("/loginAdmin", { password: $(self.el).find('input[name=password]').val() });
          post.done(function( data ) {
              if (data.success) {
                  var leaderboardView = new LeaderboardView().render();
              }
          });
      }
      
  });

  return LeaderboardView;

});
