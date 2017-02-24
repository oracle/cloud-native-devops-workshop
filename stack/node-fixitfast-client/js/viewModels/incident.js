/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'dataService', 'appController', 'ojs/ojknockout'], function(oj, ko, $, data, app) {
  function incidentViewModel() {
    var self = this;

    self.incidentData = ko.observable();

    self.handleActivated = function(params) {

      var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

      self.router = parentRouter.createChildRouter('incident').configure(function(stateId) {

        if(stateId) {

          var state = new oj.RouterState(stateId, {
            enter: function () {
              data.getIncident(stateId).then(function(response) {
                var incidentData = JSON.parse(response);
                incidentData.statusSelection = ko.observableArray([incidentData.status]);
                incidentData.prioritySelection = ko.observableArray([incidentData.priority]);
                self.incidentData(incidentData);
              });
            }
          });

          return state;
        }

      });

      return oj.Router.sync();
    };

    self.dispose = function(info) {
      self.router.dispose();
    };

    self.locationId = ko.computed(function() {
      if (self.incidentData()) {
        return self.incidentData().locationId;
      }
    });

    // switch to incidentViews and pass incident location to it
    self.moduleConfig = ko.pureComputed(function () {
      var moduleConfig = $.extend(true, {}, self.router.moduleConfig, {
        'name': 'incidentViews',
        'params': { 'locationId': self.locationId }
      });

      return moduleConfig;
    });

    // update incident when status or priority changes
    self.updateIncident = function(id, incident) {
      data.updateIncident(id, incident).then(function(response){
        // update success
      }).fail(function(response) {
        oj.Logger.error('Failed to update incident.', response);
      });
    };

    // priority selection change
    self.priorityChange = function(event, data) {
      updatePriorityStatus('priority', data);
    };

    // status selection change
    self.statusChange = function(event, data) {
      updatePriorityStatus('status', data);
    };

    function updatePriorityStatus(option, data) {
      if(data.option === "value") {
        if(data.value) {
          self.updateIncident(self.router.stateId(), {[option]: data.value});
        }
      }
    }

  }

  return incidentViewModel;

});
