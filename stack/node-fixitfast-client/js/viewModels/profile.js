/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['knockout', 'jquery', 'appController', 'ojs/ojknockout', 'ojs/ojinputtext'], function(ko, $, app) {
  function profileViewModel() {
    var self = this;

    self.handleAttached = function() {
      // bind photoOnChange after profile data is loaded
      var subscription = app.userProfileModel.subscribe(function(newVal) {
        if(newVal) {
          $('#upload-profile-pic').change({ imgHolder: app.userProfileModel().photo }, function(event) {
            app.photoOnChange(event);
          });
        }
      });

    };

    // adjust content padding
    self.handleTransitionCompleted = function(info) {
      app.appUtilities.adjustContentPadding();
    };

    self.editMode = ko.observable(false);

    // profile page header
    self.profileHeaderSettings = function() {

      var rightBtnLabel = ko.computed(function(){
        if(self.editMode()) {
          return 'Save';
        } else {
          return 'Edit';
        }
      });

      var rightClickAction = function() {
        if(self.editMode()) {
          app.updateProfileData();
          self.editMode(false);
        } else {
          self.editMode(true);
        }
      };

      var leftClickAction = function() {
        if(self.editMode()) {
          app.revertProfileData();
          self.editMode(false);
        } else {
          return app.toggleDrawer();
        }
      };

      var icons = ko.computed(function() {
        if(self.editMode()) {
          return {start:'oj-hybrid-applayout-header-icon-back oj-fwk-icon'};
        } else {
          return {start: 'oj-fwk-icon oj-fwk-icon-hamburger'};
        }
      });

      return {
        name:'basicHeader',
        params: {
          title: 'Profile',
          startBtn: {
            click: leftClickAction,
            display: 'icons',
            label: 'Back',
            icons: icons,
            visible: true
          },
          endBtn: {
            click: rightClickAction,
            display: 'all',
            label: rightBtnLabel,
            icons: {},
            visible: true,
            disabled: app.isReadOnlyMode ? self.editMode : false
          }
        }
      };
    };

    // handler for photo change
    self.changePhoto = function() {

      if(!navigator.camera) {
        return $('#upload-profile-pic').trigger('click');
      } else {
        return app.openBottomDrawer(app.userProfileModel().photo);
      }
    };

  }

  return profileViewModel;
});
