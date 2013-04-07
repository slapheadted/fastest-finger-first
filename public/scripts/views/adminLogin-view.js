define([
  'jquery',
  'underscore',
  'backbone',
  'views/leaderboard-view',
  'text!templates/adminLogin'
], function( $, _, Backbone, LeaderboardView, AdminLoginTpl) {

  var AdminLoginView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(AdminLoginTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click input[type=submit]": "loginAdmin"
      },

      loginAdmin: function(ev) {
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

  return AdminLoginView;

});
