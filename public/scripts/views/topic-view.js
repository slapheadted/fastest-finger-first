define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/topic',
  'helpers/channel',
], function( $, _, Backbone, TopicTpl, channel) {

  var TopicView = Backbone.View.extend({
  tagName: "tr",
      template: _.template(TopicTpl),

      initialize: function() { 
          var self = this;

          this.listenTo(this.model, "change", this.render);
          this.listenTo(this.model, "change:currentVote", this.highlightVote);
          this.listenTo(this.model, "change:voteCount", this.voteIncrement);

          channel.on('voteLodged', function() {
              var topic = self.$el.find('input');
              if (topic.is(':checked')) {
                  self.model.vote(function(result){
                      if (result) { 
                          self.model.set('currentVote', true);
                          $('.submitVote').fadeOut('slow', function() { 
                              self.highlightVote();
                              $('.alert').removeClass('hide').addClass('in'); 
                          }); 
                      }
                  });
              }
          });
      },
      
      render: function() {
          this.$el.html(this.template({ model: this.model }));
          if (this.model.get('currentVote')) this.$el.addClass('success');
          return this;
      },

      highlightVote: function() {
          $('button').hide();
          this.$el.addClass('success');
      },

      voteIncrement: function() {
          var self = this;
          this.$el.addClass('voteIncremented', 200, function() {
              setTimeout(function() { self.$el.removeClass('voteIncremented'); }, 1000);
          });
      } 
  });

  return TopicView;

});
