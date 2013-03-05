define([
  'underscore',
  'backbone',
  'helpers/channel'
], function(_, Backbone, channel){
  var TopicModel = Backbone.Model.extend({
    defaults: {
        idAttribute: "_id",
        name: "",
        description: "",
        category: "express",
        speaker: "",
        dateActive: new Date(),
        active: false,
        voteCount: 0,
        canVote: true,
        currentVote: false
    },
    
    initialize: function() {
        var self = this;

        var socket = io.connect("http://192.168.0.8:3000/");
        socket.on('newVote', function(data) {
            if (data.id === self.get('_id')) self.incrementVote();
        });
    },

    getPosition: function() {
        return this.collection.indexOf(this) + 1;
    },

    vote: function(cb) {
        var self = this;
        if (typeof cb !== 'function') throw new Error("Callback must be supplied.");
        var post = $.post("/vote", { targetId: self.get('_id') });
        post.done(function( data ) {
            var result =  data ? true : false;
            cb(result); 
        });
    },

    incrementVote: function() {
        this.set('voteCount', (this.get('voteCount') + 1));
    }

  });

  return TopicModel;

});
