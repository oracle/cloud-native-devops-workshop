/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';
define(['ojs/ojcore', 'jquery', 'ojs/ojbutton', 'ojs/ojanimation'], function(oj, $) {
	function tourViewModel() {
		var self = this;

    self.handleTransitionCompleted = function(info) {

      // hide cordova splash screen
      if(navigator.splashscreen) {
        navigator.splashscreen.hide();
      }

      // invoke slideIn animation
      var animateOptions = { 'delay': 0, 'duration': '1s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['slideIn']($('.demo-tour-launch-action')[0], animateOptions);
    };

  }

  return tourViewModel;
});
