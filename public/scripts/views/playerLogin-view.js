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
          var self = this;
          this.socket = Socket.connect('http://192.168.0.5:3000/');
          this.socket.on('loginPlayerResponse', function( data ) {
              if (data.username === $(self.el).find('input[name=username]').val()) {
                  if (data.success) {
                      var buzzerView = new BuzzerView().render();
                  } else {
                      self.duplicateUserError();
                  }
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
      },
      
      duplicateUserError: function(ev) {
          $(this.el).find('.duplicateUsername').removeClass('hide');
      }
  });

  return PlayerLoginView;

});
