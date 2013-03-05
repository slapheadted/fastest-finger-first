define([
  'jquery',
  'underscore',
  'backbone',
  'views/topicVoting-view',
  'text!templates/home'
], function( $, _, Backbone, TopicVotingView, HomeTpl) {

  var HomeView = Backbone.View.extend({
  
      template: _.template(HomeTpl),

      initialize: function() { 
      },
      
      render: function() {
          $('.container').html(this.template());
          var topicVoting = new TopicVotingView();
          $('.nextTalk').after(topicVoting.el);
          return this;
      }
      
  });

  return HomeView;

});
