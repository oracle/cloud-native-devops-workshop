/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout',
        'appController',
        'ojs/ojknockout',
        'ojs/ojarraytabledatasource',
        'ojs/ojradioset'],
function(oj, ko, app) {
  function priorityViewModel() {
    var self = this;

    // adjust content padding for fixed top region
    self.handleAttached = function(info) {
      app.appUtilities.adjustContentPadding();
    }

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navChild') {
        app.preDrill();
      }
    };

    self.handleTransitionCompleted = function(info) {
      if (app.pendingAnimationType === 'navChild') {
        app.postDrill();
      }
    };

    var priorityOptionsArr = [{'id': 'high', 'title': 'High'},
                              {'id': 'normal', 'title': 'Normal'},
                              {'id': 'low', 'title': 'Low'}];

    self.priorityOptions= ko.observableArray();
    self.priorityOptions(new oj.ArrayTableDataSource(priorityOptionsArr, {idAttribute: 'id'}));

  }

  return priorityViewModel;
});
