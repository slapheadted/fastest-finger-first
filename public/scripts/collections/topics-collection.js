define([
  'underscore',
  'backbone',
  'moment',
  'models/topic-model'
], function(_, Backbone, Moment, TopicModel){
  var TopicsCollection = Backbone.Collection.extend({
      model: TopicModel,
      url: '/topics',

      initialize: function() {
          this.once("change:currentVote", this.disableVoting, this);
      },

      comparator: function(topic) {
          return topic.get('voteCount');
      },

      disableVoting: function() {
          this.forEach(function(model, index) {
              model.set('canVote', false);
          });
      },

      checkUserHasVoted: function(cb) {
          var self = this;
          $.get('/userVoted').done(function(data) {
              if (data) {
                  self.forEach(function(model, index) {
                      var id = model.get('_id');
                      if (id === data.targetId) model.set('currentVote', true);
                  });
                  /*
                  console.log('data', data.targetId);
                  var test = self.get(data.targetId);
                  console.log('model', test);
                  test.set('currentVote', true);
                  */
              }
              cb(data);
          });
      }
  });

  return TopicsCollection;

});
