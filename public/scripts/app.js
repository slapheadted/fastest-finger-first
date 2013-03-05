define(['jquery',
        'jqueryui',
        'underscore',
        'backbone',
        'router'
], function($, $ui, _, Backbone, Router) {

  var initialize = function() {
      $.ajaxSetup({ cache: false });
      Router.initialize();
  }

  return {
      initialize: initialize
  };
});
