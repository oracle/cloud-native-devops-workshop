/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

/**
  @class This class provides a number of convenient methods for
  accessing Oracle's eLocation Geocoding and Routing services.

  @param {String} elocURL the eLocation service base URL, which specifies the 
                  host and application context root for the eLocation service. 
                  The default value is http://elocation.oracle.com/elocation. 
  @constructor
 */
function OracleELocation(elocURL) {
  /**@private*/
  this.baseURL = null;
  if(elocURL) {
    if(elocURL.substr(elocURL.length-1,1)=='/')
      elocURL = elocURL.substr(0, elocURL.length-1) ;
    this.baseURL = elocURL;
  }
  else {
    this.baseURL = "http://elocation.oracle.com/elocation";
  }
  ELocationMarkerFactory.setImageBaseURL(this.baseURL+"/ajax/images/") ;
  
  /**@private*/
  this.routeFOIArray = new Array() ;
  
  /**@private*/
  this.messages = new Array();
  this.messages["ELOCATION-05000"]="Invalid Route ID was provided.";
  this.messages["ELOCATION-05100"]="Invalid event type argument.";
  this.messages["ELOCATION-05500"]="An error occurred while retrieving a route response from the server: ";
  
  /**@private*/
  this.throwException = function(callingMethod, exceptionCode, params) {
      var exceptionMessage = callingMethod + " - " + exceptionCode + " ";
      if (this.messages[exceptionCode]) {
          exceptionMessage += this.messages[exceptionCode];
      }
      if (params) {
          exceptionMessage += " {'"+params+"'}";
      }
      throw exceptionMessage;
  }
}
/** Geocoder Error code: Geocoder has encounted internal error. */
OracleELocation.ERROR_GEOCODE_FAILED = 0 ;
/** Router Error code: One or more input addresses can not be geocoded or the
 *  geocoded results might not be accurate. */
