define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/score',
  'helpers/channel'
], function( $, _, Backbone, ScoreTpl, channel) {

  var ScoreView = Backbone.View.extend({
  
      tagName: "tr",
      template: _.template(ScoreTpl),

      initialize: function() { 
          var self = this;

          channel.on('voteLodged', function() {
              var topic = self.$el.find('input');
              if (topic.is(':checked')) {
                  self.model.vote();
              }
          });
      },
      
      render: function() {
          this.$el.html(this.template({ model: this.model }));
          return this;
      }
      
  });

  return ScoreView;

});
