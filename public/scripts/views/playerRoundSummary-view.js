define([
  'jquery',
  'underscore',
  'socketio',
  'backbone',
  'text!templates/playerRoundSummary'
], function( $, _, Socket, Backbone, PlayerRoundSummaryTpl) {

  var PlayerRoundSummaryView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(PlayerRoundSummaryTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template({ model: this.model }));
          return this;
      },

  });

  return PlayerRoundSummaryView;

});
