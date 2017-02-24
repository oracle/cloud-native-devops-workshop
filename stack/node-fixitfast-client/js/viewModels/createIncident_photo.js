/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'jquery', 'appController'], function(oj, $, app) {
  function createIncidentPhotoViewModel() {
    var self = this;

    self.handleAttached = function(info) {
      // retrieve img observable from newIncidentDataModel
      self.img = info.valueAccessor().params['ojRouter']['parentRouter'].currentValue().img;

      // bind photoOnChange event to input and pass img to it
      $('#upload-incident-pic').change({ imgHolder: self.img }, function(event) {
        app.photoOnChange(event);
      });
    };

    self.attachPhoto = function() {

      if(!navigator.camera) {
        return $('#upload-incident-pic').trigger('click');
      } else {
        return app.openBottomDrawer(self.img);
      }
    };

  }

  return createIncidentPhotoViewModel;

});