OracleELocation.ERROR_ROUTE_ADDR_INVALID = 1 ;
/** Router Error code: Route can not be calculated. */
OracleELocation.ERROR_ROUTE_NOT_FOUND = 2 ;
/** Router Error code: Router has encounted internal error. */
OracleELocation.ERROR_ROUTE_FAILED = 3 ;
/** eLocation Error code: eLocation returned an unexpected response. */
OracleELocation.ERROR_UNEXPECTED_SERVER_RESPONSE = 4 ;
/**@private*/
OracleELocation.mapviewer = null ;
/**@private*/
OracleELocation.routeCount = 0 ;
/**@private*/
OracleELocation.routesOnDisplay = new Array();
/**@private*/
OracleELocation.datasource = "ELOCATION";
/**@private*/
OracleELocation.singleRoute = false;
/**@private*/
OracleELocation.eloc = null;
/**@private*/
var LAT_LON_SIGNED_DMS_REGEX = /^([-+]?\s*\d{1,2})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?[,\s]\s*([-+]?\s*\d{1,3})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?$/;
/**@private*/
var LAT_LON_DMS_REGEX = /^(\d{1,2})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?\s*([nNsS])[,\s]\s*(\d{1,3})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?\s*([eEwW])$/;
/**@private*/
var LAT_LON_DECIMAL_REGEX = /^([-+]?\d{1,2}(\.\d*)?)[,\s]\s*([-+]?\d{1,3}(\.\d*)?)$/;
/**@private*/
var LON_LAT_SIGNED_DMS_REGEX = /^([-+]?\s*\d{1,3})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?[,\s]\s*([-+]?\s*\d{1,2})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?$/;
/**@private*/
var LON_LAT_DMS_REGEX = /^(\d{1,3})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?\s*([eEwW])[,\s]\s*(\d{1,2})[\.,�\s]\s*(\d{1,2})[\.,'\s]\s*(\d{1,2}(\.\d*)?)\"?\s*([nNsS])$/;
/**@private*/
var LON_LAT_DECIMAL_REGEX = /^([-+]?\d{1,3}(\.\d*)?)[,\s]\s*([-+]?\d{1,2}(\.\d*)?)$/;
/**@private*/
var ROUTE_ID_REGEX = /^[\w\. \(\)-:]*$/;
/**@private*/
var REGION_LEVEL = 6 ;
/**@private*/
var CITY_LEVEL = 11;
/**@private*/
var STREET_LEVEL = 14;

/**
  This method invokes the geocoder on eLocation to obtain the longitude/latitude
  information for a given street address. It then invokes the user defined 
  callback function and pass the geocoded result to the callback function.
  
  The input address can be either a street address or a longitude/latitude location.
  <UL>
    <LI>A street address is specified as a string that specifies the house number,
  street name, locality, postal code and etc. Examples: "500 Oracle Pkwy, Redoowd City, CA", 
  "California, CA". </LI>
    <LI>A longitude/latitude location is specified as a object that has an "lon"
  attribute that specifies the longutude value and an "lat" attribute that specifies
  the latitude value. Example: {lon:-71.45937, lat:42.70781}.</LI>
  </UL>
  
  <P>The application can also control whether to draw the geocoded address on
  the map or not and how to draw the marker by providing a map options object,
  which can have the following attributes:
  <UL>
    <LI>mapview(OM.Map): This attribute specifies the Oracle Maps client instance
        in which the marker is to be displayed. The marker will not be displayed
        on any map if this attribute is null or invalid.</LI>
    <LI>id(int): This is the id for the marker, by default, 1.</LI>
    <LI>label(String): This is the label to be assigned to the marker, by default, "A".</LI>
    <LI>marker(Object): This property serves to render the marker, providing both
        style and color. Available styles are:
        <UL>
          <LI>ELocationMarkerFactory.STYLE_SQUARE_BUBBLE</LI>
          <LI>ELocationMarkerFactory.STYLE_POINTER_BUBBLE</LI>
          <LI>ELocationMarkerFactory.STYLE_DIAGONAL_SQUARE</LI>
          <LI>ELocationMarkerFactory.STYLE_BUBBLE</LI>
          <LI>ELocationMarkerFactory.STYLE_FLAG</LI>
          <LI>ELocationMarkerFactory.STYLE_HEXAGON</LI>
          <LI>ELocationMarkerFactory.STYLE_PIN_1</LI>
          <LI>ELocationMarkerFactory.STYLE_PIN_2</LI>
          <LI>ELocationMarkerFactory.STYLE_SMALL_PIN</LI>
          <LI>ELocationMarkerFactory.STYLE_3D_CUBE</LI>
          <LI>ELocationMarkerFactory.STYLE_SIGN_1</LI>
          <LI>ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1</LI>
          <LI>ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_2</LI>
          <LI>ELocationMarkerFactory.STYLE_SIGN_2</LI>
        </UL>
        Available colors are:
        <UL>
          <LI>ELocationMarkerFactory.COLOR_RED</LI>
          <LI>ELocationMarkerFactory.COLOR_GREEN</LI>
          <LI>ELocationMarkerFactory.COLOR_BLUE</LI>
          <LI>ELocationMarkerFactory.COLOR_ORANGE</LI>
          <LI>ELocationMarkerFactory.COLOR_PURPLE</LI>
        </UL>
        By default, this is the Object used to render the marker:<br/>
        mapOptions.marker = {style:ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_GREEN} ;
        </LI>
    <LI>infoWindowStyle(String): This property is used to select the window style
        to show whenever a marker created by eLocation is clicked on the map.
        Available styles are:
        <UL>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_1</LI>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_2</LI>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_3</LI>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_4</LI>
        </UL>
        By default, ELocationMarkerFactory.WINDOW_STYLE_4 will be used.
        </LI>
  </UL></P>
  
  The result is an array of address objects. The array will contain only one address
  object if only one match is found. It will contain multiple address objects 
  if multiple matches are found. Each geocode address object has the following 
  attributes. 
  <UL>
    <LI>x : The x (longitude) coordinate of the result location.</LI>
    <LI>y : The y (latitude) coordinate of the result location.</LI>
    <LI>houseNumber : Address street house number</LI>
    <LI>street : Street</LI>
    <LI>settlement : City</LI>
    <LI>municipality: Municipality</LI>
    <LI>region : Region(state, province, etc.)</LI>
    <LI>postalCode: Postal code</LI>
    <LI>country: Country</LI>
    <LI>matchVector: Match vector that tells how each address field is matched.
        Please refer to Oracle Spatial Developer's guide for more information.</LI>
    <LI>matchCode: Match code, a number indicating which input address attributes matched the data used for geocoding. The following table lists the possible match code values.
      <TABLE width="100%" rules="groups" frame="hsides" cellspacing="0" cellpadding="3" border="1" dir="ltr" summary="Match Codes for Geocoding Operations" title="Match Codes for Geocoding Operations" class="Formal">
      <COL width="9%"/>
      <COL width="*"/>
      <THEAD>
      <TR valign="top" align="left">
      <TH valign="bottom" align="left" id="r1c1-t4">Match Code</TH>
      <TH valign="bottom" align="left" id="r1c2-t4">Description</TH>
      </TR>
      </THEAD>
      <TBODY>
      <TR valign="top" align="left">
      <TD align="left" headers="r1c1-t4" id="r2c1-t4">
      <P>1</P>
      </TD>
      <TD align="left" headers="r2c1-t4 r1c2-t4">
      <P>Exact match: the city name, postal code, street base name, street type (and suffix or prefix or both, if applicable), and house or building number match the data used for geocoding.</P>
      </TD>
      </TR>
      <TR valign="top" align="left">
      <TD align="left" headers="r1c1-t4" id="r3c1-t4">
      <P>2</P>
      </TD>
      <TD align="left" headers="r3c1-t4 r1c2-t4">
      <P>The city name, postal code, street base name, and house or building number match the data used for geocoding, but the street type, suffix, or prefix does not match.</P>
      </TD>
      </TR>
      <TR valign="top" align="left">
      <TD align="left" headers="r1c1-t4" id="r4c1-t4">
      <P>3</P>
      </TD>
      <TD align="left" headers="r4c1-t4 r1c2-t4">
      <P>The city name, postal code, and street base name match the data used for geocoding, but the house or building number does not match.</P>
      </TD>
      </TR>
      <TR valign="top" align="left">
      <TD align="left" headers="r1c1-t4" id="r5c1-t4">
      <P>4</P>
      </TD>
      <TD align="left" headers="r5c1-t4 r1c2-t4">
      <P>The city name and postal code match the data used for geocoding, but the street address does not match.</P>
      </TD>
      </TR>
      <TR valign="top" align="left">
      <TD align="left" headers="r1c1-t4" id="r6c1-t4">
      <P>10</P>
      </TD>
      <TD align="left" headers="r6c1-t4 r1c2-t4">
      <P>The city name matches the data used for geocoding, but the postal code does not match.</P>
      </TD>
      </TR>
      <TR valign="top" align="left">
      <TD align="left" headers="r1c1-t4" id="r7c1-t4">
      <P>11</P>
      </TD>
      <TD align="left" headers="r7c1-t4 r1c2-t4">
      <P>The postal code matches the data used for geocoding, but the city name does not match.</P>
      </TD>
      </TR>
      </TBODY>
      </TABLE>
    </LI>
    <LI>accuracy: Result accuracy, a number indicating the accuracy level of the geocoding result. 
       Unlike match code, the accuracy level does not indicate how well the result matches the 
       input address. Instead it describes the level of details the result has, e.g, 
       whether the result is a house number level address, street level address or city level address. 
       The following table lists the possible accuracy values.
      <TABLE width="100%" rules="groups" frame="hsides" cellspacing="0" cellpadding="3" border="1" dir="ltr" summary="Geocoder result accuracy" class="Formal">
        <COL width="9%"/>
        <COL width="*"/>
        <THEAD>
        <TR valign="top" align="left">
        <TH valign="bottom" align="left" id="r1c1-t4">Accuracy</TH>
        <TH valign="bottom" align="left" id="r1c2-t4">Description</TH>
        </TR>
        </THEAD>
        <TBODY>
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>-1</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result is empty.</P>
        </TD>
        </TR>
  
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>1</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result has house number level details.</P>
        </TD>
        </TR>
  
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>2</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result has street level details.</P>
        </TD>
        </TR>
  
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>3</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result has city level details.</P>
        </TD>
        </TR>
  
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>4</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result has municipality level details.</P>
        </TD>
        </TR>
  
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>5</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result has region level details.</P>
        </TD>
        </TR>
  
        <TR valign="top" align="left">
        <TD align="left" headers="r1c1-t4" id="r2c1-t4">
        <P>6</P>
        </TD>
        <TD align="left" headers="r2c1-t4 r1c2-t4">
        <P>The result has country level details.</P>
        </TD>
        </TR>
        </TBODY>
      </TABLE>
    </LI>
  </UL>
  
  @param {Object} address the street address or the longitude/latitude location 
  to be located.
  
  @param {Function} callBack is a user specified function that is invoked when
  the input address is geocoded. It should declare two parameters, one is an
  address object that contains the geocoded result and the second one is the
  input address received. 
  
  @param {Function} errHandler A user specified function that is invoked when
  error happens during geocoding. Three parameters are passed to this 
  function when being invoked: error code, error message and the input address(es).
  
  @param {Object} mapOptions mapping options in case we want a geocoded address
  to be displayed on the map
 */
OracleELocation.prototype.geocode = function(address, callBack, errHandler, mapOptions) {
  if(!callBack) {
    alert("A callback function must be provided when invoking OracleELocation.geocode()!") ;
  }
  
  OracleELocation.eloc = this;
  
  //Convert address to lat/lon if needed.
  address = checkLatLon(address);
  
  if (!mapOptions) {
    mapOptions = new Object();
  }
  mapOptions.baseURL = OracleELocation.eloc.baseURL;
  
  if (!address.lon && !address.street) {
      var lines = address.split(",") ;
      if (OracleELocation.strTrim(lines[lines.length-1]).toUpperCase() == 'VA') {
          //add US to request
          OracleELocation.eloc.geocodeForUS(address, callBack, errHandler, mapOptions, OracleELocation.eloc.regularGeocode);
      }
      else {
          //Regular geocode
          OracleELocation.eloc.regularGeocode(address, callBack, errHandler, mapOptions);
      }
  }
  else {
    //Regular geocode
    OracleELocation.eloc.regularGeocode(address, callBack, errHandler, mapOptions);
  }
}
/**@private*/
OracleELocation.prototype.geocodeForUS = function(address, callBack, errHandler, mapOptions, geocodeFunc) {
  var xmlRequest = OracleELocation.eloc.getGeocodeRequest(address, true);
  
    $.ajax( {
        url : mapOptions.baseURL + "/lbs",
        data : "xml_request=" + encodeURIComponent(xmlRequest) + "&format=JSON",
        dataType : "jsonp",
        type : "POST",
        success : function (result) {
            if ((!result || result.length == 0 || !result[0].accuracy || (result[0].postalCode == "" && result[0].municipality == ""))) {
                //Try normal approach
                geocodeFunc(address, callBack, errHandler, mapOptions);
            }
            else {
                if (result && result.length == 1 && !result[0].accuracy)
                    result[0].accuracy =  - 1;
                for (var i = 0;i < result.length;i++) {
                    var addr = result[i];
                    addr.streetLine = OracleELocation.eloc.getStreetLine(addr);
                    addr.localityLine = OracleELocation.eloc.getLocalityLine(addr);
                }
                OracleELocation.eloc.initGeocodeParams(mapOptions);
                if (mapOptions && mapOptions.mapview) {
                    //draw marker
                    var matchLevel = REGION_LEVEL;
                    if (result.length == 1 && result[0].accuracy >  - 1) {
                        var addrObj = result[0];
                        if (addrObj.street && OracleELocation.eloc.trim(addrObj.street).length != 0) {
                            matchLevel = STREET_LEVEL;
                        }
                        else if (addrObj.settlement && addrObj.settlement.length > 0) {
                            matchLevel = CITY_LEVEL;
                        }

                        var loc = new OM.geometry.Point(addrObj.x, addrObj.y, 8307);
                        mapOptions.mapview.setCenterAndZoomLevel(loc, matchLevel);
                        OracleELocation.eloc.removeSingleRouteFOI(mapOptions.mapview, 'addressFOI' + mapOptions.id);
                        var markerId = "addressFOI" + mapOptions.id;
                        var marker = OracleELocation.eloc.createRouteMarker(addrObj, markerId, mapOptions.marker.style, mapOptions.marker.color, mapOptions.id, mapOptions);
                        marker.htmlStr = OracleELocation.eloc.getMarkerInfoStr(addrObj, mapOptions, 0);
                        marker.infoWindowStyle=mapOptions.infoWindowStyle;
                        marker.addListener(OM.event.MouseEvent.MOUSE_CLICK, function (evt) {
                            mapOptions.mapview.closeInfoWindows();
                            mapOptions.mapview.displayInfoWindow(mapOptions.mapview.getCursorLocation(), evt.target.htmlStr, OracleELocation.eloc.getInfoWindowParams(evt.target.infoWindowStyle, null, markerId));
                        });
                    }
                }

                if (callBack != null) {
                    callBack(result, address);
                }
            }

        },
        error: function(request, status, error) {
            if(errHandler) {
            errHandler(OracleELocation.ERROR_GEOCODE_FAILED, error, address) ;
          }
          else
            alert("OracleElocation.geocode has encountered error. \n" + error) ;
          return ;
        }
    });
  return null;
}

function getXMLHttpRequest() {
    var xmlHttp;
    if (window.ActiveXObject) {
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    else if (window.XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    return xmlHttp;
}

/**@private*/
OracleELocation.prototype.regularGeocode = function(address, callBack, errHandler, mapOptions) {
  xmlRequest = OracleELocation.eloc.getGeocodeRequest(address, false);
  
  $.ajax({
    url:mapOptions.baseURL+"/lbs",
    data:"xml_request="+encodeURIComponent(xmlRequest)+"&format=JSON",
    dataType:"jsonp",
    type:"POST",
    success:function(result) {
            if (result && result.length == 1 && !result[0].accuracy) {
                result[0].accuracy =  - 1;
            }
            for (var i = 0;i < result.length;i++) {
                var addr = result[i];
                addr.streetLine = OracleELocation.eloc.getStreetLine(addr);
                addr.localityLine = OracleELocation.eloc.getLocalityLine(addr);
            }
            OracleELocation.eloc.initGeocodeParams(mapOptions);
            if (mapOptions && mapOptions.mapview) {
                //draw marker
                var matchLevel = REGION_LEVEL;
                if (result.length == 1 && result[0].accuracy >  - 1) {
                    var addrObj = result[0];
                    if (addrObj.street && OracleELocation.eloc.trim(addrObj.street).length != 0) {
                        matchLevel = STREET_LEVEL;
                    }
                    else if (addrObj.settlement && addrObj.settlement.length > 0) {
                        matchLevel = CITY_LEVEL;
                    }

                    var loc = new OM.geometry.Point(addrObj.x, addrObj.y, 8307);
                    mapOptions.mapview.setMapZoomLevel(matchLevel);
                    mapOptions.mapview.setMapCenter(loc);

                    OracleELocation.eloc.removeSingleRouteFOI(mapOptions.mapview, 'addressFOI' + mapOptions.id);
                    var markerId = "addressFOI" + mapOptions.id;
                    var marker = OracleELocation.eloc.createRouteMarker(addrObj, markerId, mapOptions.marker.style, mapOptions.marker.color, mapOptions.id, mapOptions);
                    marker.htmlStr = OracleELocation.eloc.getMarkerInfoStr(addrObj, mapOptions, 0);
                    marker.infoWindowStyle=mapOptions.infoWindowStyle;
                    marker.addListener(OM.event.MouseEvent.MOUSE_CLICK, function (evt) {
                        mapOptions.mapview.closeInfoWindows();
                        mapOptions.mapview.displayInfoWindow(mapOptions.mapview.getCursorLocation(), evt.target.htmlStr, OracleELocation.eloc.getInfoWindowParams(evt.target.infoWindowStyle, null, markerId));
                    });
                }
            }

            if (callBack != null) {
                callBack(result, address);
            }
    },
    error: function(request, status, error) {
        if(errHandler) {
              errHandler(OracleELocation.ERROR_GEOCODE_FAILED, content, address) ;
            }
        else {
            alert("OracleElocation.geocode has encountered error. \n" + content) ;
        }
        return ;
    }
  });
    return null;
}

/**@private*/
OracleELocation.prototype.getGeocodeRequest = function(address, addCountry) {
  var xmlRequest = 
    "<?xml version='1.0' standalone='yes'?>" +
    "<geocode_request client='eLocationAPI'>" +
    "<address_list>" ;
  if(address.lon != undefined && address.lat != undefined) {// reverse geocoding? 
    var country = "" ;
    if(address.country)
      country = "country='" + this.escapeApostrophe(address.country) + "'" ;
    xmlRequest +=
      "<input_location id='1' " + country + " longitude='"+address.lon + "' latitude='"+address.lat+"'/>" ;
  }
  else if (address.street != undefined && address.city != undefined && address.state != undefined) {
      xmlRequest += "<input_location id='1'>"+
                    "<input_address match_mode='relax_postal_code'>";
      xmlRequest += "<us_form2 street='" + this.escapeApostrophe(address.street) +
                    "' city='" + this.escapeApostrophe(address.city) +
                    "' state='" + this.escapeApostrophe(address.state) + "'/>"
      xmlRequest += "</input_address>"+
                    "</input_location>" ;
  }
  else {
    var lines = address.split(",") ;
    
    xmlRequest +=
      "<input_location id='1'>"+
      "<input_address match_mode='relax_postal_code'>"+
      "<unformatted>" ;
                   
    for(var i=0; i<lines.length; i++) {
      xmlRequest += "<address_line value ='"+this.escapeApostrophe(lines[i])+"'/>" ;
    }
    if (addCountry) {
        xmlRequest += "<address_line value ='US'/>" ;
    }
      
    xmlRequest += "</unformatted>"+
                  "</input_address>"+
                  "</input_location>" ;
  }
  xmlRequest +=
    "</address_list>" + 
    "</geocode_request>" ;
  return xmlRequest;
}

/**
  <P>This method invokes the eLocation routing engine to caculate route and/or 
  driving directions between destinations. It then invokes the user defined 
  callBack function and passes the routing result to the callBack function. 
  When required, it can also show the route on a map displayed by the Oracle 
  Maps client if such map already exists on the same web page where this method
  is invoked.</P>

  <P>The input destinations are specified as an array of routes. Each route is in
  fact another array that holds input addresses. Each input
  address can be either a street address or a longitude/latitude location as 
  explained in {@link #geocode}.<br/>
  For backwards compatibility purposes, input addresses can also be represented as
  a single array of addresses, each of them being a street address or a
  longitude/latitude location. When this is the case, a few aspects of the route
  drawing behave as they did in previous versions of these APIs:
    <UL>
      <LI>Actual route coordinates are returned as part of the route calculation
      (opposed to current behavior which draws routes as a PNG images). Each route
      is an MVFOI object representing a line that is built up with a collection of
      longitude/latitude points.</LI>
      <LI>All calls to {@link #getDirections} cause the previous information on
      the map to be removed prior to calculating the new route request. This is
      due to the route and stop-point naming convention, since in previous APIs
      only one route was drawn at a time.</LI>
    </UL>
  </P>
  
  <P>Once the routing calculation is finished, the callback function is invoked and
  two parameters are passed to it. The first parameter is the geocoded 
  destinations. It's an array of routes. Each route array element specifies the
  geocoded result of one destination. The geocoded result is the same as that
  returned by {@link #geocode}. The second parameter is the routing result.
  It's an array of routes. Each array element is an object that specifies the
  routing result for that particular route. The routing result object has the 
  following attributes:
  <UL>
   <LI>id : The serial ID of the route.</LI>
   <LI>stepCnt : The number of driving direction steps.</LI>
   <LI>dist: Total distance of the route</LI>
   <LI>distUnit: Distance unit</LI>
   <LI>time: Total estimated driving time.</LI>
   <LI>timeUnit: Time unit.</LI>
   <LI>routeMBR : The bounding box coordinates for this route (upper left and bottom right coordinates).</LI>
   <LI>subroutes: The subroute array, each of them with specific route information:
       <UL>
         <LI>id : The serial ID of the subroute.</LI>
         <LI>stepCnt : The number of driving direction steps.</LI>
         <LI>dist: Total distance for this route segment</LI>
         <LI>distUnit: Distance unit</LI>
         <LI>time: Total estimated driving time for this route segment.</LI>
         <LI>timeUnit: Time unit.</LI>
         <LI>routeMBR : The bounding box coordinates for this subroute (upper left and bottom right coordinates).</LI>
         <LI>steps: The driving direction steps. It's an array of step objects, each
             of which specifies one driving direction sequence and has the following 
             attributes:
            <UL>
              <LI>seq: The sequence number.</LI>
              <LI>inst: The driving instruction.</LI>
              <LI>dist: The distance of this sequence.</LI>
              <LI>time: The estimated time of this sequence.</LI>
            </UL>
         </LI>
       </UL>
   </LI>
   <LI>steps: The driving direction steps. If route is a two-destination route
       (meaning no stop-points were involved) then this array is provided, each
       object specifies one driving direction sequence and has the following 
       attributes:
       <UL>
         <LI>seq: The sequence number.</LI>
         <LI>inst: The driving instruction.</LI>
         <LI>dist: The distance of this sequcence.</LI>
         <LI>time: The estimated time of this sequcence.</LI>
       </UL>
   </LI>
  </UL></P>

  <P>The application must provide an error handling function when invoking this method.
  It will be called when an error happens during the routing calculation. Most
  errors are caused by invalid destination addresses, which the application might
  want to deal with. For example, the application might ask the user to correct 
  the addresses before recalculating the driving directions. When being invoked, 
  the following five parameters are passed to the error handling function.
  <UL>
    <LI>The error code.</LI>
    <LI>The error message.</LI>
    <LI>The address(es) that has(have) caused the error.
        <UL>
          <LI>If the error code is OracleELocation.ERROR_GEOCODE_FAILED, 
          the value of this parameter is the input address that has caused the
          error.</LI>
          <LI>If the error code is OracleELocation.ERROR_ROUTE_ADDR_INVALID,
          the value of this parameter is an array of geocoded destination
          addresses. Each array element specifies the geocoded result of one
          destination route, which is the same as the result passed to the
          {@link #geocode} callback function.</LI>
          <LI>If the error code is OracleELocation.ERROR_ROUTE_NOT_FOUND or 
          OracleELocation.ERROR_ROUTE_FAILED, the value of this parameter is an
          array of geocoded addresses, the start, end and stop-point addresses,
          for all routes requested.</LI>
        </UL>
    </LI>
    <LI>The route number</LI>
    <LI>The address index within the route array</LI>
    <LI>Array of error messages (for batch requests), where each element in the
    array has 3 attributes: id (based on their position index in the input route
    array), errorMessage (reason why the route failed to be processed) and
    invalidAddresses (array with the index of all the invalid input addresses
    that failed to be geocoded; this attribute may not be present if the route
    failed for a reason other than error at the geocode level).</LI>
  </UL></P>

  <P>The application can customize how the driving directions are calculated and
  how the results are returned by providing a route option object, which can
  have the following attributes:
  <UL>
    <LI>routePref(String): Whether you want the route with the lowest estimated 
        driving time (FASTEST) or the route with the shortest driving distance 
        (SHORTEST, the default).</LI>
    <LI>roadPref(String): Whether you want the route to use highways (HIGHWAY, 
        the default) or local roads (LOCAL) when a choice is available.</LI>
    <LI>directions(boolean): Whether to return turn-by-turn driving directions. 
        Default is true.</LI>
    <LI>distUnit(String): The unit of measure for distance values that are 
        returned: KM for kilometer, MILE (the default) for mile, or METER for 
        meter.</LI>
    <LI>timeUnit(String): The unit for time values that are returned: HOUR for 
        hour, MINUTE (the default) for minute, or SECOND for second.</LI>
    <LI>langPref (String): The language preference. By default English is used.
        Valid options are:
        <UL>
            <LI>English</LI>
            <LI>Spanish</LI>
            <LI>French</LI>
            <LI>German</LI>
            <LI>Italian</LI>
        </UL></LI>
    <LI>addrIsValid(Function): By default, this method uses its own address 
        validation module to check whether the input addresses are valid. If
        any of them is not valid, it stops route calculation and invokes the 
        application provided error handler 
        function so that the application can deal with the invalid address(es). 
        You can customize how input address validation is performed by providing
        your own address validation function with this attribute. The address
        validation function takes a geocoded address object as the only
        input. It checks the geocoded address, returns true if the address
        is valid and returns false if the address is invalid.</LI>
    <LI>ignoreGeocodeErrorsForBatchRequests(boolean): Whether to bypass geocode
        errors on batch route requests and continue processing all the routes
        requested or not. By default this property is set to false, returning
        to the client when errors are present while geocoding the input
        addresses.</LI>
    <LI>vehicleType(String): TRUCK for a route where special constraints need to be
        taken in account while calculating the driving directions, such as weight,
        length, height, etc.  AUTO (default) for a route where a regular car
        is the driven vehicle. If TRUCK is selected, then the following parameters
        could also be specified for the route calculation:
        <UL>
            <LI>truckType(String): What kind of truck is being driven. Valid
            options are: DELIVERY, PUBLIC, RESIDENT, TRAILER. There is no default
            value for this option.</LI>
            <LI>lengthUnit(String): The unit to measure length. Valid options are
            US (default) for feet or METRIC for meters.</LI>
            <LI>weightUnit(String): The unit to measure weight. Valid options are
            US (default) for tons or METRIC for metric tons.</LI>
            <LI>truckHeight(float): The truck's height.</LI>
            <LI>truckLength(float): The truck's length.</LI>
            <LI>truckWidth(float): The truck's width.</LI>
            <LI>truckWeight(float): The truck's weight.</LI>
            <LI>truckAxleWeight(float): The truck's weight per axle.</LI>
        </UL></LI>
  </UL></P>

  <P>The application can also control whether to draw the route on the map and
  how to draw the route by providing a map option object, which can
  have the following attributes:
  <UL>
    <LI>mapview(OM.Map): This attribute specifies the Oracle Maps client instance
        in which the route is to be displayed. The route will not be displayed
        on any map if this attribute is null or invalid.</LI>
    <LI>resultPanel(DOM node): This attribute specifies where the driving directions
        are displayed on the application web page. It should be a HTML DOM node
        that has been allocated on the application page. You can customize
        the look of the driving direction result by applying the following 
        custom CSS styles.
        <UL>
          <LI>table.eloc_direction_table: The overall style of the HTML table 
          that shows the step by step driving directions.
          </LI>
          <LI>th.eloc_direction_header: The style of the direction header.</LI>
          <LI>td.eloc_direction_instruction: The style of the direction instruction entries in the direction table.</LI>
          <LI>td.eloc_direction_stop: The style of the destination entries in the direction table.</LI>
          <LI>div.eloc_direction_summary: The style of direction summary at the top.</LI>
        </UL>
    </LI>
    <LI>zoomToFit(boolean): This attribute specifies whether to zoom and recenter the map
        so that the route is centered in and fits the size of the map.</LI>
    <LI>disableLoadingIcon(boolean): This parameter indicates whether to disable
        the map loading icon while processing the route requests or to display it
        (by default the loading icon is displayed)</LI>
    <LI>routeNamingIDs (Array): This is a collection of route IDs to be assigned
        to routes on the map. Each element in this object is a list of IDs.
        Each list of IDs is expected to contain just one route ID for A to B routes
        (single-segment-route). For multi-stop routes (A to B to C... to n), the
        number of required IDs is n, (where n is the number of stop-points within
        the route), starting with a route ID for the whole route (A through n)
        and followed by n-1 route segment IDs. When this property is not set, or
        when the number of IDs provided does not match the expected number of IDs,
        then default route IDs are generated, for example:
        <UL>
            <LI>route1</LI>
            <LI>route3sub2</LI>
            <LI>route8sub4</LI>
            <LI>route2</LI>
        </UL>
    <LI>routeStyles (Array): Rendering options to display routes on screen. Each
        element in the array is a style or array of styles (for multi-stop routes). A
        batch route request requires a Route Style for each route/route segment. Default
        values are used if the number of styles provided is less than the total
        routes requested or the style provided is null. If a single style is provided
        for a multi-stop route request, all segments within that route will share
        the same style. Each style have the following information:
        <UL>
            <LI>render_style (Object): Details to render a route on the map. There are three
            supported style formats: one for predefined and two for dynamic styles. For predefined styles,
            only the name and datasource of the style (which resides in the database) are required.
            If no datasource is provided, a default value of "ELOCATION" is used. Once a datasource
            is provided, subsecuent calls to getDirections() or changeRouteStyle()
            will use the last value provided if ommited in new calls:
            <UL>
                <LI>name (String): The name of the pre-defined style (e.g. "L.AH3C_GB").</LI>
                <LI>datasource (String): The datasource of the pre-defined style (e.g. "MVDEMO").</LI>
            </UL>
            For dynamic styles, our first variation requires a name and an OM.style.Line object:
            <UL>
                <LI>name (String): The name of the style that matches the style object below.</LI>
                <LI>styleObj (OM.style.Line): Dynamic style object to draw the route.</LI>
            </UL>
            For our second dynamic styles variation, three properties are expected:
            <UL>
                <LI>color (String): RGB code to identify this route in the form:
                "#112233" with value range from 00 to ff.</LI>
                <LI>opacity (float): Color opacity, value between 0 and 1 (e.g. 0.5).</LI>
                <LI>width (int): Route brush width in pixels (e.g. 7).</LI>
            </UL>
        </LI>
            <LI>typeName (String): The route type. By default "Customer".</LI>
            <LI>label (String): The label (infoTip) we want to assign to a given
            route. Default is "{time}. {distance}.", which are substituted by their
            actual time and distance value (e.g. "5 min. 4.9 mi.")</LI>
        </UL>
    </LI>
    <LI>drawMarkers(boolean): This attribute specifies whether the route destinations
        are to be drawn on the map along with the route geometries. The markers
        are drawn by default.</LI>
    <LI>startMarker(Object): This attribute specifies the style and color of 
        the marker that represents the route start point. You can choose any
        combination of builtin style and color from {@link ELocationMarkerFactory}. It's 
        specified as a object that has two attributes, "style" and "color".
        The default startMarker value is {style: ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_GREEN}. </LI>
    <LI>endMarker(Object): This attribute specifies the style and color of 
        the marker that represents the route end point. You can choose any
        combination of builtin style and color from {@link ELocationMarkerFactory}. It's 
        specified as a object that has two attributes, "style" and "color".
        The default startMarker value is {style: ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_RED}. </LI>
    <LI>stopMarker(Object): This attribute specifies the style and color of 
        the marker that represents any route destination other than the start and 
        end points. You can choose any
        combination of builtin style and color from {@link ELocationMarkerFactory}. It's 
        specified as a object that has two attributes, "style" and "color".
        The default startMarker value is {style: ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_BLUE}. </LI>
    <LI>getMarkerInfoStr(Function): By default, an info window showing the
        address is displayed when the marker that represents a route destination
        is clicked on the map. You can customize the info window content by
        providing a custom function with this attribute. This function takes
        two parameters, the address object and the index number of the 
        clicked destination in the input destination array, starting from 0. It 
        returns the info window content as a HTML content string.</LI>
    <LI>removePreviousRoutes(boolean): Whether to remove previous routes displayed
        on the map or not. By default routes are preserved until user calls
        explicitly {@link #removeRoutesFromMap} or sets this property to true on
        future routing calls.</LI>
    <LI>markerStyle(String): This property serves to override start, stop and
        end markers (both style and color). When setting this property to
        "letterSequence", letters instead of numbers are used for each stop-point
        FOI. Colors of the markers go through 5 different colors in a loop: Green-> 
        Orange-> Purple-> Red-> Blue-> Green->...</LI>
    <LI>infoWindowStyle(String): This property is used to select the window style
        to show whenever a marker created by eLocation is clicked on the map.
        Available styles are:
        <UL>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_1</LI>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_2</LI>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_3</LI>
          <LI>ELocationMarkerFactory.WINDOW_STYLE_4</LI>
        </UL>
        By default, ELocationMarkerFactory.WINDOW_STYLE_4 will be used.
        </LI>
  </UL></P>
 
  <P>Alternatively, the application can have total control over where and how the 
  route is displayed by doing it in the callback function that is called after 
  the route is calculated. In this case, you should set the map option object to
  null.</P>

  @param {Array} routes an array of destination addresses.
  @param {Function} callBack A user specified function that is invoked when
  the routing results are returned. 
  @param {Function} errHandler A user specified function that is invoked when
  error happens during route calculation.
  @param {Object} routeOptions An object that specifies how the routes should be
  calculated. 
  @param {Object} mapOptions An object that specifies how the routes should be
  displayed on the map.
 */
OracleELocation.prototype.getDirections = function(routes, callBack, errHandler, 
                                                   routeOptions, mapOptions) {
  if(!errHandler) {
    alert("errHandler can not be null!") ;
    return ;
  }
  if(!routeOptions) {
    routeOptions = new Object();
  }
  if(!mapOptions) {
    mapOptions = new Object();
  }
    
  this.initParams(routeOptions, mapOptions);
  
  if (mapOptions.mapview && !mapOptions.disableLoadingIcon) {
      mapOptions.mapview.showLoadingIcon(true);
      errHandler.mapview = mapOptions.mapview;
  }
  
  routes = this.initRoutes(routes);
  //If input routes is in the form of Old API (Array of addresses), route geometries
  //are returned and old marker naming is used. Previous information on the map
  //is removed.
  if (this.singleRoute) {
      mapOptions.removePreviousRoutes = true;
  }
  
  //Route IDs and draw styles are initialized
  this.initIDsAndStyles(routes, mapOptions);
    
  var gcResult = new Array();
  var gcResultCount = 0;
  var gcTotalCount = 0;
  OracleELocation.eloc = this;
  for (var routeCount=0; routeCount<routes.length; routeCount++) {
    var dests = routes[routeCount];
    gcTotalCount += dests.length;
  }
  for (var routeCount=0; routeCount<routes.length; routeCount++) {
    var dests = routes[routeCount];
    gcResult[routeCount] = new Array();
    for(var i=0; i<dests.length; i++) {
      dests[i] = checkLatLon(dests[i]);
      var processGeocodedResult = 
        function(addr, input) {
          for (var routeNumber = 0; routeNumber < routes.length; routeNumber++) {
            var destinations = routes[routeNumber];
            for(var destNumber=0; destNumber<destinations.length; destNumber++) {
              if(destinations[destNumber] == input) {
                if (gcResult[routeNumber][destNumber] == undefined) {
                  gcResult[routeNumber][destNumber] = addr ;
                }
              }
            }
          }
          gcResultCount++;
          if(gcResultCount==gcTotalCount) {
            var gcAddresses = new Array();
            for(var k=0; k<gcResult.length; k++) {
              gcAddresses[k] = new Array();
              for (var addressCount = 0; addressCount < gcResult[k].length; addressCount++) {
                var addrInvalidate = false ;
                if(gcResult[k][addressCount]==null || gcResult[k][addressCount].length!=1) {// multiple match
                  addrInvalidate = true ;
                }
                else if(gcResult[k][addressCount][0].accuracy<1) {
                  addrInvalidate = true ;
                }
                else if(routeOptions.addrIsValid) {// use custom gc result validation function?
                  if(!routeOptions.addrIsValid(gcResult[k][addressCount][0])) {
                    addrInvalidate = true ;
                  }
                }
                else if(!OracleELocation.gcResultIsValid(gcResult[k][addressCount][0])) {
                  addrInvalidate = true ;
                }
                //Compare if address is invalid
                if(addrInvalidate) {
                  if (routeOptions.ignoreGeocodeErrorsForBatchRequests) {
                      gcAddresses[k][addressCount] = gcResult[k][addressCount][0];
                      gcAddresses[k][addressCount].errCode = OracleELocation.ERROR_ROUTE_ADDR_INVALID;
                  }
                  else {
                      errHandler(OracleELocation.ERROR_ROUTE_ADDR_INVALID,
                          "One or more input address(es) are not valid!",
                          gcResult, k, addressCount) ;
                      if (errHandler.mapview) {
                          errHandler.mapview.showLoadingIcon(false);
                      }
                      return ;
                  }
                }
                else {
                    gcAddresses[k][addressCount] = gcResult[k][addressCount][0];
                }
              }
            }
            OracleELocation.eloc.calRoutes(gcAddresses, callBack, errHandler, routeOptions, mapOptions) ;
          }
        } ;
      if(dests[i].edgeId != undefined && dests[i].edgeId) {// address already geocoded?
        var addressArray = new Array();
        addressArray[0] = dests[i];
        processGeocodedResult(addressArray, dests[i]) ;
      }
      else {
        this.geocode(dests[i],
        function(addr, input){processGeocodedResult(addr, input);},
        function(error, msg, result){errHandler(error, msg, result, routeCount, i);}) ;
      }
    }//dests
  }//routes
}
/**
 * Removes routes drawn on the map. By default, routes displayed on the map remain
 * there until an explicit call to this method is performed.
 * @param {Array} routeArray Array with all the route IDs to be removed. If route
 * array is empty or null then all routes on the map are removed.
 * @since 2.0
 */
OracleELocation.prototype.removeRoutesFromMap = function(routeArray) {
  if (OracleELocation.mapviewer) {
    var params = new Object();
    params.mapview = OracleELocation.mapviewer;
    this.removeRoutes(routeArray, params);
  }
}

/**
 * Sets specific infoTip on drawn routes
 * @param {String} foiId The id for the route feature to attach the infoTip
 * @param {String} infoTipTxt The text to display as infoTip on mouse over
 * @since 2.0
 */
OracleELocation.prototype.setInfoTip = function(featureId, infoTipTxt) {
    if (OracleELocation.mapviewer) {
        var routeFeature = this.getLocalLayer(OracleELocation.mapviewer).getFeature(featureId);
        if (routeFeature) {
            routeFeature.setLabel(infoTipTxt);
        }
    }
}

/**
 *  <P>Updates the draw color/style for already drawn routes on the map. This
    function takes an array of styles as parameter, one for each desired route:<br/>
    
    routeStyles (Array): Rendering options to re-draw routes on screen. Each
    element in the array holds two values:
    <UL>
        <LI>
            routeId (String): The route id to change the style (e.g. route1, route4sub2, route9...)
        </LI>
        <LI>
            render_style (Object): Details to render a route on the map. There are three
            supported style formats: one for predefined and two for dynamic styles. For predefined styles,
            only the name and datasource of the style (which resides in the database) are required.
            If no datasource is provided, a default value of "ELOCATION" is used. Once a datasource
            is provided, subsecuent calls to changeRouteStyle() or getDirections()
            will use the last value provided if ommited in new calls:
            <UL>
                <LI>name (String): The name of the pre-defined style (e.g. L.AH3C_GB).</LI>
                <LI>datasource (String): The datasource of the pre-defined style (e.g. "MVDEMO").</LI>
            </UL>
            For dynamic styles, the first variation requires an OM.style.Line object:
            <UL>
                <LI>styleObj (OM.style.Line): Dynamic style object to draw the route.</LI>
            </UL>
            For the second dynamic styles variation, three properties are expected:
            <UL>
                <LI>color (String): RGB code to identify this route in the form:
                "#11ff33" with value range from 00 to ff.</LI>
                <LI>opacity (float): Color opacity, value between 0 and 1 (e.g. 0.5).</LI>
                <LI>width (int): Route brush width in pixels (e.g. 7).</LI>
            </UL>
        </LI>
    </UL></P>
 * 
 * @param {Array} routeStyles Array of styles to apply to current routes on the map
 * @since 2.0
 */
OracleELocation.prototype.changeRouteStyle = function(routeStyles) {
    OracleELocation.eloc = this;
    if (routeStyles && routeStyles.length > 0) {
        var featureLayer = this.getLocalLayer(OracleELocation.mapviewer);
        for (var styleCounter=0; styleCounter<routeStyles.length; styleCounter++) {
            var routeId = routeStyles[styleCounter].routeId;
            var style = routeStyles[styleCounter].render_style;
            if (routeId && style) {
                var styleName;
                var styleObj;
                if (style.datasource && style.name) {
                    OracleELocation.datasource = style.datasource;
                    styleName = style.name;
                }
                else if (style.styleObj) {
                    styleObj = style.styleObj;
                }
                else {
                    styleName = 'eLocation_style_'+routeId;
                    styleObj = 
                                new OM.style.Line({styleName:styleName,fill:style.color,fillOpacity:style.opacity,fillWidth:style.width});
                }
                if (featureLayer) {
                    var feature = featureLayer.getFeature(routeId);
                    if (feature) {
                        if (styleObj) {
                            feature.setRenderingStyle(styleObj);
                        }
                        else {
                            var serverStyle = {dataSource: style.datasource, name:styleName};
                            feature.setRenderingStyle(serverStyle);
                        }
                    }
                }
            }
        }
    }
}
/**
 * <P>Attach event handlers to routes and route segments, such as:
    <UL>
        <LI>OM.event.MouseEvent.MOUSE_CLICK</LI>
        <LI>OM.event.MouseEvent.MOUSE_RIGHT_CLICK</LI>
        <LI>OM.event.MouseEvent.MOUSE_OVER</LI>
        <LI>OM.event.MouseEvent.MOUSE_OUT</LI>
    </UL>
    The eventHandler function should define a parameter where the actual event will be filled.    
    </P>
 * @param routeId The feature ID of the desired route to attach the event to
 * @param eventType The event type to handle. Options are: OM.event.MouseEvent.MOUSE_CLICK, OM.event.MouseEvent.MOUSE_RIGHT_CLICK, OM.event.MouseEvent.MOUSE_OVER, OM.event.MouseEvent.MOUSE_OUT
 * @param eventHandler The function that will handle the event.
 * @since 2.0
 */
OracleELocation.prototype.attachEventListenerToRoute = function (routeId, eventType, eventHandler) {
    if (OracleELocation.mapviewer) {
        var routeFeature = this.getLocalLayer(OracleELocation.mapviewer).getFeature(routeId);
        if (routeFeature) {
            routeFeature.addListener(eventType, eventHandler);
        }
    }
}
/**
 * <P>Detach event handlers from routes and route segments, such as:
    <UL>
        <LI>OM.event.MouseEvent.MOUSE_CLICK</LI>
        <LI>OM.event.MouseEvent.MOUSE_RIGHT_CLICK</LI>
        <LI>OM.event.MouseEvent.MOUSE_OVER</LI>
        <LI>OM.event.MouseEvent.MOUSE_OUT</LI>
    </UL>
    </P>
 * @param routeId The feature ID of the desired route to detach the event from
 * @param eventType The event type to detach. Options are: OM.event.MouseEvent.MOUSE_CLICK, OM.event.MouseEvent.MOUSE_RIGHT_CLICK, OM.event.MouseEvent.MOUSE_OVER, OM.event.MouseEvent.MOUSE_OUT
 * @param eventHandler The function previously attached to this route feature
 * @since 2.0
 */
OracleELocation.prototype.detachEventListenerFromRoute = function (routeId, eventType, eventHandler) {
    if (OracleELocation.mapviewer) {
        var routeFeature = this.getLocalLayer(OracleELocation.mapviewer).getFeature(routeId);
        if (routeFeature) {
            routeFeature.deleteListener(eventType, eventHandler);
        }
    }
}
/**@private*/
OracleELocation.prototype.calRoutes = function (gcResultArray, func, errHandler, routeOptions, mapOptions) {
    var routeReceived = function (routes) {
        var errorCount = 0;
        var errorMessages = new Array();
        for (var routeCounter = 0;routeCounter < routes.length;routeCounter++) {
            if (!routes[routeCounter] || routes[routeCounter].errorMessage != undefined) {
                var errorMsg = "Route failed to be calculated";
                if (routes[routeCounter] && routes[routeCounter].errorMessage) {
                    errorMsg = routes[routeCounter].errorMessage;
                }
                var newError = new Object();
                newError.id = routeCounter;
                newError.errorMessage = errorMsg;
                var invalidAddresses = new Array();
                for (var addressCounter = 0;addressCounter < gcResultArray[routeCounter].length;addressCounter++) {
                    if (gcResultArray[routeCounter][addressCounter].errCode == OracleELocation.ERROR_ROUTE_ADDR_INVALID) {
                        invalidAddresses.push(addressCounter);
                    }
                }
                if (invalidAddresses.length > 0) {
                    newError.invalidAddresses = invalidAddresses;
                }
                errorMessages.push(newError);
                errorCount++;
            }
        }
        if (errorCount > 0) {
            errHandler(OracleELocation.ERROR_ROUTE_NOT_FOUND, "", gcResultArray, 0, 0, errorMessages);
            if (errorCount == routes.length && errHandler.mapview) {
                errHandler.mapview.showLoadingIcon(false);
            }
        }
        var singleRouteCallback = function () {
            func(gcResultArray[0], routes[0]);
        }
        var multiRouteCallback = function () {
            func(gcResultArray, routes);
        }

        if (mapOptions && mapOptions.mapview) {
            if (func) {
                if (OracleELocation.eloc.singleRoute) {
                    OracleELocation.eloc.drawRoutes(mapOptions, gcResultArray, routes, singleRouteCallback);
                }
                else {
                    OracleELocation.eloc.drawRoutes(mapOptions, gcResultArray, routes, multiRouteCallback);
                }
            }
            else {
                OracleELocation.eloc.drawRoutes(mapOptions, gcResultArray, routes);
            }
        }
        else {
            if (func) {
                if (OracleELocation.eloc.singleRoute) {
                    func(gcResultArray[0], routes[0]);
                }
                else {
                    func(gcResultArray, routes);
                }
            }
        }
    }
    this.calBatchRoute(gcResultArray, routeReceived, routeOptions, errHandler);
}
/**@private*/
OracleELocation.prototype.calBatchRoute = function(gcAddresses, func, params, errHandler) {
  var totalRoutes = Array();
  var completedRequests = 0;
  var failedRequests = 0;
  var runningRequests = 0;
  var startedRequests = 0;
  
  var batchRouteProperties;
  
  OracleELocation.eloc.getBatchRoutePropertiesFromServer(function(properties) {
      batchRouteProperties = properties
      var totalBatchRouteSegments = Math.floor(gcAddresses.length/batchRouteProperties.maxBatchRequestSizeAllowed);
      totalBatchRouteSegments = gcAddresses.length%batchRouteProperties.maxBatchRequestSizeAllowed > 0?totalBatchRouteSegments+1:totalBatchRouteSegments;
      
      var batchErrHandler = function(errCode, errMsg, gcAddrs, start, end, errorMsgs) {
          runningRequests--;
          completedRequests++;
          failedRequests++;
          
          var routeCounter = 0;
          for (var indexPosition = start; indexPosition < end; indexPosition ++) {
              var routeObj = new Object();
              routeObj.id = indexPosition;
              routeObj.errorMessage = errorMsgs?errorMsgs[routeCounter++]:errMsg;
              var invalidAddresses = new Array();
              for (var addressCounter = 0; addressCounter < gcAddresses[indexPosition].length; addressCounter++) {
                  if (gcAddresses[indexPosition][addressCounter].errCode == OracleELocation.ERROR_ROUTE_ADDR_INVALID) {
                      invalidAddresses.push(addressCounter);
                  }
              }
              if (invalidAddresses.length > 0) {
                  routeObj.invalidAddresses = invalidAddresses;
              }
              totalRoutes[indexPosition] = routeObj;
          }
          if (completedRequests == totalBatchRouteSegments) {
              if (failedRequests == completedRequests) {
                  errHandler(errCode, errMsg, gcAddrs, start, 0, totalRoutes);
                  if (errHandler.mapview) {
                    errHandler.mapview.showLoadingIcon(false);
                }
              }
              else {
                  func(totalRoutes);
              }
          }
          else {
              queue();
          }
      }
      
      var batchCallback = function (routeResult, start, end) {
          runningRequests--;
          completedRequests++;
          
          var routeCounter = 0;
          for (var indexPosition = start; indexPosition < end; indexPosition ++) {
              totalRoutes[indexPosition] = routeResult[routeCounter++];
          }
          if (completedRequests == totalBatchRouteSegments) {
              func(totalRoutes);
          }
          else {
              queue();
          }
      }
      function queue() {
          while ( startedRequests < totalBatchRouteSegments && runningRequests < batchRouteProperties.serverPoolSize) {
          runningRequests++;
          var startRouteCounter = startedRequests * batchRouteProperties.maxBatchRequestSizeAllowed;
          var endRouteCounter = startRouteCounter + batchRouteProperties.maxBatchRequestSizeAllowed;
          if (endRouteCounter > gcAddresses.length) {
              endRouteCounter = gcAddresses.length;
          }
          var xmlRequest = "<?xml version=\"1.0\" standalone=\"yes\"?>" +
                       "<batch_route_request id=\""+(startedRequests++)+"\" client=\"eLocationAPI\">" ;
          for (var i=startRouteCounter; i<endRouteCounter; i++) {
            xmlRequest += OracleELocation.eloc.buildRouteRequest(OracleELocation.routeCount+i, gcAddresses[i], params);
          }
          xmlRequest += "</batch_route_request>" ;
          OracleELocation.eloc.requestRoute(xmlRequest, batchCallback, batchErrHandler, gcAddresses, startRouteCounter, endRouteCounter);
         }
      }
      queue();
  });
}

/**@private*/
OracleELocation.prototype.buildRouteRequest = function(routeId, gcAddresses, params) {
    return OracleELocation.eloc.buildLatLonRouteRequest(routeId, gcAddresses, params);
}
/**@private*/
OracleELocation.prototype.buildPreGeocodedRouteRequest = function(routeId, gcAddresses, params) {
  var idCount = 1;
  var addressCounter=0
  var side = "L";
  var xmlRequest = "<route_request id=\"" + routeId + "\" "+
                 " route_preference=\"" + params.routePref + "\" "+
                 " road_preference=\"" + params.roadPref + "\" "+
                 " return_driving_directions=\"" + params.directions+"\" "+
                 " distance_unit=\"" + params.distUnit + "\" "+
                 " time_unit=\"" + params.timeUnit + "\" " +
                 " return_route_geometry=\"true\" "+//Always retrieve route geometry
                 " return_subroute_geometry=\"true\" "+//and subroute geometry as well
                 " language=\"" + params.langPref +"\" "+
                 " pre_geocoded_locations=\"true\"> ";
  if(this.trim(gcAddresses[addressCounter].side) != "") {
    side = gcAddresses[addressCounter].side;
  }
                 
  xmlRequest +=  "<start_location country=\""+gcAddresses[addressCounter].country+"\">"+
                   "<pre_geocoded_location id=\""+ idCount++ +"\" country=\""+gcAddresses[addressCounter].country+"\" "+
                        "longitude=\""+gcAddresses[addressCounter].x +"\" latitude=\""+gcAddresses[addressCounter].y +"\">"+
                     "<edge_id>"+gcAddresses[addressCounter].edgeId+"</edge_id>"+
                     "<percent>"+gcAddresses[addressCounter].percent+"</percent>"+
                     "<side>"+side+"</side>"+
                   "</pre_geocoded_location>"+
                 "</start_location>";
  addressCounter = 1;
  for (;addressCounter<gcAddresses.length-1;addressCounter++) {
      if(this.trim(gcAddresses[addressCounter].side) != "") {
        side = gcAddresses[addressCounter].side;
      }
      xmlRequest +=  "<location country=\""+gcAddresses[addressCounter].country+"\">"+
                       "<pre_geocoded_location id=\""+ idCount++ +"\" country=\""+gcAddresses[addressCounter].country+"\" "+
                            "longitude=\""+gcAddresses[addressCounter].x +"\" latitude=\""+gcAddresses[addressCounter].y +"\">"+
                         "<edge_id>"+gcAddresses[addressCounter].edgeId+"</edge_id>"+
                         "<percent>"+gcAddresses[addressCounter].percent+"</percent>"+
                         "<side>"+side+"</side>"+
                       "</pre_geocoded_location>"+
                     "</location>";
  }
  
  if(this.trim(gcAddresses[addressCounter].side) != "") {
    side = gcAddresses[addressCounter].side;
  }
  xmlRequest +=  "<end_location country=\""+gcAddresses[addressCounter].country+"\">"+
                   "<pre_geocoded_location id=\""+ idCount++ +"\" country=\""+gcAddresses[addressCounter].country+"\" "+
                        "longitude=\""+gcAddresses[addressCounter].x +"\" latitude=\""+gcAddresses[addressCounter].y +"\">"+
                     "<edge_id>"+gcAddresses[addressCounter].edgeId+"</edge_id>"+
                     "<percent>"+gcAddresses[addressCounter].percent+"</percent>"+
                     "<side>"+side+"</side>"+
                   "</pre_geocoded_location>"+
                 "</end_location>"+
                 "</route_request>" ;
  return xmlRequest;
}

/**@private*/
OracleELocation.prototype.buildLatLonRouteRequest = function(routeId, gcAddresses, params) {
  var idCount = 1;
  var addressCounter=0
  var side = "L";
  var xmlRequest = "<route_request id=\"" + routeId + "\" "+
                 " route_preference=\"" + params.routePref + "\" "+
                 " road_preference=\"" + params.roadPref + "\" "+
                 " return_driving_directions=\"" + params.directions+"\" "+
                 " distance_unit=\"" + params.distUnit + "\" "+
                 " time_unit=\"" + params.timeUnit + "\" " +
                 " return_route_geometry=\"true\" "+//Always retrieve route geometry
                 " return_subroute_geometry=\"true\" "+//and subroute geometry as well
                 " language=\"" + params.langPref +"\"";
    if (params.vehicleType && params.vehicleType.toUpperCase() == 'TRUCK') {
        xmlRequest += " vehicle_type=\"truck\" ";
        if (params.lengthUnit) {
            xmlRequest += " length_unit=\""+params.lengthUnit+"\" ";
        }
        if (params.weightUnit) {
            xmlRequest += " weight_unit=\""+params.weightUnit+"\" ";
        }
        if (params.truckType) {
            xmlRequest += " truck_type=\""+params.truckType+"\" ";
        }
        if (params.truckHeight) {
            xmlRequest += " truck_height=\""+params.truckHeight+"\" ";
        }
        if (params.truckLenght) {
            xmlRequest += " truck_lenght=\""+params.truckLenght+"\" ";
        }
        if (params.truckWidth) {
            xmlRequest += " truck_width=\""+params.truckWidth+"\" ";
        }
        if (params.truckWeight) {
            xmlRequest += " truck_weight=\""+params.truckWeight+"\" ";
        }
        if (params.truckAxleWeight) {
            xmlRequest += " truck_per_axle_weight=\""+params.truckAxleWeight+"\" ";
        }
    }
    xmlRequest+="> ";
  if(this.trim(gcAddresses[addressCounter].side) != "") {
    side = gcAddresses[addressCounter].side;
  }
                 
  xmlRequest +=  "<start_location country=\""+gcAddresses[addressCounter].country+"\">"+
                   "<input_location id=\""+ idCount++ +"\" country=\""+gcAddresses[addressCounter].country+"\" "+
                        "longitude=\""+gcAddresses[addressCounter].x +"\" latitude=\""+gcAddresses[addressCounter].y +"\"/>"+
                 "</start_location>";
  addressCounter = 1;
  for (;addressCounter<gcAddresses.length-1;addressCounter++) {
      if(this.trim(gcAddresses[addressCounter].side) != "") {
        side = gcAddresses[addressCounter].side;
      }
      xmlRequest +=  "<location country=\""+gcAddresses[addressCounter].country+"\">"+
                       "<input_location id=\""+ idCount++ +"\" country=\""+gcAddresses[addressCounter].country+"\" "+
                            "longitude=\""+gcAddresses[addressCounter].x +"\" latitude=\""+gcAddresses[addressCounter].y +"\"/>"+
                     "</location>";
  }
  
  if(this.trim(gcAddresses[addressCounter].side) != "") {
    side = gcAddresses[addressCounter].side;
  }
  xmlRequest +=  "<end_location country=\""+gcAddresses[addressCounter].country+"\">"+
                   "<input_location id=\""+ idCount++ +"\" country=\""+gcAddresses[addressCounter].country+"\" "+
                        "longitude=\""+gcAddresses[addressCounter].x +"\" latitude=\""+gcAddresses[addressCounter].y +"\"/>"+
                 "</end_location>"+
                 "</route_request>" ;
  return xmlRequest;
}

/**@private*/
OracleELocation.prototype.requestRoute = function(xmlRequest, func, errHandler, gcAddresses, indexStart, indexEnd) {
  var lbsURL = this.baseURL+"/lbs";
  
  $.ajax({
    url:lbsURL,
    data:"xml_request="+encodeURIComponent(xmlRequest)+"&format=JSON",
    dataType:"jsonp",
    type:"POST",
    success:function(result) {
        if(result) {
          var errorCount = 0;
          var errorMsgs = new Array();
          for(var resultCount = 0; resultCount < result.length; resultCount++) {
            if (result[resultCount].errorMessage) {
              errorCount++;
              errorMsgs.push(result[resultCount].errorMessage);
            }
          }
          //Error msg when all routes failed to be calculated
          if (errorCount == result.length) {
            if(errHandler) {
                errHandler(OracleELocation.ERROR_ROUTE_FAILED, "", gcAddresses, indexStart, indexEnd, errorMsgs);
              }
            else {
                alert("OracleELocation.getDirections() has encountered an error.\n" + errorMsg);
            }
            return;
          }
        }
        
        if(func!=null)
          func(result, indexStart, indexEnd);
    },
    error: function(request, status, error) {
        if(errHandler) {
            errHandler(OracleELocation.ERROR_ROUTE_FAILED, content, gcAddresses, indexStart, indexEnd) ;
          }
          else
            alert("OracleElocation.getDirections has encountered error.\n" + content);
          return ;
    }
  });
  return null;
}
/**@private*/
OracleELocation.prototype.getBatchRoutePropertiesFromServer = function(callbackFunc) {
    var xmlRequest = "<?xml version=\"1.0\" standalone=\"yes\"?>" +
                     "<get_batch_route_properties id=\"1\" client=\"eLocationAPI\">" +
                     "<property>maxBatchRequestSizeAllowed</property>" +
                     "<property>serverPoolSize</property>" +
                     "</get_batch_route_properties>" ;
  
  var lbsURL = this.baseURL+"/lbs";
  var properties = null;
  
  $.ajax({
    url:lbsURL,
    data:"xml_request="+encodeURIComponent(xmlRequest)+"&format=JSON",
    dataType:"jsonp",
    type:"POST",
    success:function(result) {
        if(result) {
          properties = result;
        }
        else {
            properties = new Object();
            properties.maxBatchRequestSizeAllowed=20;
            properties.serverPoolSize=2;
        }
        
        if(callbackFunc!=null) {
          callbackFunc(properties);
        }
    },
    error: function(request, status, error) {
        properties = new Object();
        properties.maxBatchRequestSizeAllowed=20;
        properties.serverPoolSize=2;
        if(callbackFunc!=null) {
          callbackFunc(properties);
        }
    }
  });
  return null;
}

/**@private*/
OracleELocation.gcResultIsValid = function(addr) {
  if(!addr)
    return false ;
  if(addr.matchCode==1)
    return true ;
  if(addr.edgeId>0 && addr.matchVector) {
    var vector = addr.matchVector ;
    if(vector.charAt(6)>1) // street base name must be exact match
      return false ;
    if(vector.charAt(10)==2 || vector.charAt(10)==3) // city name must match or
      return false ;                                 // the input is empty
    if(vector.charAt(13)==2 || vector.charAt(13)==3) // region name must match or
      return false ;                                 // the input is empty
  }
  return true ;
}
/**@private*/
OracleELocation.prototype.drawRoutes = function (params, gcResult, routes, afterRefreshHandler) {
    var styles = params.routeStyles;

    if (params.removePreviousRoutes) {
        this.removeRoutes(null, params);
    }
    var routesDisplayedCount = OracleELocation.routeCount;
    OracleELocation.routeCount += routes.length;

    var mbr = OracleELocation.getRouteMBR(routes);
    if (mbr == null) {
        return;
    }
    var mapview = params.mapview;
    if (mapview) {
        OracleELocation.mapviewer = params.mapview;
    }

    //Zoom To Fit
    if (params.zoomToFit) {
        mapview.zoomToExtent(new OM.geometry.Rectangle(mbr[0], mbr[1], mbr[2], mbr[3], 8307));
    }

    for (var i = 0;i < routes.length;i++) {
        var newRouteOnDisplay = new Object();
        newRouteOnDisplay.id = params.routeNamingIDs[i][0];
        routes[i].routeId = params.routeNamingIDs[i][0];//Adding routeId value to returning results
        newRouteOnDisplay.segments = new Array();
        var styleName;
        var style;
        if (routes[i].errorMessage == undefined) {
            if (styles[i][0].render_style.name) {
                styleName = styles[i][0].render_style.name;
                style = styles[i][0].render_style.styleObj;
                if (styles[i][0].render_style.datasource) {
                    OracleELocation.datasource = styles[i][0].render_style.datasource;
                }
            }
            else {
                styleName = 'eLocation_style_' + (i + routesDisplayedCount);
                style = new OM.style.Line( {
                    styleName : styleName, fill : styles[i][0].render_style.color, fillOpacity : styles[i][0].render_style.opacity, fillWidth : styles[i][0].render_style.width
                });
            }
            var subroutes = routes[i].subroutes;

            if (subroutes && subroutes.length) {
                for (var j = 0;j < subroutes.length;j++) {
                    var subrouteId = params.routeNamingIDs[i][j+1];
                    newRouteOnDisplay.segments[newRouteOnDisplay.segments.length] = subrouteId;
                    var subRoute = subroutes[j];
                    subRoute.routeId = subrouteId;//Adding routeId value to returning results
                    var lineGeom = new OM.geometry.LineString(subRoute.routeGeom, 8307);
                    var line;
                    var routeLabel = styles[i][j].label;

                    if (styles[i][j].render_style.name) {
                        styleName = styles[i][j].render_style.name;
                        style = styles[i][j].render_style.styleObj;
                        if (styles[i][j].render_style.datasource) {
                            OracleELocation.datasource = styles[i][j].render_style.datasource;
                        }
                    }
                    else {
                        styleName = 'eLocation_style_' + subRoute.routeId;
                        style = new OM.style.Line( {
                            styleName : styleName, fill : styles[i][j].render_style.color, fillOpacity : styles[i][j].render_style.opacity, fillWidth : styles[i][j].render_style.width
                        });
                    }

                    routeLabel = OracleELocation.replaceTimePlaceholder(routeLabel, this.getTimeText(subRoute.time, subRoute.timeUnit));
                    routeLabel = OracleELocation.replaceDistancePlaceholder(routeLabel, this.getDistanceText(subRoute.dist, subRoute.distUnit));
                    if (style) {
                        line = new OM.Feature(subrouteId, lineGeom, 
                        {
                            renderingStyle : style, label : routeLabel
                        });
                    }
                    else {
                        line = new OM.Feature(subrouteId, lineGeom, 
                        {
                            renderingStyle :  {
                                dataSource : OracleELocation.datasource, name : styleName
                            },
                            label : routeLabel
                        });
                    }
                    this.routeFOIArray.push(line);
                    this.getLocalLayer(params.mapview).addFeature(line);

                }
            }
            else {
                var routeId = params.routeNamingIDs[i][0];
                newRouteOnDisplay.segments[0] = routeId;
                
                var lineGeom = new OM.geometry.LineString(routes[i].routeGeom, 8307);
                var line;
                var routeLabel = styles[i][0].label;
                routeLabel = OracleELocation.replaceTimePlaceholder(routeLabel, this.getTimeText(routes[i].time, routes[i].timeUnit));
                routeLabel = OracleELocation.replaceDistancePlaceholder(routeLabel, this.getDistanceText(routes[i].dist, routes[i].distUnit));
                if (style) {
                    line = new OM.Feature(routeId, lineGeom, 
                    {
                        renderingStyle : style, label : routeLabel
                    });
                }
                else {
                    line = new OM.Feature(routeId, lineGeom, 
                    {
                        renderingStyle :  {
                            dataSource : OracleELocation.datasource, name : styleName
                        },
                        label : routeLabel
                    });
                }
                this.routeFOIArray.push(line);
                this.getLocalLayer(params.mapview).addFeature(line);
            }
            OracleELocation.routesOnDisplay[OracleELocation.routesOnDisplay.length] = newRouteOnDisplay;
        }
    }

    if (params.drawMarkers) {
        for (var routeCount = 0;routeCount < gcResult.length;routeCount++) {
            if (routes[routeCount].errorMessage == undefined) {
                var stopPoints = new Array();
                var markerId = "route_point_start";
                markerId += "_" + (routeCount + routesDisplayedCount + 1);
                stopPoints[0] = markerId;

                var marker = this.createRouteMarker(gcResult[routeCount][0], markerId, params.startMarker.style, params.startMarker.color, 1, params);
                marker.htmlStr = this.getMarkerInfoStr(gcResult[routeCount][0], params, 0);
                marker.infoWindowStyle=params.infoWindowStyle;
                marker.addListener(OM.event.MouseEvent.MOUSE_CLICK, function (evt) {
                    mapview.closeInfoWindows();
                    mapview.displayInfoWindow(mapview.getCursorLocation(), evt.target.htmlStr, OracleELocation.eloc.getInfoWindowParams(evt.target.infoWindowStyle, "Start", markerId));
                });
                markerId = "route_point_end";
                markerId += "_" + (routeCount + routesDisplayedCount + 1);
                stopPoints[gcResult[routeCount].length - 1] = markerId;
                marker = this.createRouteMarker(gcResult[routeCount][gcResult[routeCount].length - 1], markerId, params.endMarker.style, params.endMarker.color, gcResult[routeCount].length, params);
                marker.htmlStr = this.getMarkerInfoStr(gcResult[routeCount][gcResult[routeCount].length - 1], params, gcResult[routeCount].length - 1);
                marker.infoWindowStyle=params.infoWindowStyle;
                marker.addListener(OM.event.MouseEvent.MOUSE_CLICK, function (evt) {
                    mapview.closeInfoWindows();
                    mapview.displayInfoWindow(mapview.getCursorLocation(), evt.target.htmlStr, OracleELocation.eloc.getInfoWindowParams(evt.target.infoWindowStyle, "End", markerId));
                });
                if (gcResult[routeCount].length > 2) {
                    for (i = 1;i < gcResult[routeCount].length - 1;i++) {
                        markerId = "route_point_" + (routeCount + routesDisplayedCount + 1) + "_" + i;
                        stopPoints[i] = markerId;
                        marker = this.createRouteMarker(gcResult[routeCount][i], markerId, params.stopMarker.style, params.stopMarker.color, (i + 1), params);
                        marker.htmlStr = this.getMarkerInfoStr(gcResult[routeCount][i], params, i);
                        marker.infoWindowStyle=params.infoWindowStyle;
                        marker.stopIndex = i;
                        marker.addListener(OM.event.MouseEvent.MOUSE_CLICK, function (evt) {
                            mapview.closeInfoWindows();
                            mapview.displayInfoWindow(mapview.getCursorLocation(), evt.target.htmlStr, OracleELocation.eloc.getInfoWindowParams(evt.target.infoWindowStyle, "Stop " + evt.target.stopIndex, markerId));
                        });
                    }
                }

                this.setStopPoints(params.routeNamingIDs[routeCount][0], stopPoints);
                routes[routeCount].stopPoints = stopPoints;
            }
        }
    }

    if (params.resultPanel) {
        this.displayDirections(params.resultPanel, gcResult, routes);
    }
    if (!params.disableLoadingIcon) {
        mapview.showLoadingIcon(false);
    }
    afterRefreshHandler();
}

/**@private*/
OracleELocation.prototype.removeRoutes = function (routeArray, params) {
    if (!params) {
        params = new Object();
        params.mapview = OracleELocation.mapviewer;
    }
    if (routeArray && routeArray.length > 0) {
        //Remove provided routes by ID
        for (var routeToDelete = 0;routeToDelete < routeArray.length;routeToDelete++) {
            var routeId = routeArray[routeToDelete];
            var arraySize = OracleELocation.routesOnDisplay.length;
            for (var routeDisplayedCount = 0;routeDisplayedCount < arraySize;routeDisplayedCount++) {
                var currentRoute = OracleELocation.routesOnDisplay[routeDisplayedCount];
                if (currentRoute.id == routeId) {
                    if (currentRoute.stopPoints) {
                        //Make sure route has drawn markers by eLocation
                        for (var stopCount = 0;stopCount < currentRoute.stopPoints.length;stopCount++) {
                            this.removeSingleRouteFOI(params.mapview, currentRoute.stopPoints[stopCount]);
                        }
                    }
                    if (currentRoute.segments) {
                        for (var segmentCount = 0;segmentCount < currentRoute.segments.length;segmentCount++) {
                            this.removeSingleRouteFOI(params.mapview, currentRoute.segments[segmentCount]);
                        }
                    }
                    OracleELocation.routesOnDisplay.splice(routeDisplayedCount, 1);
                    break;
                }
            }
        }
        if (OracleELocation.routesOnDisplay.length == 0) {
            OracleELocation.routeCount = 0;
        }
    }
    else {
        //Remove everything
        this.removeRouteFOIs(params);
        OracleELocation.routesOnDisplay = new Array();
        OracleELocation.routeCount = 0;
    }
}

/**@private*/
OracleELocation.prototype.setStopPoints = function(route, stops) {
  for (var i = 0; i < OracleELocation.routesOnDisplay.length; i++) {
    if (OracleELocation.routesOnDisplay[i].id == route) {
      OracleELocation.routesOnDisplay[i].stopPoints = stops;
      return;
    }
  }
}

/**@private*/
OracleELocation.getRouteMBR = function(routes) {
  var mbr = new Array();
  var defaultSet = false;
  for(var i=0; i<routes.length; i++) {
    if(routes[i].routeMBR && routes[i].routeMBR.length==4) {
      var routeMBR = routes[i].routeMBR ;
      if (defaultSet) {
        if (mbr[0] > routeMBR[0])
            mbr[0] = routeMBR[0] ;
        if (mbr[1] > routeMBR[1])
            mbr[1] = routeMBR[1] ;
        if (mbr[2] < routeMBR[2])
            mbr[2] = routeMBR[2] ;
        if (mbr[3] < routeMBR[3])
            mbr[3] = routeMBR[3] ;
      }
      else {
        mbr[0] = routeMBR[0] ;
        mbr[1] = routeMBR[1] ;
        mbr[2] = routeMBR[2] ;
        mbr[3] = routeMBR[3] ;
        defaultSet = true;
      }
    }
  }
  if(defaultSet)
    return mbr ;
  else
    return null ;
}

/**@private*/
OracleELocation.prototype.removeRouteFOIs = function(params) {
  if(params && params.mapview) {
    if(this.routeFOIArray) {
      while(this.routeFOIArray.length>0) {
        var foi = this.routeFOIArray.pop() ;
        this.getLocalLayer(params.mapview).removeFeature(foi);
      }
    }
  }
}

/**@private*/
OracleELocation.prototype.removeSingleRouteFOI = function (mapview, id) {
    if (this.routeFOIArray) {
        for (var foiCount = 0;foiCount < this.routeFOIArray.length;foiCount++) {
            if (this.routeFOIArray[foiCount].id == id) {
                var foi = this.routeFOIArray.splice(foiCount, 1);
                this.getLocalLayer(mapview).removeFeature(foi[0]);
                return;
            }
        }
    }
}
/**@private*/
OracleELocation.prototype.removeFOIEvent = function(id) {
    var foiCount = 0;
    var found = false;
    while (!found && foiCount<OracleELocation.routeEventList.length) {
        var eventFOI = OracleELocation.routeEventList[foiCount];
        if (eventFOI.id == id) {
            OracleELocation.routeEventList.splice(foiCount, 1);
            found = true;
        }
        foiCount++;
    }
}
/**@private*/
OracleELocation.prototype.createRouteMarker = function(gcResult, markerId, markerStyle, markerColor, markerNumber, params) {
  var markerText = ""+markerNumber;
  if (params.markerStyle=="letterSequence") {
    markerText = this.getStopLetter(markerNumber);
    markerColor = this.getImageColor(markerNumber);
  }
  else if (params.label) {
    markerText = params.label;
  }
  var loc = new OM.geometry.Point(gcResult.x, gcResult.y, 8307) ;
  var marker = ELocationMarkerFactory.createMarkerFeature(loc, markerText, markerStyle, markerColor, markerId);
  var localLayer = this.getLocalLayer(params.mapview);
  this.routeFOIArray.push(marker);
  localLayer.addFeature(marker);
  return marker ;
}
/**@private*/
OracleELocation.prototype.getLocalLayer = function (mapview) {
    var localLayer = mapview.getLayerByName("_eLocationLocalLayer");
    if (!localLayer) {
        localLayer = new OM.layer.VectorLayer("_eLocationLocalLayer", 
        {
            def :  {
                type : OM.layer.VectorLayer.TYPE_LOCAL
            }
        });
        mapview.addLayer(localLayer);
    }
    return localLayer;
}
/**@private*/
OracleELocation.prototype.getStopLetter = function (counter) {
  return String.fromCharCode(64+counter);
}
/**@private*/
OracleELocation.prototype.isArray = function (obj) {
    //returns true if obj is an array
    return (obj.constructor.toString().indexOf("Array") != -1);
}
/**@private*/
OracleELocation.prototype.getImageColor = function(counter) {
  var color = '';
  switch (counter%5) {
    case 0: color = ELocationMarkerFactory.COLOR_BLUE;
      break;
    case 1: color = ELocationMarkerFactory.COLOR_GREEN;
      break;
    case 2: color = ELocationMarkerFactory.COLOR_ORANGE;
      break;
    case 3: color = ELocationMarkerFactory.COLOR_PURPLE;
      break;
    case 4: color = ELocationMarkerFactory.COLOR_RED;
      break;
    default: color = ELocationMarkerFactory.COLOR_GREEN;
  }
  return color;
}
/**@private*/
OracleELocation.prototype.getMarkerInfoStr = function(gcResult, params, idx) {
  if(params.getMarkerInfoStr) {
    return params.getMarkerInfoStr(gcResult, idx) ;
  }
    
  return "<font color=black>"+gcResult.streetLine + "<br>" + gcResult.localityLine + "<br>" + 
         gcResult.country+"</font>";
}
/**@private*/
OracleELocation.prototype.getInfoWindowParams = function (windowStyle, windowTitle, markerId) {
  if (ELocationMarkerFactory.WINDOW_STYLE_1 == windowStyle) {
    return {
                        title : windowTitle, id : markerId, width : 280, height : 125,
                                infoWindowStyle:{"background-color": "rgb(255, 255, 255)", "border": "1px solid rgb(135, 148, 163)", "border-radius": "0px 0px 0px 0px"},
                                titleStyle:{"background": "rgb(207, 220, 235)", "font-weight": "bold", "text-align": "center", "color":"rgb(0, 0, 0)", "font-size":"16px","font-family":"Times New Roman", "border": "0px none", "border-radius": "0px 0px 0px 0px", "height": "20px", "line-height": "20px", "top": "-1px", "min-width":"282px", "left": "-1px"},
                                contentStyle:{"background": "rgb(255, 255, 255)", "font-size":"16px","font-family":"Times New Roman"},
                                tailStyle:{"offset":"25","background":"rgb(255, 255, 255)"},
                                closeButtonStyle:{
                                  "mouseOutButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/closeDialog_n.png"
                                  },
                                  "mouseOverButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/closeDialog_n.png"
                                  },
                                  "width":"14","height":"14","xOffset":"3","yOffset":"3"}
           }
  }
  else if (ELocationMarkerFactory.WINDOW_STYLE_2 == windowStyle) {
    return {
                        id : markerId, width : 280, height : 125,
                                infoWindowStyle:{"background-color": "rgb(255, 255, 255)", "border": "1px solid rgb(195, 208, 223)", "border-radius": "18px 18px 18px 18px"},
                                contentStyle:{"background": "rgb(255, 255, 255)", "font-size":"16px","font-family":"Times New Roman", "left": "25px"},
                                tailStyle:{"offset":"25","background":"rgb(255, 255, 255)"},
                                closeButtonStyle:{
                                  "mouseOutButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/close_circle.gif"
                                  },
                                  "mouseOverButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/close_circle.gif"
                                  },
                                  "width":"16","height":"16","xOffset":"3","yOffset":"7"}
           }
  }
  else if (ELocationMarkerFactory.WINDOW_STYLE_3 == windowStyle) {
    return {
                        id : markerId, width : 280, height : 125,
                                infoWindowStyle:{"background-color": "rgb(255, 255, 255)", "border": "1px solid rgb(135, 148, 163)", "border-radius": "0px 0px 0px 0px"},
                                contentStyle:{"background": "rgb(255, 255, 255)", "font-size":"16px","font-family":"Times New Roman", "left": "30px"},
                                tailStyle:{"offset":"25","background":"rgb(255, 255, 255)"},
                                closeButtonStyle:{
                                  "mouseOutButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/close.gif"
                                  },
                                  "mouseOverButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/close.gif"
                                  },
                                  "width":"15","height":"15","xOffset":"3","yOffset":"5"}
           }
  }
  else {//For ELocationMarkerFactory.WINDOW_STYLE_4 and other unrecognized numbers
    return {
                        title : windowTitle, id : markerId, width : 280, height : 125,
                        infoWindowStyle:{"background-color": "rgb(235, 239, 245)", "border": "1px solid rgb(194, 199, 211)"},
                        titleStyle:{"font-size":"14px"},
                        contentStyle:{"background": "rgb(235, 239, 245)", "font-size":"16px","font-family":"Times New Roman"},
                        tailStyle:{"offset":"25","background":"rgb(235, 239, 245)"},
                        closeButtonStyle:{
                                  "mouseOutButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/close_ena.png"
                                  },
                                  "mouseOverButton":{
                                    "src":"/mapviewer/fsmc/images/infoicons/close_ovr.png"
                                  },
                                  "width":"13","height":"13","xOffset":"3","yOffset":"5"}
           }
  }
  
}
/**@private*/
OracleELocation.prototype.initParams = function(routeOptions, mapOptions) {
  if(!routeOptions.routePref)
    routeOptions.routePref = "fastest" ;
  if(!routeOptions.roadPref)
    routeOptions.roadPref = "highway" ;
  if(routeOptions.directions==undefined)
    routeOptions.directions = true ;
  if(!routeOptions.distUnit)
    routeOptions.distUnit = "mile" ;
  if(!routeOptions.timeUnit)
    routeOptions.timeUnit = "minute" ;
  if(!routeOptions.langPref)
    routeOptions.langPref = "english" ;
  
  if(mapOptions.mapview) {
    if(mapOptions.zoomToFit==undefined)
      mapOptions.zoomToFit = true ;
    if(mapOptions.drawMarkers==undefined)
      mapOptions.drawMarkers = true ;
    if(!mapOptions.startMarker)
      mapOptions.startMarker = {style:ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_GREEN} ;
    if(!mapOptions.startMarker.style)
      mapOptions.startMarker.style = ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1 ;
    if(!mapOptions.startMarker.color)
      mapOptions.startMarker.color = ELocationMarkerFactory.COLOR_GREEN ;
    if(!mapOptions.endMarker)
      mapOptions.endMarker = {style:ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_RED} ;
    if(!mapOptions.endMarker.style)
      mapOptions.endMarker.style = ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1 ;
    if(!mapOptions.endMarker.color)
      mapOptions.endMarker.color = ELocationMarkerFactory.COLOR_RED ;
    if(!mapOptions.stopMarker)
      mapOptions.stopMarker = {style:ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:ELocationMarkerFactory.COLOR_BLUE} ;
    if(!mapOptions.stopMarker.style)
      mapOptions.stopMarker.style = ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1 ;
    if(!mapOptions.stopMarker.color)
      mapOptions.stopMarker.color = ELocationMarkerFactory.COLOR_BLUE ;
    if(!mapOptions.infoWindowStyle)
      mapOptions.infoWindowStyle = ELocationMarkerFactory.WINDOW_STYLE_4 ;
  }

}
/**@private*/
OracleELocation.prototype.initGeocodeParams = function(mapOptions) {
  if(mapOptions && mapOptions.mapview) {
    if(!mapOptions.id)
      mapOptions.id = 1;
    if(!mapOptions.label)
      mapOptions.label = this.getStopLetter(mapOptions.id) ;
    if(!mapOptions.marker)
      mapOptions.marker = {style:ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1, color:this.getImageColor(mapOptions.id)} ;
    if(!mapOptions.marker.style)
      mapOptions.marker.style = ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1 ;
    if(!mapOptions.marker.color)
      mapOptions.marker.color = this.getImageColor(mapOptions.id) ;
    if(!mapOptions.infoWindowStyle)
      mapOptions.infoWindowStyle = ELocationMarkerFactory.WINDOW_STYLE_4 ;
  }
}

