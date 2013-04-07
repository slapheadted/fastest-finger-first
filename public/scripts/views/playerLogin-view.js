define([
  'jquery',
  'underscore',
  'backbone',
  'views/buzzer-view',
  'text!templates/playerLogin'
], function( $, _, Backbone, BuzzerView, PlayerLoginTpl) {

  var PlayerLoginView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(PlayerLoginTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click input[type=submit]": "loginPlayer"
      },

      loginPlayer: function(ev) {
          ev.preventDefault();
          var self = this;
          var post = $.post("/loginPlayer", { username: $(self.el).find('input[name=username]').val() });
          post.done(function( data ) {
              if (data.success) {
                  var buzzerView = new BuzzerView().render();
              }
          });
      }
      
  });

  return PlayerLoginView;

});
