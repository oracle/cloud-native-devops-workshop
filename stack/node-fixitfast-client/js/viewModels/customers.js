/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'jquery', 'appController', 'ojs/ojinputtext'], function (oj, $, app) {
  function customersViewModel() {
    var self = this;

    self.handleActivated = function(params) {

      var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

      self.router = parentRouter.createChildRouter('customers').configure({
        'customersList': { label: 'Customers List', isDefault: true },
        'customerDetails': { label: 'Customer Details' },
        'customerCreate': { label: 'Add Customer', canEnter: function() {
            if(self.router.stateId() === 'customerDetails') {
              window.history.back();
              return false;
            } else {
              return true;
            }
          }
        }
      });

      function switcherCallback(context) {
        return app.pendingAnimationType;
      }

      function mergeConfig(original) {
        return $.extend(true, {}, original, {
          'animation': oj.ModuleAnimations.switcher(switcherCallback)
        });
      }

      // pass animation to module transition
      self.moduleConfig = mergeConfig(self.router.moduleConfig);

      return oj.Router.sync();
    };

    self.dispose = function(info) {
      self.router.dispose();
    };

  }

  return customersViewModel;

});
