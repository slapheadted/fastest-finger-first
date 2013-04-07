define([
  'jquery',
  'underscore',
  'backbone',
  'views/playerLogin-view',
  'views/adminLogin-view'
], function( $, _, Backbone, PlayerLoginView, AdminLoginView) {

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
            var playerLoginView = new PlayerLoginView().render();
        });

        app_router.on('route:adminLogin', function () {
            var adminLoginView = new AdminLoginView().render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});
