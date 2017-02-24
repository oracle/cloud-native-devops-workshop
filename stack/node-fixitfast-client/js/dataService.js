/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

// handles ajax calls to RESTful APIs

'use strict';
define(['jquery'], function ($) {

  var rest_fixit = httpGet(location.protocol + '//' + window.location.hostname + '/env/REST_FIXIT');
  var rest_customers = httpGet(location.protocol + '//' + window.location.hostname + '/env/REST_CUSTOMERS');
  var baseUrl = rest_fixit + '/';
  var customersUrl = rest_customers + '/';

  console.log('base rest URL: ' + baseUrl);
  console.log('customers rest URL: ' + customersUrl);

  var baseHeaders;
  var localUrl = 'localData/';
  var isOnline = true;

  function httpGet(theUrl)
  {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
	xmlHttp.send( null );
	return xmlHttp.responseText;
  }

  function setOnlineMode(mode) {
    isOnline = mode;
  }

  function getCustomers() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: customersUrl + 'customers'
      });
    else {
      return $.ajax(localUrl + 'customers.txt');
    }
  }

  function createCustomer(customer) {
    return $.ajax({
      type: 'POST',
      headers: baseHeaders,
      data: JSON.stringify(customer),
      url: baseUrl + 'customers',
      contentType: 'application/json; charset=UTF-8'
    });
  }

  function updateCustomer(id, customer) {
    return $.ajax({
      type: 'PATCH',
      headers: baseHeaders,
      data: JSON.stringify(customer),
      url: baseUrl + 'customers/' + id,
      contentType: 'application/json; charset=UTF-8'
    });
  }

  function getCustomer(id) {
    if(id) {
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: customersUrl + 'customers/' + id
        });
      } else {

        var promise = new Promise(function(resolve, reject){
          $.get(localUrl + 'customers.txt').done(function(response) {
            var customers = JSON.parse(response).result;
            var customer = customers.filter(function(customer) { return customer.id === id; });
            resolve(JSON.stringify(customer[0]));
          }).fail(function(response){
            reject(response);
          });
        });

        return promise;
      }
    }

    return $.when(null);
  }

  function getIncidents() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'incidents?technician=~'
      });
    else {
      return $.get(localUrl + 'incidents.txt');
    }
  }

  function getIncidentsStats() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'stats/incidents?technician=~'
      });
    else {
      return $.get(localUrl + 'incidentsStats.txt');
    }
  }

  function getIncidentsHistoryStats() {
    if(isOnline) {
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'stats?technician=~&period=annual'
      });
    } else {
      return $.get(localUrl + 'incidentsHistoryStats.txt');
    }
  }

  function createIncident(incident) {
    return $.ajax({
      type: 'POST',
      headers: baseHeaders,
      url: baseUrl + 'incidents',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(incident)
    });
  }

  function getIncident(id) {
    if(id)
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'incidents/' + id
        });
      } else {
        return $.get(localUrl + 'incidents/' + id + '.txt');
      }

    return $.when(null);
  }

  function updateIncident(id, incident) {
    if(id)
      return $.ajax({
        type: 'PUT',
        headers: baseHeaders,
        url: baseUrl + 'incidents/' + id,
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(incident)
      });
    return $.when(null);
  }

  function getIncidentActivities(id) {
    if(id) {
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'incidents/' + id + '/activities'
        });
      } else {
        return $.get(localUrl + 'incidents/' + id + '/activities.txt');
      }
    }
  }

  function postIncidentActivity(id, comment, picture) {
    if(id && comment) {

      var activity = { comment: comment, picture: picture };

      return $.ajax({
        type: 'POST',
        headers: baseHeaders,
        url: baseUrl + 'incidents/' + id + '/activities',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(activity)
      });
    } else {
      return $.when(null);
    }
  }

  function updateIncidentActivity(id, actid, content) {
    if(id && actid && content)
      return $.ajax({
        type: 'PATCH',
        headers: baseHeaders,
        url: baseUrl + 'incidents/' + id + '/activities/' + actid,
        data: JSON.stringify(content),
        contentType: 'application/json; charset=UTF-8'
      });
    else
      return $.when(null);
  }

  function getLocation(id) {
    if(id) {
      if(isOnline) {
        return $.ajax({
          type: 'GET',
          headers: baseHeaders,
          url: baseUrl + 'locations/' + id
        });
      } else {

        var promise = new Promise(function(resolve, reject){
          $.get(localUrl + 'locations.txt').done(function(response) {
            var locations = JSON.parse(response);
            var location = locations.filter(function(location) { return location.id === id; });
            resolve(JSON.stringify(location[0]));
          }).fail(function(response){
            reject(response);
          });
        });

        return promise;
      }

    } else {
      return $.when(null);
    }

  }

  function getUserProfile() {
    if(isOnline)
      return $.ajax({
        type: 'GET',
        headers: baseHeaders,
        url: baseUrl + 'users/~'
      });
    else {
      return $.get(localUrl + 'users.txt');
    }
  }

  function updateUserProfile(user) {
    return $.ajax({
      type: 'PATCH',
      headers: baseHeaders,
      url: baseUrl + 'users/~',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(user)
    });
  }

  return {
    getCustomers: getCustomers,
    createCustomer: createCustomer,
    updateCustomer: updateCustomer,
    getCustomer: getCustomer,
    getIncidents: getIncidents,
    getIncidentsStats: getIncidentsStats,
    getIncidentsHistoryStats: getIncidentsHistoryStats,
    createIncident: createIncident,
    getIncident: getIncident,
    updateIncident: updateIncident,
    getIncidentActivities: getIncidentActivities,
    postIncidentActivity: postIncidentActivity,
    updateIncidentActivity: updateIncidentActivity,
    getLocation: getLocation,
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile,
    setOnlineMode: setOnlineMode
  };

});