/**@private*/
OracleELocation.prototype.initRoutes = function(currentRoutes) {
  if (this.isArray(currentRoutes[0])) {
    this.singleRoute = false;
    return currentRoutes;
  }
  else {
    this.singleRoute = true;
    var newRoutes = new Array();
    newRoutes[0] = currentRoutes;
    return newRoutes;
  }
}
/**@private*/
OracleELocation.prototype.initIDsAndStyles = function(routes, mapOptions) {
    if (mapOptions.mapview) {
        var routeIdPrefix = "route";
        var subrouteIdPrefix = "sub";
    
        //Create Array for routes (ids)
        if (!mapOptions.routeNamingIDs) {
            mapOptions.routeNamingIDs = new Array();
        }
        
        //Create Array for routes (styles)
        if(!mapOptions.routeStyles) {
          mapOptions.routeStyles = new Array();
        }
        
        var totalRoutesOnDisplay = OracleELocation.routesOnDisplay.length;
        if (mapOptions.removePreviousRoutes) {
            totalRoutesOnDisplay = 0
        }
        for (var routeCounter = 0; routeCounter < routes.length; routeCounter++) {
            var currentRouteId = routeIdPrefix + (routeCounter+totalRoutesOnDisplay+1);
            
            //Create Array for route ids
            if (!mapOptions.routeNamingIDs[routeCounter]) {
                mapOptions.routeNamingIDs[routeCounter] = new Array();
            }
            
            //Create Array for route styles
            if (!mapOptions.routeStyles[routeCounter]) {
                mapOptions.routeStyles[routeCounter] = new Array();
            }
            
            var segmentCounter = 0
            if (!mapOptions.routeNamingIDs[routeCounter][0]) {
                mapOptions.routeNamingIDs[routeCounter][0] = currentRouteId;
            }
            else {
                var idMatches = ROUTE_ID_REGEX.exec(mapOptions.routeNamingIDs[routeCounter][0]);
                if (idMatches == null) {
                    this.throwException("[OracleELocation.getDirections]", "ELOCATION-05000", mapOptions.routeNamingIDs[routeCounter][0]);
                }
                currentRouteId = mapOptions.routeNamingIDs[routeCounter][0];
            }
            
            if (!this.isArray(mapOptions.routeStyles[routeCounter])) {
                var style = mapOptions.routeStyles[routeCounter];
                mapOptions.routeStyles[routeCounter] = new Array();
                mapOptions.routeStyles[routeCounter][0] = style;
            }
            else {
                if (!mapOptions.routeStyles[routeCounter][0]) {
                    mapOptions.routeStyles[routeCounter][0] =
                        {render_style:
                        {color:"#CC00CC",
                           opacity:0.5,
                           width:9},
                           typeName:"Customer",
                           label:"{time}. {distance}."};
                }
            }
            
            if (routes[routeCounter].length > 2) {
                for (segmentCounter = 1; segmentCounter<routes[routeCounter].length; segmentCounter++) {
                    var subRouteId = subrouteIdPrefix + segmentCounter;
                    if (!mapOptions.routeNamingIDs[routeCounter][segmentCounter]) {
                        mapOptions.routeNamingIDs[routeCounter][segmentCounter] = currentRouteId+subRouteId;
                    }
                    else {
                        var idMatches = ROUTE_ID_REGEX.exec(mapOptions.routeNamingIDs[routeCounter][segmentCounter]);
                        if (idMatches == null) {
                            this.throwException("[OracleELocation.getDirections]", "ELOCATION-05000", mapOptions.routeNamingIDs[routeCounter][segmentCounter]);
                        }
                    }
                    
                    if (!mapOptions.routeStyles[routeCounter][segmentCounter]) {
                        mapOptions.routeStyles[routeCounter][segmentCounter] =
                                mapOptions.routeStyles[routeCounter][0];
                    }
                }
            }
        }
    }
}

