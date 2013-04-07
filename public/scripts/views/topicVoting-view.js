define([
  'jquery',
  'underscore',
  'backbone',
  'collections/topics-collection',
  'text!templates/topicVoting',
  'views/topic-view',
  'helpers/channel'
], function( $, _, Backbone, TopicsCollection, TopicVotingTpl, TopicView, channel) {

  var TopicVotingView = Backbone.View.extend({
  
      tagName: "form",
      className: "voteWrapper",
      template: _.template(TopicVotingTpl),

      initialize: function() { 
          var self = this;
          var topics = new TopicsCollection();
          this.socket = io.connect("http://192.168.0.8:3000/");
          topics.fetch({
              success: function() {
                  self.collection = topics;
                  self.collection.checkUserHasVoted(function(data) { 
                      // this is to redraw the table on any change, good but clashes with external vote registering and wiping out currently selected vote
                      //self.collection.on('change:voteCount change:currentVote', self.render, self);
                      self.render();
                      if (!data) self.$el.find('.submitVote').removeClass('hide'); 
                  });
                  _.bindAll(self, "renderItem");
              }
          });
      },

      renderItem: function(model) {
          var itemView = new TopicView({ model: model });
          itemView.render();
          $('.headings').after(itemView.el);
      },

      render: function() {
          this.$el.html(this.template());
          this.collection.sort().each(this.renderItem);
          return this;
      },
      
      events: {
          "click .submitVote": "vote",
          "click .hit": "pushToQueue"
      },

      vote: function(e) {
          e.preventDefault();
          channel.trigger('voteLodged');
      }, 

      pushToQueue: function(e) {
          this.socket.emit('pushAnswer', { test: "123" });
      }  
      
  });

  return TopicVotingView;

});
