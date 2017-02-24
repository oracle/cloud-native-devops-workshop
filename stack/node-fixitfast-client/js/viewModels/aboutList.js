/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore',
        'appController',
        'ojs/ojlistview',
        'ojs/ojarraytabledatasource'],
  function(oj, app) {
    function aboutListViewModel(params) {
      var self = this;

      // retrieve about items to render the list
      self.aboutOptions = new oj.ArrayTableDataSource(params.list, {idAttribute: 'id'});

      self.handleActivated = function() {
        var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
        contentElem.style.paddingTop = 0;
      }

      self.handleBindingsApplied = function(info) {
        if (app.pendingAnimationType === 'navParent') {
          app.preDrill();
        }
      };

      self.handleTransitionCompleted = function(info) {
        if (app.pendingAnimationType === 'navParent') {
          app.postDrill();
        }
      };

    }
    return aboutListViewModel;
  });
