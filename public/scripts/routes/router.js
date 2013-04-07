define([
  'jquery',
  'underscore',
  'backbone',
  'views/home-view'
], function( $, _, Backbone, HomeView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            "admin": "adminLogin",
            "*other": "playerLogin"
        }
    });
    
    var initialize = function () {
        var app_router = new AppRouter;
        var self = this;

        app_router.on('route:playerLogin', function () {
            var homeView = new HomeView().render();
        });

        app_router.on('route:adminLogin', function () {
            console.log('you the boss');
            //var homeView = new HomeView().render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