/**@private*/
OracleELocation.prototype.getStreetLine = function(ad) {
  if(!ad.houseNumber) { 
    if(ad.street)
      return ad.street ;
    else
      return null ;
  }
  
  var country = ad.country ;
  if(country==null || "US"==country || "AD"==country || "AU"==country || 
     "CA"==country || "FR"==country || "GB"==country || "IE"==country ||
     "LU"==country || "MC"==country || "NZ"==country || "PR"==country)
    return ad.houseNumber + " "+ ad.street ;
  else
    return ad.street + " " + ad.houseNumber ;
}
/**@private*/
OracleELocation.prototype.getLocalityLine = function(ad) {
  var country = ad.country ;
  var postalCodeIsInFront = false ;
  if(country!=null &&
     ("AT"==country || "BE"==country || "DK"==country || "FI"==country ||
      "FR"==country || "DE"==country || "IT"==country || "LI"==country ||
      "LU"==country || "MC"==country || "NL"==country || "NO"==country ||
      "PT"==country || "SM"==country || "ES"==country || "SE"==country ||
      "CH"==country))
    postalCodeIsInFront = true ;
  var regionIsRequired = false ;
  if(country==null || "US"==country || "AU"==country || "CA"==country)
    regionIsRequired = true ;
  var result = "" ;
  if(ad.settlement)
    result += ad.settlement ;
  if(ad.municipality && ad.municipality!=ad.settlement)
    result += (result.length>0?", ":"")+ad.municipality ;
  if(regionIsRequired && ad.region)
    result += (result.length>0?", ":"")+ad.region ;
  if(ad.postalCode!=null && ad.postalCode!="null") {
    if(postalCodeIsInFront) {
      result = ad.postalCode + " " + result ;
    }
    else {
      result = result + " " + ad.postalCode ;
    }
  }
  else {
    ad.postalCode = null;
  }
  if(result=="")
    return null ;
  else
    return result ;
}
/**@private*/
OracleELocation.prototype.displayDirections = function(resultPanel, gcResult, routeRes) {
  resultPanel.innerHTML = "" ;
  var currentRoute = OracleELocation.routeCount - routeRes.length + 1;
  for (var routeCount=0;routeCount < routeRes.length; routeCount++) {
    if (routeRes[routeCount].errorMessage == undefined) {
      var routePanel = this.buildDirectionsTable((currentRoute+routeCount), gcResult[routeCount], routeRes[routeCount]);
      resultPanel.appendChild(routePanel) ;
    }
  }
}
/**@private*/
OracleELocation.prototype.buildDirectionsTable = function(routeCount, gcResult, routeRes) {
    var routePanel = document.createElement("div") ;
    routePanel.setAttribute("id",routeCount);
    var table = document.createElement("table") ;
    table.border = 1 ;
    table.className = "eloc_direction_table" ;
    var tbody = document.createElement("tbody") ;
    var tr = document.createElement("tr") ;
    var inst = document.createElement("th") ;
    inst.innerHTML = "Direction" ;
    inst.className = "eloc_direction_header" ;
    var dist = document.createElement("th") ;
    dist.innerHTML = "Distance" ;
    dist.className = "eloc_direction_header" ;
    var time = document.createElement("th") ;
    time.innerHTML = "Time" ;
    time.className = "eloc_direction_header" ;
    tr.appendChild(inst) ;
    tr.appendChild(dist) ;
    tr.appendChild(time) ;
    tbody.appendChild(tr) ;
    var totalTime = 0 ;
    var totalDist = 0 ;
    var timeUnit = "minute" ;
    var distUnit = "mile" ;
  
    timeUnit = routeRes.timeUnit ;
    distUnit = routeRes.distUnit ;
    totalTime = routeRes.time ;
    totalDist = routeRes.dist ;
    tr = document.createElement("tr") ;
    var td = document.createElement("td") ;
    td.innerHTML = "Start from " + this.getAddressLine(gcResult[0]) ;
    td.className = "eloc_direction_stop" ;
    td.colSpan = 3 ;
    tr.appendChild(td) ;
    tbody.appendChild(tr) ;

    var subroutes = routeRes.subroutes;
    if (subroutes && subroutes.length) {
      for (var j=0; j < subroutes.length; j++) {
        this.getStepsFromRoute(tbody, subroutes[j], gcResult[j+1]);
      }
    }
    else {
      this.getStepsFromRoute(tbody, routeRes, gcResult[1]);
    }
    
    var summary = document.createElement("div") ;
    summary.className = "eloc_direction_summary" ;
    if (routeCount > 0) {
      summary.innerHTML = "<br/>";
    }
    summary.innerHTML += "Route: " + (routeCount);
    summary.innerHTML += "<br>Estimated time: " + this.getTimeText(totalTime, timeUnit) ;
    summary.innerHTML += "<br>Distance: " + this.getDistanceText(totalDist, distUnit) ;
    
    table.appendChild(tbody) ;
    routePanel.appendChild(summary) ;
    routePanel.appendChild(table) ;
    return routePanel;
}
/**@private*/
OracleELocation.prototype.getStepsFromRoute = function(tbody, route, gcResult) {
  var steps = route.steps ;
  var totalTime = route.time ;
  var totalDist = route.dist ;
  var timeUnit = route.timeUnit ;
  var distUnit = route.distUnit ;
  if(steps && steps.length) {
    for(var j=0; j<steps.length; j++) {
      var step = steps[j] ;
      var tr = document.createElement("tr") ;
      var inst = document.createElement("td") ;
      inst.className = "eloc_direction_instruction" ;
      inst.innerHTML = step.inst ;
      var dist = document.createElement("td") ;
      dist.innerHTML = this.getDistanceText(step.dist, distUnit) ;
      dist.className = "eloc_direction_instruction" ;
      var time = document.createElement("td") ;
      time.innerHTML = this.getTimeText(step.time, timeUnit) ;
      time.className = "eloc_direction_instruction" ;
      tr.appendChild(inst) ;
      tr.appendChild(dist) ;
      tr.appendChild(time) ;
      tbody.appendChild(tr) ;
    }
  }
  tr = document.createElement("tr") ;
  td = document.createElement("td") ;
  td.innerHTML = "Arrive at " + this.getAddressLine(gcResult) ;
  td.className = "eloc_direction_stop" ;
  td.colSpan = 3 ;
  tr.appendChild(td) ;
  tbody.appendChild(tr) ;
}
/**@private*/
OracleELocation.prototype.getAddressLine = function(addr) {
  var result = "" ;
  if(addr.streetLine && addr.streetLine!="")
    result += addr.streetLine + ", " ;
  result += addr.localityLine ;
  return result ;
}
/**@private*/
OracleELocation.prototype.getDistanceText = function(dist, unit) {
  var result = "" ;
  unit = unit.toUpperCase() ;
  if(unit=="KM")
    dist = dist*1000 ;
  if(unit=="MILE") {
    if(dist>=1)
      result = Math.floor(dist*10)/10.0 + " mi" ;
    else if(dist>=0.2)
      result = Math.floor(dist*100)/100.0 + " mi" ;
    else
      result = Math.floor(dist * 5280) + " ft"
  }
  else {
    if(dist>=5000)
      result = Math.floor(dist*10/1000)/10.0 + " km" ;
    else if(dist>=1000)
      result = Math.floor(dist*100/1000)/100.0 + " km" ;
    else
      result = Math.floor(dist) + " m"
  }
  return result ;
}
/**@private*/
OracleELocation.prototype.getTimeText = function(time, unit) {
  var result = "" ;
  unit = unit.toUpperCase() ;
  if(unit=="HOUR")
    time = time*1.0*60 ;
  else if(unit=="SECOND")
    time = time*1.0/60 ;
    
  if(time>60) {
    result += Math.floor(time/60) + " hr" ;
    time = time - Math.floor(time/60)*60 ;
    if(time>0)
      result +=" " + Math.round(time) + " min" ;
  }
  else {
    if(time<1)
      result +=Math.round(time*60) + " sec" ;
    else    
      result +=Math.round(time) + " min" ;
  }
  return result ;
}

