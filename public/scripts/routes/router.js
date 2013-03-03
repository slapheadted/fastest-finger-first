define([
  'jquery',
  'underscore',
  'backbone',
  'views/home-view'
], function( $, _, Backbone, HomeView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "*actions": "showScoreBoard"
        }
    });
    
    var initialize = function () {
        var app_router = new AppRouter;
        var self = this;

        app_router.on('route:showScoreBoard', function () {
            var homeView = new HomeView().render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
