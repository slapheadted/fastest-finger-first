define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/buzzer'
], function( $, _, Backbone, BuzzerTpl) {

  var BuzzerView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(BuzzerTpl),

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
          //if (typeof cb !== 'function') throw new Error("Callback must be supplied.");
          var post = $.post("/loginPlayer", { username: $(self.el).find('input[name=username]').val() });
          post.done(function( data ) {
              if (data.success) {
                  var buzzerView = new BuzzerView().render();
              }
          });

          console.log('test');
      }
      
  });

  return BuzzerView;

});