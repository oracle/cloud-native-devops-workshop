/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// settins viewModel of the app

'use strict';
define(['appController', 'ojs/ojswitch'], function(app) {

  function settingsViewModel() {
    var self = this;

    // adjust content padding top
    self.handleTransitionCompleted = function(info) {
      app.appUtilities.adjustContentPadding();
    };

    // settings page header
    self.settingsHeaderSettings = {
      name:'basicHeader',
      params: {
        title: 'Settings',
        startBtn: {
          click: app.toggleDrawer,
          display: 'icons',
          label: 'Back',
          icons: {start: 'oj-fwk-icon oj-fwk-icon-hamburger'},
          visible: true
        },
        endBtn: {
          visible: false
        }
      }
    };

  }

  return settingsViewModel;
});
