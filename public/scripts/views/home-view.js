define([
  'jquery',
  'underscore',
  'backbone',
  'views/scoreBoard-view',
  'text!templates/home'
], function( $, _, Backbone, ScoreBoardView, HomeTpl) {

  var HomeView = Backbone.View.extend({
  
      template: _.template(HomeTpl),

      initialize: function() { 
      },
      
      render: function() {
          $('.container').html(this.template());
          var scoreBoard = new ScoreBoardView();
          $('.nextTalk').after(scoreBoard.el);
          return this;
      }
      
  });

  return HomeView;

});
