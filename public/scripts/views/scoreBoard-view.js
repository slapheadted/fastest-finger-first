define([
  'jquery',
  'underscore',
  'backbone',
  'collections/scores-collection',
  'text!templates/scoreBoard',
  'views/score-view',
  'helpers/channel'
], function( $, _, Backbone, ScoresCollection, ScoreBoardTpl, ScoreView, channel) {

  var ScoreBoardView = Backbone.View.extend({
  
      tagName: "form",
      className: "voteWrapper",
      template: _.template(ScoreBoardTpl),

      initialize: function() { 
          var self = this;
          var scores = new ScoresCollection();
          scores.fetch({
              success: function() {
                  self.collection = scores;
                  self.render();
              }
          });
          _.bindAll(this, "renderItem");
      },

      renderItem: function(model) {
          var itemView = new ScoreView({ model: model });
          itemView.render();
          $('.headings').after(itemView.el);
      },

      render: function() {
          this.$el.html(this.template());
          this.collection.each(this.renderItem);
          return this;
      },
      
      events: {
          "click .submitVote": "vote"
      },

      vote: function(e) {
          e.preventDefault();
          channel.trigger('voteLodged');
      } 
      
  });

  return ScoreBoardView;

});
