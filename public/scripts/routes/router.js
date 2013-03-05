define([
  'jquery',
  'underscore',
  'backbone',
  'views/home-view'
], function( $, _, Backbone, HomeView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "*actions": "showTopicVoting"
        }
    });
    
    var initialize = function () {
        var app_router = new AppRouter;
        var self = this;

        app_router.on('route:showTopicVoting', function () {
            var homeView = new HomeView().render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
