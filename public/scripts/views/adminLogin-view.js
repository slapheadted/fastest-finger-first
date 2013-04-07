define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'views/leaderboard-view',
  'text!templates/adminLogin'
], function( $, _, Socket, Backbone, LeaderboardView, AdminLoginTpl) {

  var AdminLoginView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(AdminLoginTpl),

      initialize: function() {
          this.socket = Socket.connect('http://192.168.0.8');
          this.socket.on('loginAdminResponse', function( data ) {
              if (data.success) {
                  var leaderboardView = new LeaderboardView().render();
              }
          });
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
          this.socket.emit('loginAdmin', { password: $(self.el).find('input[name=password]').val() });
      }
      
  });

  return AdminLoginView;

});