/**@private*/
OracleELocation.prototype.trim = function (str) {
    return str.replace(/^\s*/, "").replace(/\s*$/, "");
}

/**@private*/
OracleELocation.prototype.escapeApostrophe = function (str) {
    return str.replace(/'/, "&apos;");
}

var MVGlobal_marker_count = 0 ;
/**
  @Class This class provides a set of built-in marker styles that can be used
  directly by Oracle Maps applications to display user-defined marker features. It currently
  supports 14 different marker styles. Each style can be rendered in 5 different
  colors: red, green, blue, orange and purple.
       
  @returns None
  @type void
*/
function ELocationMarkerFactory() { /**Constructor*/ }

// Available colors
ELocationMarkerFactory.COLOR_RED = "rd" ;
ELocationMarkerFactory.COLOR_GREEN = "gr" ;
ELocationMarkerFactory.COLOR_BLUE = "bl" ;
ELocationMarkerFactory.COLOR_ORANGE = "or" ;
ELocationMarkerFactory.COLOR_PURPLE = "pr" ;

// Available builtin marker styles
ELocationMarkerFactory.STYLE_SQUARE_BUBBLE = 1 ;
ELocationMarkerFactory.STYLE_POINTER_BUBBLE = 2 ;
ELocationMarkerFactory.STYLE_DIAGONAL_SQUARE = 3 ;
ELocationMarkerFactory.STYLE_BUBBLE = 4 ;
ELocationMarkerFactory.STYLE_FLAG = 5 ;
ELocationMarkerFactory.STYLE_HEXAGON = 6 ;
ELocationMarkerFactory.STYLE_PIN_1 = 7 ;
ELocationMarkerFactory.STYLE_PIN_2 = 8 ;
ELocationMarkerFactory.STYLE_SMALL_PIN = 9 ;
ELocationMarkerFactory.STYLE_3D_CUBE = 10 ;
ELocationMarkerFactory.STYLE_SIGN_1 = 11 ;
ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1 = 12 ;
ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_2 = 13 ;
ELocationMarkerFactory.STYLE_SIGN_2 = 14 ;

//Available builtin window styles
ELocationMarkerFactory.WINDOW_STYLE_1="MVInfoWindowStyle1";
ELocationMarkerFactory.WINDOW_STYLE_2="MVInfoWindowStyle2";
ELocationMarkerFactory.WINDOW_STYLE_3="MVInfoWindowStyle3";
ELocationMarkerFactory.WINDOW_STYLE_4="MVInfoWindowStyle4";

// Marker parameters
/**@private*/
ELocationMarkerFactory.parameters = new Array() ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_3D_CUBE] = {xOffset:1, yOffset:6, textXOffset:0, textYOffset:0, preffix:"x"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_SQUARE_BUBBLE] = {xOffset:3, yOffset:-14, textXOffset:3, textYOffset:-19, preffix:"b"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_POINTER_BUBBLE] = {xOffset:9, yOffset:-15, textXOffset:8, textYOffset:-19, preffix:"c"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_DIAGONAL_SQUARE] = {xOffset:2, yOffset:-13, textXOffset:1, textYOffset:-14, preffix:"d"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_BUBBLE] = {xOffset:9, yOffset:-9, textXOffset:8, textYOffset:-14, preffix:"e"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_FLAG] = {xOffset:11, yOffset:-11, textXOffset:11, textYOffset:-20, preffix:"f"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_HEXAGON] = {xOffset:2, yOffset:-8, textXOffset:1, textYOffset:-11, preffix:"h"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_PIN_1] = {xOffset:1, yOffset:-18, textXOffset:0, textYOffset:-21, preffix:"n"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_PIN_2] = {xOffset:0, yOffset:-10, textXOffset:0, textYOffset:-23, preffix:"PIN", singleColor:true, width:70, height:70} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_SMALL_PIN] = {xOffset:2, yOffset:-16, textXOffset:3, textYOffset:-23, preffix:"PIN_sm", width:55, height:42, singleColor:true} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_SIGN_1] = {xOffset:3, yOffset:-14, textXOffset:2, textYOffset:-17, preffix:"l", textColor:"#000000"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_SIGN_2] = {xOffset:3, yOffset:-11, textXOffset:2, textYOffset:-15, preffix:"p"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_1] = {xOffset:4, yOffset:-12, textXOffset:3, textYOffset:-22, preffix:"s"} ;
ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_TRAFFIC_SIGN_2] = {xOffset:2, yOffset:-14, textXOffset:1, textYOffset:-24, preffix:"t"} ;

