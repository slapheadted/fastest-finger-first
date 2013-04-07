define(['jquery',
        'jqueryui',
        'underscore',
        'socketio',
        'backbone',
        'router'
], function($, $ui, _, Socket, Backbone, Router) {

  var initialize = function() {
      $.ajaxSetup({ cache: false });
      Router.initialize();
  }

  return {
      initialize: initialize
  };
});
