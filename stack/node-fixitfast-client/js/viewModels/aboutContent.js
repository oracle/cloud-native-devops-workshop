/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['appController'], function(app) {

  function aboutContentVM(params) {
    var self = this;

    // retrieve contentId to render template
    self.contentID = params.contentID;

    self.handleBindingsApplied = function(info) {
      if (app.pendingAnimationType === 'navChild') {
        app.preDrill();
      }
    };

    self.handleTransitionCompleted = function(info) {
      // adjust content padding
      if(self.contentID !== 'aboutDemo') {
        app.appUtilities.adjustContentPadding();
      }

      if (app.pendingAnimationType === 'navChild') {
        app.postDrill();
      }

    };

  }

  return aboutContentVM;
});