/**@private*/
ELocationMarkerFactory.imageBaseURL = "http://"+document.location.host+"/elocation/ajax/images/" ;

/**
  <p>This is a static method that sets the URL that points to the directory where all built-in marker images
     can be found.</p>
       
  @param {String} url url specifies the URL of the directory where the marker image files can be found.

  @returns None
  @type void
*/
ELocationMarkerFactory.setImageBaseURL = function(url) {
  if(url) {
    if(url.charAt(url.length-1)!='/')
      url += '/' ;
    ELocationMarkerFactory.imageBaseURL = url ;
  }
}
/**
  <p>This is a static method that creates a new marker feature. Here is a usage example:</p>
  <pre>
    var marker = ELocationMarkerFactory.createMarkerFeature(
                    new OM.geometry.Point(-122.5, 37.5, 8307), 
                    "5", 
                    ELocationMarkerFactory.STYLE_POINTER_BUBBLE, 
                    ELocationMarkerFactory.COLOR_PURPLE,
                    point_start_1);
    localLayer.addFeature(marker) ;
  </pre>
  
  @param {OM.geometry.Point} loc specifies the location of the marker feature.
  @param {String} text specifies the text displayed on the marker.
  @param {int} style specifies the marker style, which must be one of the 14 built-in styles.
  @param {String} color color specifies the color of the marker. It must be one of the 5 available colors.

  @returns A OM.Feature object.
  @type OM.Feature
*/
ELocationMarkerFactory.createMarkerFeature = function(loc, text, style, color, id) {
  if(!style)
    style = ELocationMarkerFactory.STYLE_SIGN_2 ;
  if(!color)
    color = ELocationMarkerFactory.COLOR_RED ;
    
  var par = ELocationMarkerFactory.parameters[style] ;
  if(!par)
    par = ELocationMarkerFactory.parameters[ELocationMarkerFactory.STYLE_SIGN_2] ;
  if(par.singleColor)
    color = "" ;
  else
    color = color + "_";
  var fillColor = "#ffffff";
  if(par.textColor)
    fillColor = par.textColor ;
  var imgURL = ELocationMarkerFactory.imageBaseURL + par.preffix + "_"  + color ;
  if(!id)
    id = "_ELOCATIONMARKER_" + MVGlobal_marker_count ;
  var w = 50 ;
  if(par.width)
    w = par.width ;
  var h = 50 ;
  if(par.height)
    h = par.height ;
  
  var markerStyle = new OM.style.Marker({width:w, height:h, src:imgURL+"ena.png", xOffset:par.xOffset, yOffset:par.yOffset,
            textStyle:{fill:fillColor, fontWeight:OM.Text.FONTWEIGHT_BOLD, fontFamily:"Tahoma", fontSize:13},
            textOffset:{x:par.textXOffset, y:par.textYOffset}});
  var feature = new OM.Feature(id, loc, {renderingStyle:markerStyle}) ;

  var markerOverStyle = new OM.style.Marker({width:w, height:h, src:imgURL+"ovr.png", xOffset:par.xOffset, yOffset:par.yOffset,
            textStyle:{fill:fillColor, fontWeight:OM.Text.FONTWEIGHT_BOLD, fontFamily:"Tahoma", fontSize:13},
            textOffset:{x:par.textXOffset, y:par.textYOffset}});
  function mouseOver(evt) {
      evt.target.setRenderingStyle(markerOverStyle);
  }
  function mouseOut(evt) {
      evt.target.setRenderingStyle(markerStyle);
  }
  feature.addListener(OM.event.MouseEvent.MOUSE_OVER, mouseOver);
  feature.addListener(OM.event.MouseEvent.MOUSE_OUT, mouseOut);

  feature.setMarkerText(text);
  MVGlobal_marker_count++ ;
  
  return feature ;
}
/**@private*/
ELocationMarkerFactory.getFilter = function(img) {
  var filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + 
               img + '",sizingMethod="scale");'
  return filter ;
}
/**@private*/
ELocationMarkerFactory.shouldUseDIVFilter = false ;
if((navigator && navigator.userAgent && navigator.userAgent.toLowerCase)) {
  var agent = navigator.userAgent.toLowerCase();
  if(agent.indexOf('msie') >=0) {
    var rv = -1; // Return value assumes failure
    if (navigator.appName == 'Microsoft Internet Explorer') {
      var ua = agent.toUpperCase();
      var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
      if (re.exec(ua) != null) {
        rv = parseFloat( RegExp.$1 );
      }
    }
    if (rv <= 6)
      ELocationMarkerFactory.shouldUseDIVFilter = true ;
  }
}
/**@private*/
OracleELocation.localDomain = document.location.host;
/**@private*/
OracleELocation.isLocalDomain = function (url) {
    url = OracleELocation.strTrim(url);
    if (url.toLowerCase().indexOf("http://") == 0 || url.toLowerCase().indexOf("https://") == 0) {
        return (OracleELocation.localDomain == OracleELocation.getDomain(url));
    }
    else 
        return true;
}
/**@private*/
OracleELocation.getDomain = function (url) {
    if (!url)
        return null;
    var sidx = url.indexOf("://");
    if (sidx > 0) {
        sidx += 3;
        var eidx = url.indexOf("/", sidx);
        if (eidx > 0)
            return url.substring(sidx, eidx);
        else 
            return url.substring(sidx);
    }
    else 
        return null;
}
/**@private*/
OracleELocation.strTrim = function (str) {
    return str.replace(/(^[\s]*)|([\s]*$)/g, "");
}
/**@private*/
OracleELocation.replaceTimePlaceholder = function (str, replacement) {
    return str.replace(/\{time\}/gim, replacement);
}
/**@private*/
OracleELocation.replaceDistancePlaceholder = function (str, replacement) {
    return str.replace(/\{distance\}/gim, replacement);
}
/**@private*/
OracleELocation.replaceTooltipPlaceholder = function (str, replacement) {
    return str.replace(/\{[\w\. \(\)-:]*_TOOLTIP\}/im, replacement);
}
/**@private*/
OracleELocation.replaceStylePlaceholder = function (str, replacement) {
    return str.replace(/\{[\w\. \(\)-:]*_STYLE\}/im, replacement);
}
 /**@private*/
