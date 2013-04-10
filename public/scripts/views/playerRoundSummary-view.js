define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'views/buzzer-view',
  'text!templates/playerRoundSummary'
], function( $, _, Socket, Backbone, BuzzerView, PlayerRoundSummaryTpl) {

  var PlayerRoundSummaryView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(PlayerRoundSummaryTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template({ model: this.model }));
          setTimeout(function() {
              var buzzerView = new BuzzerView().render();
          }, 3000);
          return this;
      },

  });

  return PlayerRoundSummaryView;

});
