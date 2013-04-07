define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/adminLogin'
], function( $, _, Backbone, AdminLoginTpl) {

  var AdminLoginView = Backbone.View.extend({

      el: ".container",
  
      template: _.template(AdminLoginTpl),

      initialize: function() {
      },
      
      render: function() {
          $(this.el).html(this.template());
          return this;
      },
      
      events: {
          "click input[type=submit]": "loginAdmin"
      },

      loginAdmin: function(ev) {
          ev.preventDefault();
          var self = this;
          //if (typeof cb !== 'function') throw new Error("Callback must be supplied.");
          var post = $.post("/loginAdmin", { password: $(self.el).find('input[name=password]').val() });
          post.done(function( data ) {
              var result =  data ? true : false;
              //cb(result); 
          });
      }
      
  });

  return AdminLoginView;

});