function checkLatLon(address) {
    if (address.lon) {
        return address;
    }
    else {
        //Check if address is a signed lon/lat degree, minute, second address
        var matches = LON_LAT_SIGNED_DMS_REGEX.exec(address);
        if (matches == null) {
            //Check if address is a lon/lat degree, minute, second address pointing North, South, East, West
            matches = LON_LAT_DMS_REGEX.exec(address);
            if (matches == null) {
                //Check if address is a lon/lat decimal address
                matches = LON_LAT_DECIMAL_REGEX.exec(address);
                if (matches == null) {
                    return address;
                }
                else {
                    //positions 1 and 3 from matches
                    var newAddress = new Object();
                    newAddress.lon = matches[1];
                    newAddress.lat = matches[3];
                    return newAddress;
                }
            }
            else {
                //Convert to decimal lon/lat value
                //Take 1, 2, 3 and 5(direction) for lon. Take 6, 7, 8 and 10(direction) for lat.
                var coordinates = dmsToDecimal(matches[6],matches[7],matches[8],matches[1],matches[2],matches[3]);
                if (coordinates != null && coordinates.length>0) {
                    var latSign = (matches[10] == 'S' || matches[10] == 's')? -1 : 1;
                    var lonSign = (matches[5] == 'W' || matches[5] == 'w')? -1 : 1;
                    var newAddress = new Object();
                    newAddress.lat = coordinates[0] * latSign;
                    newAddress.lon = coordinates[1] * lonSign;
                    return newAddress;
                }
                else {
                    return address;
                }
            }
        }
        else {
            //Convert to decimal lon/lat value
            //Take 1, 2, and 3 values for lon. Take 5, 6 and 7 for lat
            var coordinates = dmsToDecimal(matches[5],matches[6],matches[7],matches[1],matches[2],matches[3]);
                if (coordinates != null && coordinates.length>0) {
                    var newAddress = new Object();
                    newAddress.lat = coordinates[0];
                    newAddress.lon = coordinates[1];
                    return newAddress;
                }
                else {
                    return address;
                }
        }
    }
}

