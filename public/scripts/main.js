require.config({
  shim: {
    'socketio': {
        exports: 'io'
    },
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    }
  },

  paths: {
    hm: 'vendor/hm',
    esprima: 'vendor/esprima',
    jquery: 'vendor/jquery.min',
    jqueryui: 'vendor/jquery-ui.min',
    underscore: 'vendor/lodash.min',
    backbone: 'vendor/backbone-min',
    moment: 'vendor/moment.min',
    socketio: '../../socket.io/socket.io',
    router: 'routes/router'
  }
});
 
require(['app'], function(App) {
  App.initialize();
});
