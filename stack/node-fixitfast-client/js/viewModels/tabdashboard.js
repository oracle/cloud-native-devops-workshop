/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// dashboard viewModel that controls the visualizations

'use strict';
define(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojknockout'], function(oj, ko, app) {

  function dashboardViewModel() {
    var self = this;

    // lazy loading of ojchart after all other dashboard modules are loaded
    self.demoChartComponent = ko.observable(null);
    self.integerConverter = ko.observable(null);
    require(['knockout', 'ojs/ojknockout', 'ojs/ojchart'], function(ko) {
      self.demoChartComponent('ojChart');

      var converterFactory = oj.Validation.converterFactory('number');
      self.integerConverter(converterFactory.createConverter({minimumFractionDigits: 0, maximumFractionDigits: 0}));
    });

    // load incidents stats on activation
    self.handleActivated = function(params) {

      self.statsPromises = params.valueAccessor().params['statsPromises'];
      self.incidentsStatsPromise = Promise.all(self.statsPromises);

      // update charts data upon loading incidents stats
      self.incidentsStatsPromise.then(function(results) {

        var pieChartResult = JSON.parse(results[0]);
        var barChartResult = JSON.parse(results[1]);

        self.setPieChart(pieChartResult);

        self.setBarChart(barChartResult.metrics);

      });

      return self.incidentsStatsPromise;
    };

    self.handleAttached = function(info) {
      app.appUtilities.adjustContentPadding();
    };

    self.centerLabel = ko.observable();
    self.labelStyle = ko.observable('color:#6C6C6C;font-size:33px;font-weight:200;');

    self.numPriorityHigh = ko.observable(0);
    self.numPriorityNormal = ko.observable(0);
    self.numPriorityLow = ko.observable(0);

    self.pieSeriesValue = ko.observableArray([]);
    self.pieGroupsValue = ko.observableArray([]);

    self.innerRadius = ko.observable(0.8);

    self.setBarChart = function(data) {

      var barGroups = [];
      var series = [{ name: "Open Incidents", items: [], color: '#88C667' },
                    { name: "Closed Incidents", items: [], color: '#4C4C4B' }];

      data.forEach(function(entry) {
        barGroups.push(entry.month);
        series[0].items.push(entry.incidentsAssigned - entry.incidentsClosed);
        series[1].items.push(entry.incidentsClosed);
      });

      self.barSeriesValue = ko.observableArray(series);

      self.barGroupsValue = ko.observableArray(barGroups);

    };

    self.setPieChart = function(data) {
      self.centerLabel(data.incidentCount.high + data.incidentCount.normal + data.incidentCount.low);

      self.numPriorityHigh(data.incidentCount.high);
      self.numPriorityNormal(data.incidentCount.normal);
      self.numPriorityLow(data.incidentCount.low);

      var pieSeries = [{items: [self.numPriorityLow()], color: '#7FBA60', name: 'Low Pirority' },
                   {items: [self.numPriorityNormal()], color: '#4092D0', name: 'Normal Priority' },
                   {items: [self.numPriorityHigh()], color: '#FF453E', name: 'High Priority' }];

      var pieGroups = ["Group A"];

      self.pieSeriesValue(pieSeries);
      self.pieGroupsValue(pieGroups);
    };

    self.labelValue = ko.computed(function() {
      if(self.centerLabel()) {
        return {text: self.centerLabel().toString(), style: self.labelStyle()};
      }
    });


  }

  return dashboardViewModel;
});
