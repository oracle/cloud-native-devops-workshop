/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

 // incidents list view viewModel
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery',
        'dataService',
        'appController',
        'ojs/ojknockout',
        'ojs/ojoffcanvas',
        'ojs/ojlistview',
        'ojs/ojswipetoreveal',
        'ojs/ojjquery-hammer',
        'promise',
        'ojs/ojpulltorefresh',
        'ojs/ojmodel',
        'ojs/ojcheckboxset',
        'ojs/ojarraytabledatasource',
        'ojs/ojpopup',
        'ojs/ojanimation'],
function(oj, ko, $, data, app) {
  function tablistViewModel(params) {

    var self = this;

    // load incidents on activation
    self.handleActivated = function(params) {
      self.incidentsPromise = params.valueAccessor().params['incidentsPromise'];

      self.incidentsPromise.then(function(response) {

        var incidentsData = JSON.parse(response);

        processIncidentsData(incidentsData);
      });

      return self.incidentsPromise;
    };

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navParent') {
        app.preDrill();
      }
    };

    self.handleAttached = function(info) {

      app.appUtilities.adjustContentPadding();

      oj.PullToRefreshUtils.setupPullToRefresh('body', function() {
        return new Promise(function(resolve, reject) {
          // check for new incidents
          data.getIncidents().then(function(response) {
            var incidentsData = JSON.parse(response);
            processIncidentsData(incidentsData);
            resolve();
          }).fail(function(response){
            // TODO
            reject();
          });
        });
        // TODO fix refresh issue on transition
      }, { 'primaryText': 'Checking for new incidents…', 'secondaryText': '', 'threshold': 100 });

      // adjust position for pull to refresh panel
      var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
      var contentElems = document.getElementsByClassName('oj-pulltorefresh-panel');

      for(var i=0; i<contentElems.length; i++) {
        if (topElem) {
          contentElems[i].style.position = 'relative';
          contentElems[i].style.top = topElem.offsetHeight+'px';
        }
      }

      $('#incidentsListView').on({
        'ojdestroy': function() {
          oj.PullToRefreshUtils.tearDownPullToRefresh('body');
        }
      });
    };

    self.handleTransitionCompleted = function(info) {

      if (app.pendingAnimationType === 'navParent') {
        app.postDrill();
      }

      // invoke zoomIn animation on floating action button
      var animateOptions = { 'delay': 0, 'duration': '0.3s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['zoomIn']($('#addIncident')[0], animateOptions);

    };

    function processIncidentsData(incidentsData) {
      incidentsData.result.forEach(function(incident){
        incident.statusObservable = ko.observable(incident.status);
      });

      incidentsData.result.sort(function(a, b) {
        return (a.createdOn < b.createdOn) ? 1 : (a.createdOn > b.createdOn) ? -1 : 0;
      });

      self.allIncidents(incidentsData.result);
      return self.filterIncidents();
    }

    self.scrollElem = document.body;

    self.priorityFilterArr = ko.observable(['high', 'normal', 'low']);
    self.statusFilterArr = ko.observable(['open', 'accepted', 'closed']);

    self.allIncidents = ko.observableArray([]);
    self.filteredIncidents = ko.observableArray([]);
    self.incidentsTableData = new oj.ArrayTableDataSource(self.filteredIncidents, { idAttribute: 'id' });

    self.filterIncidents = function() {
      var results = self.allIncidents().filter(function(incident) {
        return self.priorityFilterArr().indexOf(incident.priority) > -1 && self.statusFilterArr().indexOf(incident.statusObservable()) > -1;
      });

      self.filteredIncidents(results);
    };

    // update incidents list when priority or status filter changes
    self.priorityFilterArr.subscribe(function(newValue) {
      self.filterIncidents();
    });

    self.statusFilterArr.subscribe(function(newValue) {
      self.filterIncidents();
    });

    self.selectHandler = function(event, ui) {
      if(ui.option === 'selection') {
        event.preventDefault();

        // todo investigate pull-to-refresh and android drill in/out animation
        app.pendingAnimationType = 'navChild';
        app.goToIncident(ui.value[0], 'tablist');
      }
    };

    self.handleMenuItemSelect = function(event, ui) {
      var id = ui.item.prop("id");
      if (id == "return")
        self._handleReturn();
      else if (id == "open")
        self._handleOpen();
      else if (id == "accept")
        self._handleAccept();
      else if (id == "close")
        self._handleClose();
    };

    self.goToAddIncident = function() {
      app.goToCreateIncident();
    };

    self.handleReady = function() {
      // register swipe to reveal for all new list items
      $("#incidentsListView").find(".demo-item-marker").each(function(index) {
        var id = $(this).prop("id");
        var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
        var endOffcanvas = $(this).find(".oj-offcanvas-end").first();

        // setup swipe actions
        oj.SwipeToRevealUtils.setupSwipeActions(startOffcanvas);
        oj.SwipeToRevealUtils.setupSwipeActions(endOffcanvas);

        // make sure listener only registered once
        endOffcanvas.off("ojdefaultaction");
        endOffcanvas.on("ojdefaultaction", function() {
          // No default action
        });
      });
    };

    self.handleDestroy = function() {
      // register swipe to reveal for all new list items
      $("#incidentsListView").find(".demo-item-marker").each(function(index) {
        var startOffcanvas = $(this).find(".oj-offcanvas-start").first();
        var endOffcanvas = $(this).find(".oj-offcanvas-end").first();

        oj.SwipeToRevealUtils.tearDownSwipeActions(startOffcanvas);
        oj.SwipeToRevealUtils.tearDownSwipeActions(endOffcanvas);
      });
    };

    self.closeToolbar = function(which, item) {
      var toolbarId = "#"+which+"_toolbar_"+item.prop("id");
      var drawer = {"displayMode": "push", "selector": toolbarId};

      oj.OffcanvasUtils.close(drawer);
    };

    self.handleAction = function(which, action, model) {

      if (model !== null && model.id) {
        // offcanvas won't be open for default action case
        if (action != "default") {
          self.closeToolbar(which, $(model));
        }

        var index = self.allIncidents().map(function(e) { return e.id; }).indexOf(model.id);
        self.allIncidents()[index].statusObservable(action);

        data.updateIncident(model.id, {status: action}).then(function(response) {
          // update success
          // re-apply filter to incidents after changing status
          self.filterIncidents();
        }).fail(function(response){
          oj.Logger.error('Failed to update incident.', response)
        });

      } else {
        id = $("#incidentsListView").ojListView("option", "currentItem");
      }
    };

    self._handleAccept = function(model) {
      self.handleAction('second', 'accepted', model);
    };

    self._handleOpen = function(model) {
      self.handleAction('second', 'open', model);
    };

    self._handleReturn = function(model) {
      self.handleAction('second', 'open', model);
    };

    self._handleTrash = function(model) {
      self.handleAction('second', 'closed', model);
    };

    self._handleOKCancel = function() {
      $("#modalDialog1").ojDialog("close");
    };

    self.removeModel = function(model) {
      self.allIncidents.remove(function(item) {
        return (item.id == model.id);
      });
    };

  }

  return tablistViewModel;

});
