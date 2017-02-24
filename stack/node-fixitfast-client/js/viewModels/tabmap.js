/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// Renders map view using either Oracle mapViewer or Google Maps
'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojknockout', 'oraclemapviewer'], function(oj, ko, $, app) {
  function tabmapViewModel() {

    var self = this;

    // load incidents locations
    self.handleActivated = function(params) {
      self.incidentsPromise = params.valueAccessor().params['incidentsPromise'];

      self.incidentsPromise.then(function(response) {
        var incidentsArr = JSON.parse(response).result;
        self.map().incidents(incidentsArr);
      });

      return self.incidentsPromise;
    };

    // custom bindings for map
    self.map = ko.observable({
      lat: ko.observable(),
      lng: ko.observable(),
      incidents: ko.observable()
    });

    var browserSupportFlag;

    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        self.map().lat(position.coords.latitude);
        self.map().lng(position.coords.longitude);
      }, function() {
        self._handleNoGeolocation(browserSupportFlag);
      });
    }
    // Browser doesn't support Geolocation
    else {
      browserSupportFlag = false;
      self._handleNoGeolocation(browserSupportFlag);
    }

    self._handleNoGeolocation = function(errorFlag) {
      if (errorFlag == true) {
        oj.Logger.warn("Geolocation service failed.");
      } else {
        oj.Logger.warn("Browser doesn't support geolocation");
      }
    };

  }

  ko.bindingHandlers.incidentsMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

      var mapObj = ko.utils.unwrapObservable(valueAccessor());

      /* Oracle mapViewer code start */
      OM.gv.setResourcePath("https://elocation.oracle.com/mapviewer/jslib/v2.1");
      mapObj.map = new OM.Map(element, {mapviewerURL: ''}) ;
      var tileLayer = new OM.layer.OSMTileLayer("layer1");
      mapObj.map.addLayer(tileLayer);
      var markerLayer = new OM.layer.MarkerLayer("markerlayer1");
      markerLayer.setBoundingTheme(true);
      mapObj.map.addLayer(markerLayer);

      var vMarker = new OM.style.Marker({
        src: "css/images/alta_map_pin_red.png",
        width: 17,
        height: 36,
        lengthUnit: 'pixel'
      });

      mapObj.incidents().forEach(function(incident, index){

        var mm = new OM.MapMarker();
        markerLayer.addMapMarker(mm);
        mm.setPosition(incident.location.longitude, incident.location.latitude);
        mm.setDraggable(false);
        mm.setStyle(vMarker);
        mm.setID(incident.id);
        mm.on('click', function() {
          app.goToIncident(mm.getID(), 'tabmap');
        })
      });

      markerLayer.zoomToTheme();
      mapObj.map.init();
      /* Oracle mapViewer code end */

      /** Google Maps
       * To render the incidents map view and markers using Google Maps API:
       * 1. Uncomment the Google Maps script tag in index.html
       * 1. Comment out the above code block of Oracle mapViewer
       * 2. Uncomment the following code for Goolge Maps
       */

      /* Google Maps code start */
      // if (!(typeof google === 'object' && typeof google.maps === 'object')) {
      //   oj.Logger.error('Google Maps API not available.')
      // }

      // var latLng = new google.maps.LatLng(
      //     ko.utils.unwrapObservable(mapObj.lat),
      //     ko.utils.unwrapObservable(mapObj.lng));

      // var mapOptions = {
      //   zoom: 8,
      //   mapTypeId: google.maps.MapTypeId.ROADMAP,
      //   mapTypeControl: false,
      //   streetViewControl: false
      // };

      // mapObj.googleMap = new google.maps.Map(element, mapOptions);

      // var bounds = new google.maps.LatLngBounds();

      // var icon = {
      //   url: "css/images/alta_map_pin_red.png", // url
      //   scaledSize: new google.maps.Size(17, 36), // scaled size
      //   origin: new google.maps.Point(0, 0), // origin
      //   anchor: new google.maps.Point(0, 0) // anchor
      // };

      // mapObj.incidents().forEach(function(incident){
      //   var latLng = new google.maps.LatLng(incident.location.latitude, incident.location.longitude);

      //   bounds.extend(latLng);

      //   var marker = new google.maps.Marker({
      //     position: latLng,
      //     map: mapObj.googleMap,
      //     title: "Incident",
      //     draggable: false,
      //     icon: icon
      //   });

      // })

      // mapObj.googleMap.fitBounds(bounds);

      /* Google Maps code end */

      $("#" + element.getAttribute("id")).data("mapObj",mapObj);
    }
  };

  return tabmapViewModel;
});
