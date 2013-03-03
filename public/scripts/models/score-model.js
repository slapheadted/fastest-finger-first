define([
  'underscore',
  'backbone',
  'helpers/channel'
], function(_, Backbone, channel){
  var ScoreModel = Backbone.Model.extend({
    defaults: {
        idAttribute: "_id",
        name: "Developer",
        tally: 0
    },

    initialize: function() {
        var self = this;

        channel.on('voteSubmit', function() {
            self.insertVote();
        });
    },

    getPosition: function() {
        return this.collection.indexOf(this) + 1;
    },

    vote: function(item) {
        alert('SWEET');
        // api call
    }

  });

  return ScoreModel;

});
