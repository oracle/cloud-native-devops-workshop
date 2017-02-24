/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout'], function(oj, ko, $, app) {
  function viewModel(params) {

    var self = this;

    self.handleActivated = function() {

      var parentRouter = params['ojRouter']['parentRouter'];

      var routerConfigOptions = {
        'incidentTabSummary': { label: 'Summary', isDefault: true },
        'incidentTabActivity': { label: 'Activities' },
        'incidentTabMap': { label: 'Map'},
        'priority':  { label: 'Priority' },
        'status': { label: 'Status' }
      };

      self.router = parentRouter.createChildRouter('incidentView').configure(routerConfigOptions);

      // hide or show the navigation btn
      self.router.stateId.subscribe(function(newValue) {
        if(newValue === 'incidentTabMap') {
          showNavBtn(true)
        } else {
          showNavBtn(false)
        }
      })

      self.router.moduleConfig['params']['locationId'] = params['locationId'];

      var switcherCallback = function(context) {
        return app.pendingAnimationType;
      };

      var mergeConfig = function(original) {
        return $.extend(true, {}, original, {
          'animation': oj.ModuleAnimations.switcher(switcherCallback)
        });
      };

      // pass animation to module transition
      self.moduleConfig = mergeConfig(self.router.moduleConfig);

      return oj.Router.sync();
    };

    // go to priority selection with drillIn animation
    self.goToPriority = function() {
      app.pendingAnimationType = 'navChild';
      self.router.go('priority');
    };

    // go to status selection with drillIn animation
    self.goToStatus = function() {
      app.pendingAnimationType = 'navChild';
      self.router.go('status');
    };

    // handler for back button click
    self.goToPrevious = function() {
      var state = self.router.currentState().id;
      // set drill out animation

      // todo investigate pull-to-refresh and android drill in/out animation
      app.pendingAnimationType = 'navParent';

      if( state === 'priority' || state === 'status') {
        // go back to incident summary
        window.history.back();
      } else {
        // go back to incidents
        app.goToIncidents();
      }
    };

    var showNavBtn = ko.observable(false);

    // incident page header settings
    self.incidentHeaderSettings = {
      name:'basicHeader',
      params: {
        title: 'Incident',
        startBtn: {
          click: self.goToPrevious,
          display: 'icons',
          label: 'Back',
          icons: {start:'oj-hybrid-applayout-header-icon-back oj-fwk-icon'},
          visible: true
        },
        endBtn: {
          id: 'navigateBtn',
          click: '',
          display: 'icons',
          label: 'Navigate',
          icons: {start:'demo-location-icon-24 demo-icon-font-24 oj-fwk-icon'},
          visible: showNavBtn
        }
      }
    };

    // update animation based on nav tabs selction change
    self.navBarChange = function(event, ui) {
      if(ui.option === 'currentItem') {

        var previousValue = ui.previousValue || self.router.stateId();

        switch(previousValue) {
          case 'incidentTabSummary':
            app.pendingAnimationType = 'navSiblingLater';
            break;
          case 'incidentTabActivity':
            if(ui.value === 'incidentTabSummary') {
              app.pendingAnimationType = 'navSiblingEarlier';
            } else {
              app.pendingAnimationType = 'navSiblingLater';
            }
            break;
          case 'incidentTabMap':
            app.pendingAnimationType = 'navSiblingEarlier';
        }
      }
    };
  }

  return viewModel;
});
