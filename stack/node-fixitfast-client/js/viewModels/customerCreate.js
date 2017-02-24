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
        'appController',
        'dataService',
        'ojs/ojknockout',
        'ojs/ojinputtext'],
function(oj, ko, $, app, data) {
  function addCustomerViewModel() {
    var self = this;

    // adjust content padding
    self.handleTransitionCompleted = function(info) {
      app.appUtilities.adjustContentPadding();
    };

    self.handleAttached = function() {
      $('#upload-new-customer-pic').change({ imgHolder: self.imgSrc }, function(event) {
        app.photoOnChange(event);
      });
    }

    self.imgSrc = ko.observable('css/images/Add_avatar@2x.png');

    self.customer = {
      firstName: ko.observable(),
      lastName: ko.observable(),
      mobile: ko.observable(),
      home: ko.observable(),
      email: ko.observable(),
      address: {
        street1: ko.observable(),
        street2: ko.observable(),
        city: ko.observable(),
        state: ko.observable(),
        zip: ko.observable(),
        country: ko.observable()
      }
    };

    // create new customer
    // TODO upload customer pic
    self.createCustomer = function() {
      data.createCustomer(ko.toJS(self.customer)).then(function(response){
        var result = JSON.parse(response);
        app.goToCustomer(result.id);
      }).fail(function(response) {
        oj.Logger.error('Failed to create customer.', response);
      });
    };

    // go to previous page
    self.goToPrevious = function() {
      window.history.back();
    };

    // create customer page header settings
    self.custAddHeaderSettings = function(){
      return {
        name:'basicHeader',
        params: {
          title: 'Add Customer',
          startBtn: {
            click: self.goToPrevious,
            display: 'icons',
            label: 'Back',
            icons: {start:'oj-hybrid-applayout-header-icon-back oj-fwk-icon'},
            visible: true
          },
          endBtn: {
            click: self.createCustomer,
            display: 'all',
            label: 'Save',
            icons: {},
            visible: true,
            disabled: app.isReadOnlyMode
          }
        }
      };
    };

    // handler for change photo
    self.changePhoto = function() {

      if(!navigator.camera) {
        return $('#upload-new-customer-pic').trigger('click');
      } else {
        return app.openBottomDrawer(self.imgSrc);
      }
    };

  }

  return addCustomerViewModel;

});
