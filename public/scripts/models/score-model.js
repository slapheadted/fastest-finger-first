define([
  'underscore',
  'backbone',
  'helpers/channel'
], function(_, Backbone, channel){
  var ScoreModel = Backbone.Model.extend({
    defaults: {
        idAttribute: "_id",
        topic: "default",
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

    vote: function(cb) {
        var self = this;
        if (typeof cb !== 'function') throw new Error("Callback must be supplied.");
        var post = $.post("/lodgeVote", { topic: self.get('topic') });
        post.done(function( data ) {
            var result =  data ? true : false;
            cb(result); 
        });
    }

  });

  return ScoreModel;

});
