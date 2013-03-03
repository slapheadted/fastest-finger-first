define([
  'underscore',
  'backbone',
  'moment',
  'models/score-model'
], function(_, Backbone, Moment, ScoreModel){
  var ScoreCollection = Backbone.Collection.extend({
      model: ScoreModel,
      url: '/api/scores.json',

      initialize: function() {
      },

      comparator: function(score) {
          return score.get('tally');
      },

  });

  return ScoreCollection;

});
