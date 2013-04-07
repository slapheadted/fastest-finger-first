define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/leaderboardRow'
], function( $, _, Backbone, LeaderboardRowTpl) {

  var LeaderboardRowView = Backbone.View.extend({
      tagName: "tr",

      template: _.template(LeaderboardRowTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template({ model: this.model }));
          return this;
      },
      
  });

  return LeaderboardRowView;

});