/**
 * Converts the given latitude/longitude degrees, minutes and seconds to its
 * corresponding decimal value
 * @param latDegrees Latitude degrees
 * @param latMinutes Latitude minutes
 * @param latSeconds Latitude seconds
 * @param lonDegrees Longitude degrees
 * @param lonMinutes Longitude minutes
 * @param lonSeconds Longitude seconds
 * @return A decimal representation of input degrees, minutes and seconds, or null if the input values are out of range
 * @private
 */
function dmsToDecimal(latDegrees, latMinutes, latSeconds, lonDegrees, lonMinutes, lonSeconds) {
    var bigNumber = 1000000.0;
    var latsign = 1;
    var lonsign = 1;
    var absdlat = 0;
    var absdlon = 0;
    var absmlat = 0;
    var absmlon = 0;
    var absslat = 0;
    var absslon = 0;
    var coordinates = new Array();

    if (latDegrees < 0) {
        latsign =  - 1;
    }
    //Store absolute value of degrees, minutes and seconds as big integers for
    //decimal precision
    absdlat = Math.abs(Math.round(latDegrees * bigNumber));
    absmlat = Math.abs(Math.round(latMinutes * bigNumber));
    latSeconds = Math.abs(Math.round(latSeconds * bigNumber) / bigNumber);
    absslat = Math.abs(Math.round(latSeconds * bigNumber));

    if (lonDegrees < 0) {
        lonsign =  - 1;
    }
    //Store absolute value of degrees, minutes and seconds as big integers for
    //decimal precision
    absdlon = Math.abs(Math.round(lonDegrees * bigNumber));
    absmlon = Math.abs(Math.round(lonMinutes * bigNumber));
    lonSeconds = Math.abs(Math.round(lonSeconds * bigNumber) / bigNumber);
    absslon = Math.abs(Math.round(lonSeconds * bigNumber));

    //If input values exceed limits, null is returned as coordinates
    if (absdlat > (90 * bigNumber) || absmlat >= (60 * bigNumber) || absslat > (59.99999999 * bigNumber) || absdlon > (180 * bigNumber) || absmlon >= (60 * bigNumber) || absslon > (59.99999999 * bigNumber)) {
        //Null will be returned since coordinates are invalid
    }
    else {
        //Add degrees, minutes and seconds and divide by the big Integer used
        //at the begining
        coordinates[0] = Math.round(absdlat + (absmlat / 60) + (absslat / 3600)) * latsign / bigNumber;
        coordinates[1] = Math.round(absdlon + (absmlon / 60) + (absslon / 3600)) * lonsign / bigNumber;
    }
    return coordinates;
}