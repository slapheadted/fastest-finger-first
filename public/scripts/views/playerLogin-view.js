define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'views/buzzer-view',
  'text!templates/playerLogin'
], function( $, _, Socket, Backbone, BuzzerView, PlayerLoginTpl) {

  var PlayerLoginView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(PlayerLoginTpl),

      initialize: function() {
          this.socket = Socket.connect('http://localhost/');
          this.socket.on('loginPlayerResponse', function( data ) {
              if (data.success) {
                  var buzzerView = new BuzzerView().render();
              }
          });
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click input[type=submit]": "loginPlayer"
      },

      loginPlayer: function(ev) {
          var self = this;
          ev.preventDefault();
          this.socket.emit('loginPlayer', { username: $(self.el).find('input[name=username]').val() });
      }
      
  });

  return PlayerLoginView;

});
