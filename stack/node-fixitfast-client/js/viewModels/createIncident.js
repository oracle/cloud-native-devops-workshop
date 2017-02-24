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
        'mapping',
        'dataService',
        'appController',
        'ojs/ojknockout',
        'ojs/ojtrain',
        'ojs/ojarraytabledatasource',
        'ojs/ojinputtext'],
function(oj, ko, $, mapping, data, app) {
  function createIncidentViewModel(params) {
    var self = this;

    self.handleActivated = function(params) {

      var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

      self.router = parentRouter.createChildRouter('createIncident').configure({
        'createIncident_problem': { label: 'Problem', isDefault: true, value: {prev:'Cancel', next: 'Next', showTrain: true} },
        'createIncident_photo': { label: 'Photo', value: {prev:'Previous', next: 'Next', showTrain: true, img: self.newIncidentModel().picture } },
        'createIncident_contact': { label: 'Contact', value: {prev:'Previous', next: 'Next', showTrain: true } },
        'createIncident_summary': { label: 'Summary', value: {prev:'Previous', next: 'Submit', showTrain: true } },
        'createIncident_submit': { label: 'Submit', value: {prev:'', next: '', showTrain: false } }
      });

      return oj.Router.sync();
    };

    self.handleTransitionCompleted = function(info) {
      // adjust content padding top
      app.appUtilities.adjustContentPadding();
    };

    // dispose create incident page child router
    self.dispose = function(info) {
      self.router.dispose();
    };

    self.stepArray = ko.observableArray([{label:'Problem', id:'createIncident_problem'},
                                         {label:'Photo', id:'createIncident_photo'},
                                         {label:'Customer', id:'createIncident_contact'},
                                         {label:'Summary', id:'createIncident_summary'}]);

    ko.mapping = mapping;

    var newIncidentObj = {
      "problem": "",
      "category": "general",
      "picture": "",
      "priority": "high",
      "customerId": "",
      "locationId": "",
      "customerName": ""
    };

    self.newIncidentModel = ko.observable(ko.mapping.fromJS(newIncidentObj));

    self.allCustomers = ko.observableArray();
    self.customersDataSource = new oj.ArrayTableDataSource(self.allCustomers, {idAttribute: "id"});

    // load customers data
    data.getCustomers().then(function(response) {

      var result = JSON.parse(response).result;

      // sort by firstName then lastName within each group
      result.sort(function(a, b) {
        // sort by first name
        if (a.firstName.toLowerCase() > b.firstName.toLowerCase()) {
          return 1;
        } else if (a.firstName.toLowerCase() < b.firstName.toLowerCase()) {
          return -1;
        }

        // else sort by last name
        return (a.lastName.toLowerCase() > b.lastName.toLowerCase()) ? 1 : (a.lastName.toLowerCase() < b.lastName.toLowerCase()) ? -1 : 0;
      });


      self.allCustomers(result);
      self.customersDataSource = new oj.ArrayTableDataSource(self.allCustomers, {idAttribute: "id"});

    });

    // handler when customer selection changes
    self.customerSelectionChange = function(event, data) {
      if(data.option === 'value') {

        var selectedCustomer = self.allCustomers().filter(function(customer) {
          return customer.id === data.value;
        });

        self.newIncidentModel().customerName(selectedCustomer[0].firstName + ' ' + selectedCustomer[0].lastName);
        self.newIncidentModel().locationId(selectedCustomer[0].locationId);
      }
    };

    // go to next step
    self.nextStep = function() {
      var next = $("#train").ojTrain("nextSelectableStep");
      if(next !== null) {
        self.router.go(next);
      } else {
        self._submitIncident();
      }
    };

    // go to previous step
    self.previousStep = function() {
      var prev = $("#train").ojTrain("previousSelectableStep");
      if(prev !== null) {
        self.router.go(prev);
      } else {
        app.goToIncidents();
      }
    };

    // submit new incident
    self._submitIncident = function() {

      var incident = ko.mapping.toJS(self.newIncidentModel);

      delete incident.customerName;
      incident.customerId = incident.customerId;

      // TODO validation
      if(!incident.problem) {
        return oj.Logger.warn('Please enter the problem');
      }

      if(!incident.customerId) {
        return oj.Logger.warn('Please select a customer');
      }

      self.router.go('createIncident_submit');
      data.createIncident(incident).then(function(response){
        // go back to incidents list after 1.5s
        setTimeout(function() {
          app.goToIncidents();
        }, 1500);
      }).fail(function(response){
        oj.Logger.error('Failed to create incident.', response);
      });

    };

    // create incident page header
    self.createIncidentHeaderSettings = function() {

      var clickAction = function() {
        if(self.router.currentValue().showTrain) {
          return self.previousStep();
        } else {
          return app.toggleDrawer();
        }
      };

      var icons = ko.computed(function() {
        if(self.router.currentValue().showTrain) {
          return {start:'oj-hybrid-applayout-header-icon-back demo-icon oj-fwk-icon'};
        } else {
          return {start: 'oj-fwk-icon oj-fwk-icon-hamburger'};
        }
      });

      var disableSubmit = ko.computed(function() {
        if(self.router.stateId() === 'createIncident_summary' && app.isReadOnlyMode)
          return true;
        else
          return false;
      })

      return {
        name:'basicHeader',
        params: {
          title: 'New Incident',
          startBtn: {
            click: clickAction,
            display: 'icons',
            label: self.router.currentValue().prev,
            icons: icons,
            visible: true
          },
          endBtn: {
            click: self.nextStep,
            display: 'icons',
            label: self.router.currentValue().next,
            icons: {start:'oj-hybrid-applayout-header-icon-back oj-fwk-icon flip-to-right'},
            visible: self.router.currentValue().showTrain,
            disabled: disableSubmit
          }
        }
      };
    };
  }

  return createIncidentViewModel;

});
