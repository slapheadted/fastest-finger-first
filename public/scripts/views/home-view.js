define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/home'
], function( $, _, Backbone, HomeTpl) {

  var HomeView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(HomeTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click input[type=submit]": "loginPlayer"
      },

      loginPlayer: function(ev) {
          ev.preventDefault();
          var self = this;
          //if (typeof cb !== 'function') throw new Error("Callback must be supplied.");
          var post = $.post("/loginPlayer", { email: $(self.el).find('input[name=email]').val() });
          post.done(function( data ) {
              var result =  data ? true : false;
              //cb(result); 
          });

          console.log('test');
      }
      
  });

  return HomeView;

});
