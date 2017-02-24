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
        'dataService',
        'ojs/ojknockout',
        'oraclemapviewer',
        'oracleelocation'], function(oj, ko, $, data) {
  function mapViewModel(params) {

    var self = this;

    self.handleTransitionCompleted = function() {
      // adjust padding for details panel
      var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];

      if (topElem) {
        $('#detailsPanel').css('padding-top', topElem.offsetHeight+'px');
      }

      // dismiss details panel when click on map
      $('#map').on('click touchstart', function() {
        $('#detailsPanel').slideUp();
      })

    }

    // retrieve location id
    self.locationId = params.locationId;

    self.locationData = ko.observable();

    // load incident location data
    function getLocationData(id) {
      data.getLocation(id).then(function(response) {
        var result = JSON.parse(response);
        self.map().incidentLocation({
          lat: result.latitude,
          lng: result.longitude
        });
      });
    }

    if(self.locationId()) {
      getLocationData(self.locationId());
    }

    self.locationId.subscribe(function(newValue) {
      if(newValue) {
        getLocationData(newValue);
      }
    });

    self.map = ko.observable({
      incidentLocation: ko.observable(),
      userLocation: ko.observable()
    });

    var browserSupportFlag;

    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
      browserSupportFlag = true;
      navigator.geolocation.getCurrentPosition(function(position) {
        self.map().userLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
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
      if (errorFlag === true) {
        oj.Logger.error("Geolocation service failed.");
      } else {
        oj.Logger.error("Browser doesn't support geolocation");
      }
    };

    ko.bindingHandlers.incidentMap = {
      init: function (element, valueAccessor, allBindingsAccessor, viewModel) {

        var mapObj = ko.utils.unwrapObservable(valueAccessor());

        mapObj._hasUserLoc = ko.observable(false);
        mapObj._hasIncidentLoc = ko.observable(false);

        /* Oracle mapViewer code start */
        var eloc = new OracleELocation();
        OM.gv.setResourcePath("https://elocation.oracle.com/mapviewer/jslib/v2.1");
        mapObj.map = new OM.Map(element, {mapviewerURL: ''}) ;
        var tileLayer = new OM.layer.OSMTileLayer("layer1");
        mapObj.map.addLayer(tileLayer);
        var markerLayer = new OM.layer.MarkerLayer("markerlayer1");
        markerLayer.setBoundingTheme(true);
        mapObj.map.addLayer(markerLayer);

        mapObj.onChangedIncidentLoc = function(newValue) {

          mapObj.incLatLng = { lon: newValue.lng, lat: newValue.lat };

          var vMarker = new OM.style.Marker({
            src: "css/images/alta_map_pin_red.png",
            width: 17,
            height: 36,
            lengthUnit: 'pixel'
          })
          var mm = new OM.MapMarker();
          markerLayer.addMapMarker(mm);
          mm.setPosition(newValue.lng, newValue.lat);
          mm.setDraggable(false);
          mm.setStyle(vMarker);
          mm.setID('incident');
          mm.on('click', function(click) {
            // prevent propagation to map
            click.evt.stopPropagation();
            $("#detailsPanel").slideToggle();
          });

          mapObj.map.init();
          return mapObj._hasIncidentLoc(true);

        };

        mapObj.onChangedUserLoc = function(newValue) {

          // Oracle mapViewer
          mapObj.userLatLng = { lon: newValue.lng, lat: newValue.lat };

          return mapObj._hasUserLoc(true);
        };

        mapObj._renderRoute = function() {

          if(!mapObj._hasUserLoc()) {
            return oj.Logger.error('User location not available.');
          }

          if(!mapObj._hasIncidentLoc()) {
            return oj.Logger.error('Incident location not available.');
          }

          // Oracle eloc
          var success = function(destinations, routes) {
            // get directions success
          };

          var error = function(code, message, input) {
            oj.Logger.error(code, message, input);
          };

          var routes = [[mapObj.userLatLng, mapObj.incLatLng]];

          var routeOptions = { routePref: 'FASTEST' };

          var mapOptions =  {
            mapview: mapObj.map,
            disableLoadingIcon: true, // otherwise there's error
            getMarkerInfoStr: function(address, index) {
              return '';
            },
            drawMarkers: false
          };

          eloc.getDirections(routes, success, error, routeOptions, mapOptions);

        };
        /* Oracle mapViewer code end */

        /**
         * To render the incident map view and directions using google maps API:
         * 1. Uncomment the Google Maps script tag in index.html
         * 2. Uncomment the markers css in themes/fif/common/_incident.scss
         * 3. Comment out the above code block of Oracle mapViewer
         * 4. Uncomment the following code for Google maps
         * 5. Uncomment the Google Maps info window in incidentTabMap.html
         */

        /* Google Maps code start */
        // if (!(typeof google === 'object' && typeof google.maps === 'object')) {
        //   return oj.Logger.error('Google Maps API not available.');
        // }

        // var mapOptions = {
        //   zoom: 8,
        //   mapTypeId: google.maps.MapTypeId.ROADMAP,
        //   mapTypeControl: false,
        //   streetViewControl: false
        // };

        // mapObj.googleMap = new google.maps.Map(element, mapOptions);

        // mapObj.onChangedIncidentLoc = function(newValue) {

        //   mapObj.incLatLng = new google.maps.LatLng(
        //     ko.utils.unwrapObservable(mapObj.incidentLocation).lat,
        //     ko.utils.unwrapObservable(mapObj.incidentLocation).lng)

        //   mapObj.googleMap.setCenter(mapObj.incLatLng)

        //   mapObj._setIncidentMarker(mapObj.incLatLng, 'Incident')
        //   return mapObj._hasIncidentLoc(true);

        // };

        // mapObj.onChangedUserLoc = function(newValue) {

        //   mapObj.userLatLng = new google.maps.LatLng(
        //     ko.utils.unwrapObservable(mapObj.userLocation).lat,
        //     ko.utils.unwrapObservable(mapObj.userLocation).lng);

        //   return mapObj._hasUserLoc(true);
        // };

        // mapObj._hasLocations = ko.computed(function() {
        //   return mapObj._hasUserLoc() && mapObj._hasIncidentLoc();
        // });

        // mapObj._hasLocations.subscribe(function(newValue) {
        //   if(newValue)
        //     mapObj._getRoute();
        // });

        // mapObj._getRoute = function() {

        //   var request = {
        //     destination: mapObj.incLatLng,
        //     origin: mapObj.userLatLng,
        //     travelMode: google.maps.TravelMode.DRIVING
        //   }

        //   var directionsService = new google.maps.DirectionsService();

        //   directionsService.route(request, function(response, status){
        //     if(status === google.maps.DirectionsStatus.OK) {
        //       self.duration(response.routes[0].legs[0].duration.text);
        //       self.distance(response.routes[0].legs[0].distance.text);

        //       mapObj.directions = response;
        //     }
        //   });

        // };

        // mapObj._renderRoute = function() {
        //   var bounds = new google.maps.LatLngBounds(mapObj.incLatLng, mapObj.userLatLng)

        //   mapObj.googleMap.fitBounds(bounds)

        //   var directionsDisplay = new google.maps.DirectionsRenderer({ map: mapObj.googleMap, suppressMarkers: true });
        //   directionsDisplay.setDirections(mapObj.directions);
        // }

        // mapObj._setIncidentMarker = function(loc, label) {

        //   var icon = {
        //     url: "css/images/alta_map_pin_red.png", // url
        //     scaledSize: new google.maps.Size(17, 36), // scaled size
        //     origin: new google.maps.Point(0, 0), // origin
        //     anchor: new google.maps.Point(8, 36) // anchor at bottom center
        //   };

        //   var marker = new google.maps.Marker({
        //     position: loc,
        //     map: mapObj.googleMap,
        //     title: label,
        //     draggable: false,
        //     icon: icon
        //   });

        //   var $marker = $("#incidentMarker");

        //   var infowindow = new google.maps.InfoWindow({
        //     content: $marker[0]
        //   });

        //   infowindow.open(mapObj.googleMap, marker);

        //   google.maps.event.addListener(infowindow, 'domready', function() {

        //     // Reference to the DIV which receives the contents of the infowindow using jQuery
        //     var iwOuter = $('.gm-style-iw');
        //     iwOuter.next().css({'height': '52px'});

        //     /* The DIV we want to change is above the .gm-style-iw DIV.
        //     * So, we use jQuery and create a iwBackground variable,
        //     * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
        //     */
        //     var iwBackground = iwOuter.prev();

        //     // Remove the background shadow DIV
        //     iwBackground.children(':nth-child(2)').css({'display' : 'none'});

        //     // Remove the white background DIV
        //     iwBackground.children(':nth-child(4)').css({'display' : 'none'});

        //     // Changes the desired tail shadow color.
        //     iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'none', 'z-index' : '1'});

        //     // Change border color
        //     iwBackground.children(':nth-child(1)').css({'border-top-color': '#eeeeee'});
        //     // Reference to the div that groups the close button elements.
        //     var iwCloseBtn = iwOuter.next();

        //     iwCloseBtn.css({display: 'none'});
        //   });
        // }
        /* Google Maps code end */

        mapObj.incidentLocation.subscribe(mapObj.onChangedIncidentLoc);
        mapObj.userLocation.subscribe(mapObj.onChangedUserLoc);

        $("#" + element.getAttribute("id")).data("mapObj", mapObj);

        $("#navigateBtn").click(function() {
          return mapObj._renderRoute();
        });
      }
    };

    self.duration = ko.observable();
    self.distance = ko.observable();

    self.showDetails = function() {
      $("#detailsPanel").slideToggle();
    };

  }

  return mapViewModel;
});
