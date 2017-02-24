/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// Application level setup including router, animations and other utility methods

'use strict';
define(['ojs/ojcore', 'knockout', 'jquery',
        'dataService',
        'mapping',
        'ojs/ojknockout',
        'ojs/ojnavigationlist',
        'ojs/ojoffcanvas',
        'ojs/ojmodule',
        'ojs/ojrouter',
        'ojs/ojmoduleanimations'],
function (oj, ko, $, data, mapping) {

  oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

  var router = oj.Router.rootInstance;

  // Root router configuration
  router.configure({
    'tour': { label: 'Tour', isDefault: true },
    'incidents': { label: 'Incidents' },
    'signin': { label: 'Sign In' },
    'customers': { label: 'Customers' },
    'profile': { label: 'Profile' },
    'about': { label: 'About' },
    'incident': { label: 'Incident' },
    'settings': { label: 'Settings' },
    'createIncident': { label: 'Create an Incident' }
  });

  function AppControllerViewModel() {

    ko.mapping = mapping;

    var self = this;

    self.router = router;

    // drill in and out animation
    var platform = oj.ThemeUtils.getThemeTargetPlatform();

    self.pendingAnimationType = null;

    function switcherCallback(context) {
      return self.pendingAnimationType;
    }

    function mergeConfig(original) {
      return $.extend(true, {}, original, {
        'animation': oj.ModuleAnimations.switcher(switcherCallback)
      });
    }

    self.moduleConfig = mergeConfig(self.router.moduleConfig);

    function positionFixedTopElems(position) {
      var topElems = document.getElementsByClassName('oj-applayout-fixed-top');

      for (var i = 0; i < topElems.length; i++) {
        // Toggle between absolute and fixed positioning so we can animate the header.
        // We don't need to adjust for scrolled content here becaues the animation utility
        // moves the contents to a transitional div losing the scroll position
        topElems[i].style.position = position;
      }
    }

    self.preDrill = function() {
      positionFixedTopElems('absolute');
    };

    self.postDrill = function() {
      positionFixedTopElems('fixed');
      self.pendingAnimationType = null;
    };

    // set default connection to MCS backend
    var defaultConnection = true;
    self.isOnlineMode = ko.observable(defaultConnection);
    data.setOnlineMode(defaultConnection);

    // disable buttons for post/patch/put
    self.isReadOnlyMode = true;

    self.isOnlineMode.subscribe(function(newValue) {
      data.setOnlineMode(newValue);
    });

    // Load user profile
    self.userProfileModel = ko.observable();

    data.getUserProfile().then(function(response){
      processUserProfile(response);
    }).catch(function(response){
      oj.Logger.warn('Failed to connect to MCS. Loading from local data.');
      self.isOnlineMode(false);
      //load local profile data
      data.getUserProfile().then(function(response){
        processUserProfile(response);
      });
    });

    function processUserProfile(response) {
      var result = JSON.parse(response);

      if(result) {
        self.initialProfile = result;
        self.userProfileModel(ko.mapping.fromJS(result));
      }
    }

    self.updateProfileData = function() {
      self.initialProfile = ko.mapping.toJS(self.userProfileModel);
      data.updateUserProfile(self.initialProfile).then(function(response){
        // update success
      }).catch(function(response){
        oj.Logger.error(response);
      });
    };

    // Revert changes to user profile
    self.revertProfileData = function() {
      self.userProfileModel(ko.mapping.fromJS(self.initialProfile));
    };

    // Navigate to customer by id
    self.goToCustomer = function(id) {
      self.router.go('customers/customerDetails/' + id);
    };

    // Navigate to incident by id
    self.goToIncident = function(id, from) {
      self.router.go('incident/' + id);
      self.fromIncidentsTab = from;
    };

    self.goToSignIn = function() {
      self.router.go('signin');
    };

    self.goToIncidents = function() {
      var destination = self.fromIncidentsTab || 'tablist';
      self.router.go('incidents/' + destination);
    };

    self.goToCreateIncident = function() {
      self.fromIncidentsTab = 'tablist';
      self.router.go('createIncident');
    };

    self.drawerChange = function (event, data) {
      if (data.option === 'selection') {
        self.closeDrawer();
      }
    };

    self.toggleDrawer = function () {
      return oj.OffcanvasUtils.toggle({selector: '#navDrawer', modality: 'modal', content: '#pageContent' });
    };

    self.closeDrawer = function () {
      return oj.OffcanvasUtils.close({selector: '#navDrawer', modality: 'modal', content: '#pageContent' });
    };

    self.bottomDrawer = { selector: '#bottomDrawer', modality: 'modal', content: '#pageContent', displayMode: 'overlay' };

    self.openBottomDrawer = function(imageObject) {

      self.updateProfilePhoto = function(sourceType) {

        var cameraOptions = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            encodingType: 0,     // 0=JPG 1=PNG
            correctOrientation: true,
            targetHeight: 1000,
            targetWidth: 1000
        };

        navigator.camera.getPicture(function(imgURI) {
          imageObject("data:image/jpeg;base64," + imgURI);
        }, function(err) {
          oj.Logger.error(err);
        }, cameraOptions);

        return oj.OffcanvasUtils.close(self.bottomDrawer);

      };

      return oj.OffcanvasUtils.open(self.bottomDrawer);
    };

    self.closeBottomDrawer = function() {
      return oj.OffcanvasUtils.close(self.bottomDrawer);
    };

    // upload photo
    self.photoOnChange = function(event) {

      var imgHolder = event.data.imgHolder;

      // Get a reference to the taken picture or chosen file
      var files = event.target.files;
      var file;

      if (files && files.length > 0) {
        file = files[0];
        try {
          var fileReader = new FileReader();
          fileReader.onload = function (event) {
            imgHolder(event.target.result);
          };
          fileReader.readAsDataURL(file);
        } catch (e) {
          oj.Logger.error(e);
        }
      }
    };

    // Common utility functions for formatting
    var avatarColorPalette = ["#42ad75", "#17ace4", "#e85d88", "#f4aa46", "#5a68ad", "#2db3ac", "#c6d553", "#eb6d3a"];

    var userAvatarColor = "#eb6d3a";

    var formatAvatarColor = function (role, id) {
      if(role.toLowerCase() === 'customer') {
        return avatarColorPalette[id.slice(-3)%8];
      } else {
        return userAvatarColor;
      }
    };

    var formatInitials = function(firstName, lastName) {
      if(firstName && lastName) {
        return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
      }
    };

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var formatTimeStamp = function(timeString) {

      var timeStamp = Date.parse(timeString);
      var date = new Date(timeStamp);
      var hours = date.getHours();
      var minutes = "0" + date.getMinutes();
      var formattedTime = hours + ':' + minutes.substr(-2);

      var monthName = monthNames[date.getMonth()].substr(0, 3);
      var dateString = "0" + date.getDate();
      var formattedDate = monthName + ' ' + dateString.substr(-2);

      return {
        time: formattedTime,
        date: formattedDate
      };
    };

    // automatically adjust content padding when top fixed region changes
    var adjustContentPadding = function() {
      var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
      var contentElems = document.getElementsByClassName('oj-applayout-content');
      var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

      for(var i=0; i<contentElems.length; i++) {
      if (topElem) {
        contentElems[i].style.paddingTop = topElem.offsetHeight+'px';
      }

      if (bottomElem) {
        contentElems[i].style.paddingBottom = bottomElem.clientHeight+'px';
      }
      // Add oj-complete marker class to signal that the content area can be unhidden.
      contentElems[i].classList.add('oj-complete');
      }

    };

    self.appUtilities = {
      formatAvatarColor: formatAvatarColor,
      formatInitials: formatInitials,
      formatTimeStamp: formatTimeStamp,
      adjustContentPadding: adjustContentPadding
    };
  }

  return new AppControllerViewModel();

});
