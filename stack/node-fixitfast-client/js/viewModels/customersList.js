/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery',
        'dataService',
        'appController',
        'ojs/ojknockout',
        'ojs/ojdatacollection-common',
        'ojs/ojindexer',
        'ojs/ojanimation'], function(oj, ko, $, data, app){
  function customersViewModel() {
    var self = this;

    self.handleActivated = function(params) {
      // retrieve parent router
      self.parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];
    };

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navParent') {
        app.preDrill();
      }
    };

    self.handleTransitionCompleted = function(info) {

      // adjust content padding top
      app.appUtilities.adjustContentPadding();

      // adjust padding-bottom for indexer
      var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
      var contentElem = document.getElementById('indexer');

      contentElem.style.paddingBottom = topElem.offsetHeight+'px';
      document.getElementById('indexer').style.position = 'relative';

      if (app.pendingAnimationType === 'navParent') {
        app.postDrill();
      }

      // invoke zoomIn animation on floating action button
      var animateOptions = { 'delay': 0, 'duration': '0.3s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['zoomIn']($('#addCustomer')[0], animateOptions);

    };

    self.scrollElem = document.body;

    self.allCustomers = ko.observableArray();
    self.nameSearch = ko.observable();

    self.itemOnly = function(context) {
      return context['leaf'];
    };

    self.selectTemplate = function(file, bindingContext) {
      return bindingContext.$itemContext.leaf ? 'item_template' : 'group_template';
    };

    self.getIndexerModel = function() {
      if (!self.indexerModel) {
        var listView = $("#customerlistview");
        var indexerModel = listView.ojListView("getIndexerModel");
        self.indexerModel = indexerModel;
      }

      return self.indexerModel;
    };

    // load customers
    data.getCustomers().then(function(response) {

      var result = JSON.parse(response).result;

      var formatted = [];
      var keys = [];

      // format data for indexer groups
      for(var i=0; i<result.length; i++) {
        var firstNameInitial = result[i].firstName.charAt(0).toUpperCase();
        if(keys.indexOf(firstNameInitial) > -1) {
          formatted[keys.indexOf(firstNameInitial)].children.push({attr: result[i]});
        } else {
          keys.push(firstNameInitial);
          formatted.push({
            attr: { id: firstNameInitial },
            children: [{attr: result[i]}]
          });
        }
      }

      // sort by firstName initial
      formatted.sort(function(a, b) {
        return (a.attr.id > b.attr.id) ? 1 : (a.attr.id < b.attr.id) ? -1 : 0;
      });

      // sort by firstName then lastName within each group
      formatted.forEach(function(group) {

        group.children.sort(function(a, b) {
          // sort by first name
          if (a.attr.firstName > b.attr.firstName) {
            return 1;
          } else if (a.attr.firstName < b.attr.firstName) {
            return -1;
          }

          // else sort by last name
          return (a.attr.lastName > b.attr.lastName) ? 1 : (a.attr.lastName < b.attr.lastName) ? -1 : 0;
        });
      });

      self.allCustomers(formatted);

    });

    // filter customers
    self.customers = ko.computed(function() {

      if (self.nameSearch() && self.allCustomers().length > 0) {
        var filteredCustomers = [];

        var token = self.nameSearch().toLowerCase();

        self.allCustomers().forEach(function (node) {
          node.children.forEach(function (leaf) {
            if (leaf.attr.firstName.toLowerCase().indexOf(token) === 0 || leaf.attr.lastName.toLowerCase().indexOf(token) === 0) {
              filteredCustomers.push(leaf);
            }
          });
        });
        return new oj.JsonTreeDataSource(filteredCustomers);

      } else {
        return new oj.JsonTreeDataSource(self.allCustomers());
      }

    });

    // go to create customer page
    self.goToAddCustomer = function() {
      self.parentRouter.go('customerCreate');
    };

    // handler for drill in to customer details
    self.optionChange = function(event, ui) {
      if (ui.option === 'selection' && ui.value[0]) {
        app.pendingAnimationType = 'navChild';
        app.goToCustomer(ui.value);
      }
    };

    self.isSearchMode = ko.observable(false);

    self.goToSearchMode = function() {
      self.isSearchMode(true);
      $("#inputSearch").focus();
    };

    self.exitSearchMode = function() {
      self.isSearchMode(false);
      self.clearSearch();
    };

    self.clearSearch = function() {
      self.nameSearch('');
    };

	}

  return customersViewModel;

});
