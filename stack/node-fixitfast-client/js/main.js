/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Example of Require.js boostrap javascript
 */
'use strict';
requirejs.config({
  // Path mappings for the logical module names
  paths:
  //injector:mainReleasePaths
  {
    'knockout': 'libs/knockout/dist/knockout',
    'mapping': 'libs/knockout-mapping/knockout.mapping',
    'jquery': 'libs/jquery/dist/jquery.min',
    'jqueryui-amd': 'libs/jquery-ui/ui',
    'promise': 'libs/es6-promise/es6-promise.min',
    'hammerjs': 'libs/hammerjs/hammer.min',
    'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
    'ojs': 'libs/oj/debug',
    'ojL10n': 'libs/oj/ojL10n',
    'ojtranslations': 'libs/oj/resources',
    'signals': 'libs/js-signals/dist/signals.min',
    'text': 'libs/text/text',
    'oraclemapviewer': 'libs/oraclemapsv2',
    'oracleelocation': 'libs/oracleelocationv3'
  }
  //endinjector
  ,
  // Shim configurations for modules that do not expose AMD
  shim: {
    'jquery': {
      exports: ['jQuery', '$']
    }
  },
  // This section configures the i18n plugin. It is merging the Oracle JET built-in translation
  // resources with a custom translation file.
  // Any resource file added, must be placed under a directory named "nls". You can use a path mapping or you can define
  // a path that is relative to the location of this main.js file.
  config: {
    ojL10n: {
      merge: {
        //'ojtranslations/nls/ojtranslations': 'resources/nls/menu'
      }
    }
  }
});

/**
 * A top-level require call executed by the Application.
 * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
 * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
 * objects in the callback
 */
require(['ojs/ojcore', 'knockout', 'appController'], function (oj, ko, app) {

  $(function() {

    function init() {
      oj.Router.sync().then(function () {
        // bind your ViewModel for the content of the whole page body.
        ko.applyBindings(app, document.getElementById('page'));
      }, function (error) {
        oj.Logger.error('Error in root start: ' + error.message);
      });
    }

    // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
    // event before executing any code that might interact with Cordova APIs or plugins.
    if ($(document.body).hasClass('oj-hybrid')) {
      document.addEventListener("deviceready", init);
    } else {
      init();
    }

  });

});
