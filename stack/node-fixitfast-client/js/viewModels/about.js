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
        'ojs/ojknockout',
        'ojs/ojpopup'],
  function(oj, ko, $, app) {

    function aboutViewModel() {
      var self = this;

      var aboutContent = [{id: 'aboutDemo', title: '', label: 'About Demo' },
                          {id: 'privacyPolicy', title: 'Oracle Privacy Policy', label: 'Oracle Privacy Policy' }];

      self.handleActivated = function(params) {

        var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];

        // add aboutList as default state on child router
        var routerConfigOptions = {
          'aboutList': { label: 'About', isDefault: true },
        };

        // add each about list item to the router
        aboutContent.forEach(function(item) {
          var id = item.id.toString();
          routerConfigOptions[id] = { label: item.title };
        });

        self.router = parentRouter.createChildRouter('about').configure(routerConfigOptions);

        var switcherCallback = function(context) {
          return app.pendingAnimationType;
        };

        // switch module based on router state
        self.moduleConfig = ko.pureComputed(function () {
          var moduleConfig;

          // pass the list content to the list view
          if(self.router.stateId() === 'aboutList') {
            moduleConfig = $.extend(true, {}, self.router.moduleConfig, {
              'params': { 'list': aboutContent },
              'animation': oj.ModuleAnimations.switcher(switcherCallback)
            });
          } else {
            // pass the list item content to the content view
            moduleConfig = $.extend(true, {}, self.router.moduleConfig, {
              'name': 'aboutContent',
              'params': { 'contentID': self.router.stateId() },
              'animation': oj.ModuleAnimations.switcher(switcherCallback)
            });
          }

          return moduleConfig;
        });

        return oj.Router.sync();
      };

      // dispose about page child router
      self.dispose = function(info) {
        self.router.dispose();
      };

      // handle go back
      self.goBack = function() {
        app.pendingAnimationType = 'navParent';
        window.history.back();
      };

      // navigate to about content
      self.optionChange = function(event, ui) {
        if(ui.option === 'selection' && ui.value[0] !== null) {
          app.pendingAnimationType = 'navChild';
          self.router.go(ui.value.toString());
        }
      };

      // open social links popup
      self.openPopup = function() {
        $( "#aboutPopup" ).ojPopup( "option", "position", {
          "my": "center top",
          "at": "center top+50",
          "of": ".oj-applayout-content"
        });
        return $('#aboutPopup').ojPopup('open', '#profile-action-btn');
      };

    }

    return aboutViewModel;

  });
