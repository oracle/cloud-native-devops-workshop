var path = require('path');
var db = require(resolvePath("app/database.js"));
var constants = require(resolvePath("constants"));
var CONTEXT_ROOT = constants.CONTEXT_ROOT ? constants.CONTEXT_ROOT : '';
var QP_TECHNICIAN = "technician";

module.exports = function (api)
{

  // TODO: NEed a way to use JSON Schema to return exact response so we don't send extra info
  var _AUTHENTICATED_USER = 'hcr';

  // Simple cloner of objects
  var _cloneObject = function (response)
  {
    return JSON.parse(JSON.stringify(response));
  };

  var _buildAuthUserProfileResponse = function (technician)
  {
    var technicianResult = technician;

    var value = technician["photo"];
    if (value)
    {
      var base64 = db.getPhoto(value);
      // add base64 encoding prefix, for html encoded images
      technicianResult["photo"] = "data:image/png;base64," + base64;

    }
    var locationId = technician.locationId;

    // fetch customer address info and update result
    technicianResult.location = db.getLocation(locationId);

    return technicianResult;
  };

  var _buildAuthUserPersonResponse = function (technician)
  {
    // TODO we should be reading from schema here
    var personResponse = {
      "username": "",
      "firstName": "",
      "lastName": "",
      "email": "",
      "mobile": "",
      "photo": ""
    };
    var props = Object.keys(personResponse);
    for (var i = 0; i < props.length; i++)
    {
      var prop = props[i];
      var value = technician[prop];
      if (prop === "photo")
      {
        var base64 = db.getPhoto(value);
        // add base64 encoding prefix, for html encoded images

        // add base64 encoding prefix, for html encoded images
        value = "data:image/png;base64," + base64;

      }
      personResponse[prop] = value;
    }

    return personResponse;
  };

  var _buildIncidentResponse = function (incident)
  {

    var incidentResult = incident;
    var customerId = incident.customerId;
    var locationId = incident.locationId;

    // TODO: NEed a way to use JSON Schema to return exact response so we don't send extra info

    // fetch customer info
    incidentResult.customer = db.getCustomerById(customerId);

    // fetch location info and update result
    var dbLocation = db.getLocation(locationId) || {};

    var incidentLocation = {};
    incidentLocation.formattedAddress = dbLocation.formattedAddress;
    incidentLocation.latitude = dbLocation.latitude;
    incidentLocation.longitude = dbLocation.longitude;
    incidentLocation.id = dbLocation.id;
    incidentResult.location = incidentLocation;

    return incidentResult;
  };

  var _buildCustomerResponse = function (customer)
  {

    var customerResult = customer;
    var locationId = customer.locationId;

    // TODO: NEed a way to use JSON Schema to return exact response so we don't send extra info

    // fetch customer address info and update result
    customerResult.address = db.getLocation(locationId);

    return customerResult;
  };

  var _buildIncidentActivityResponse = function (activity)
  {
    var activityResult = {};
    var customerId = activity.customerId;

    var technicianUsername = activity._technicianUsername;

    // activity record can have either customerId or technicianUsername. not both
    var user = technicianUsername ? db.getTechnicianByUsername(technicianUsername) :
      (customerId ? db.getCustomerById(customerId) : null);

    if (user)
    {
      activityResult.firstName = user.firstName;
      activityResult.lastName = user.lastName;
    }

    // fetch location info and update result
    activityResult.createdOn = activity.createdOn;
    activityResult.comment = activity.comment;
    activityResult.picture = activity.picture;

    if (user.photo)
    {
      var base64 = db.getPhoto(user.photo);
      // add base64 encoding prefix, for html encoded images

      // add base64 encoding prefix, for html encoded images
      var value = "data:image/png;base64," + base64;
      activityResult.photo = value;
    }

    return activityResult;
  };

  /**
   * Returns the parsed value for all '/incidents' query parameters.
   * @param {string} name of param
   * @param {string} value value of query param
   * @private
   */
  var _getIncidentsQueryParam = function (name, value)
  {
    var ret = undefined;

    switch (name)
    {
      case QP_TECHNICIAN:
        var techUsername;
        if (value && typeof value === "string")
        {
          // According to service api, queryParameter can be either string '~' or an integer technician id.
          if (value === "~")
          {
            // hardcode '~' to _AUTHENTICATED_USER; we don't have an authenticated user in mock.
            techUsername = _AUTHENTICATED_USER;
          }
          else
          {
            techUsername = value;
          }
        }

        ret = techUsername;
        break;

      default:
        ret = undefined;
    }

    return ret;
  };

  // INCIDENTS ENDPOINTS
  /**
   * Return incidents response.
   */
  api.get(CONTEXT_ROOT + '/incidents', function (req, res)
  {
    var response = {};
    var incidents = null,
      incident = null,
      technicianUsername = null;

    if (req.query[QP_TECHNICIAN])
    {
      technicianUsername = _getIncidentsQueryParam(QP_TECHNICIAN, _mapUsername(req.query[QP_TECHNICIAN]));
      incidents = db.getWIPIncidentsForTechnician(technicianUsername);
    }
    else
    {
      res.status(400).send("A required query parameter '" + QP_TECHNICIAN + "' was not specified for this request.");
      return;
    }

    // package Incidents response
    response.count = incidents.length;
    response.result = [];

    for (var i = 0; i < incidents.length; i++)
    {

      incident = incidents[i];
      response.result.push(_buildIncidentResponse(incident));
    }
    res.status(200).send(JSON.stringify(response));
  });

  /**
   * Creates an incident record and assigns to the current technician if a technician is not provided.
   */
  api.post(CONTEXT_ROOT + '/incidents', function (req, res)
  {
    var obj = req.body;

    //console.log("updateIncident action called id = " + id + " body = " + obj);

    var patchedIncident = db.createIncident(obj);

    if (!patchedIncident)
    {
      res.status(404).send("An incident with problem '" + obj.problem + "' was not created");
    }
    else
    {
      var result = _buildIncidentResponse(patchedIncident);
      res.status(200).send(JSON.stringify(result));
    }
  });

  // INCIDENT ENDPOINTS
  api.get(CONTEXT_ROOT + '/incidents/:id', function (req, res)
  {
    //console.log(req.originalUrl);

    var id = req.params.id;
    var incident = db.getIncidentById(id);
    if (incident)
    {
      var result = _buildIncidentResponse(incident);
      res.status(200).send(JSON.stringify(result));
    }
    else
    {
      res.status(404).send("incident " + id + " not found!");
    }
  });

  api.delete(CONTEXT_ROOT + '/incidents/:id', function (req, res)
  {
    //console.log(req.originalUrl);

    var id = req.params.id;
    var incident = db.getIncidentById(id);
    if (incident)
    {
      var data = {};
      var deleted = db.closeIncident(id, data);
      if (deleted)
      {
        res.status(204).send("The incident has been deleted successfully");
      }
      else
      {
        res.status(404).send("incident " + id + " not found or it has been deleted already!");
      }
    }
    else
    {
      res.status(404).send("incident " + id + " not found!");
    }
  });

  api.post(CONTEXT_ROOT + '/incidents/:id/closeIncident', function (req, res)
  {
    var id = req.params.id;
    var obj = req.body;

    // console.log("PUT Incident action called id = " + id + " body = " + JSON.stringify(obj));

    var closedIncident = db.closeIncident(id, obj);

    if (closedIncident)
    {
      res.status(204).send("The incident has been closed successfully");
    }
    else
    {
      res.status(404).send("incident " + id + " not found!");
    }
  });

  api.put(CONTEXT_ROOT + '/incidents/:id', function (req, res)
  {
    var id = req.params.id;
    var obj = req.body;

    // console.log("PUT Incident action called id = " + id + " body = " + JSON.stringify(obj));

    var patchedIncident = db.updateIncident(id, obj);

    if (!patchedIncident)
    {
      res.status(404).send("An incident with the id '" + id + "' was not found");
    }
    else
    {
      var result = _buildIncidentResponse(patchedIncident);
      res.status(200).send(JSON.stringify(result));
    }
  });

  api.get(CONTEXT_ROOT + '/incidents/:id/activities', function (req, res)
  {
    var id = req.params.id;

    var activities = db.getIncidentActivities(id);
    var activity;
    var response = [];
    if (activities)
    {
      for (var i = 0; i < activities.length; i++)
      {

        activity = activities[i];
        response.push(_buildIncidentActivityResponse(activity));
      }
      res.status(200).send(JSON.stringify(response));
    }
    else
    {
      res.status(404).send("unable to locate incident " + id + " not found!");
    }
  });

  api.post(CONTEXT_ROOT + '/incidents/:id/activities', function (req, res)
  {
    var id = req.params.id;
    var newActivity = null;
    var comment = req.body.comment;

    console.log("POST activity comment: " + comment);

    if (comment)
    {
      // form data comes as encoded url params
      newActivity = db.createIncidentActivity(id, comment, _AUTHENTICATED_USER);
    }

    if (!newActivity)
    {
      res.status(400).send("A comment was not specified for the incident.");
    }
    else
    {
      var result = _buildIncidentActivityResponse(newActivity);
      res.status(201).send(JSON.stringify(result));
    }
  });

  // CUSTOMERS ENDPOINTS
  /**
   * Return customers response.
   */
  api.get(CONTEXT_ROOT + '/customers', function (req, res)
  {
    //console.log(req.originalUrl);

    var response = {};
    var customers = db.getCustomers();
    // package customers response

    response.count = customers.length;
    response.result = [];

    for (var i = 0; i < customers.length; i++)
    {

      var customer = _cloneObject(customers[i]);
      response.result.push(_buildCustomerResponse(customer));
    }

    res.status(200).send(JSON.stringify(response));
  });

  api.post(CONTEXT_ROOT + '/customers', function (req, res)
  {
    var response = {};
    var postBody = req.body;

    var newCustomer = _cloneObject(db.createCustomer(postBody));
    if (!newCustomer)
    {
      res.status(404).send("A customer could not be created");
    }
    else
    {
      var result = _buildCustomerResponse(newCustomer);
      // Unclear how we would set headers.
      // res.headers['Location'] = "/" + result.id;
      res.status(201).send(JSON.stringify(result));
    }
  });

  // CUSTOMER ENDPOINTS
  api.get(CONTEXT_ROOT + '/customers/:id', function (req, res)
  {
    //console.log(req.originalUrl);

    var id = req.params && req.params.id;

    // for BETA: always return a customer for this case
    // todo: we may want to remove this after OOW/BETA, and provide a different API?
    var cust = db.getCustomerById(id) || db.getCustomers()[0];

    var customer = _cloneObject(cust);
    if (customer)
    {
      var result = _buildCustomerResponse(customer);
      res.status(200).send(JSON.stringify(result));
    }
    else
    {
      res.status(404).send("customer with id '" + id + "' not found!");
    }
  });

  api.patch(CONTEXT_ROOT + '/customers/:id', function (req, res)
  {
    var id = req.params.id;
    var obj = req.body;

    //console.log("updateIncident action called id = " + id + " body = " + obj);

    var patchedCustomer = db.updateCustomer(id, obj);

    if (!patchedCustomer)
    {
      res.status(404).send("An incident with the id '" + id + "' was not found");
    }
    else
    {
      var result = _buildCustomerResponse(patchedCustomer);
      res.status(200).send(JSON.stringify(result));
    }
  });

  // TECHNICIAN PROFILE
  api.get(CONTEXT_ROOT + '/users/~', function (req, res)
  {
    // TODO need to build a mock security implementation for the authenticated user.

    var tech = _cloneObject(db.getTechnicianByUsername(_AUTHENTICATED_USER));
    if (tech)
    {
      var result = _buildAuthUserProfileResponse(tech);
      res.status(200).send(JSON.stringify(result));
    }
    else
    {
      res.status(404).send("user profile cannot be located!");
    }
  });

  api.patch(CONTEXT_ROOT + '/users/~', function (req, res)
  {
    var id = _AUTHENTICATED_USER;
    var obj = req.body;

    //console.log("updateUser action called id = " + id + " body = " + obj);

    var technician = _cloneObject(db.updateTechnician(id, obj));
    if (!technician)
    {
      res.status(404).send("user profile not found");
    }
    else
    {
      var response = _buildAuthUserProfileResponse(technician);
      res.status(200).send(JSON.stringify(response));
    }
  });

  // STATS ENDPOINTS
  api.get(CONTEXT_ROOT + '/stats', function (req, res)
  {
    var qp = req.query;
    var response = {};
    var period = "annual";

    if (qp && qp.period)
    {
      var _valid_periods = ["annual", "semi", "quarter"];

      if (_valid_periods.indexOf(qp.period) > -1)
      {
        period = qp.period;
      }
    }
    if (qp && qp[QP_TECHNICIAN])
    {
      var tech = db.getTechnicianByUsername(_mapUsername(qp[QP_TECHNICIAN]));
      // TODO: hardcoded data for now.
      response.metrics = db.getStats(period, tech);
      res.status(200).send(JSON.stringify(response));
    }
    else
    {
      res.status(400).send("A required query parameter '" + QP_TECHNICIAN + "' was not specified for this request.");
    }
  });

  api.get(CONTEXT_ROOT + '/stats/incidents', function (req, res)
  {
    var qp = req.query;
    var incidentStats = null;

    if (qp && qp[QP_TECHNICIAN])
    {
      var technicianUsername = _getIncidentsQueryParam(QP_TECHNICIAN, _mapUsername(qp[QP_TECHNICIAN]));
      incidentStats = db.getIncidentsStats(technicianUsername);
    }
    else
    {
      res.status(400).send("A required query parameter '" + QP_TECHNICIAN + "' was not specified for this request.");
      return;
    }

    // package incidentsStats response
    var groups = Object.keys(incidentStats || {});
    var response = {incidentCount: {"high": 0, "normal": 0, "low": 0}};

    var groupName = "";
    var groupCount = 0;
    var ic = response.incidentCount;
    for (var i = 0; i < groups.length; i++)
    {
      groupName = groups[i];
      groupCount = incidentStats[groupName].length;
      groupCount = incidentStats[groupName].length;

      ic[groupName] = groupCount;
    }
    //console.log(response);
    res.status(200).send(JSON.stringify(response));

  });

  api.get(CONTEXT_ROOT + '/stats/technician', function (req, res)
  {
    var qp = req.query;

    var period = "semi";

    if (qp && qp.period)
    {
      var _valid_periods = ["annual", "semi", "quarter"];

      if (_valid_periods.indexOf(qp.period) > -1)
      {
        period = qp.period;
      }
    }

    var tech = db.getTechnicianByUsername(_AUTHENTICATED_USER);
    if (tech)
    {
      var personResponse = _buildAuthUserPersonResponse(tech);
    }

    /*
     // alternate collectionModel needs to be tested
     var _TECHNICIAN_STATS = {
     "timeSlice": "month",
     "technician": personResponse,
     "stats":
     {
     "timeSlice": ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
     "technician": [12, 10, 8, 4, 0, 9, 13, 8, 5, 9, 10, 11],
     "average": [11, 8, 15, 14, 17, 9, 14, 10, 15, 11, 11, 10]
     }
     */

    // TODO: hardcoded data for now.
    var metrics = db.getTechnicianPerformanceData(period);
    var response = {
      dateDimension: "month",
      technician: personResponse,
      metrics: metrics.slice()
    };

    res.status(200).send(JSON.stringify(response));
  });

  /*
   api.get(CONTEXT_ROOT + '/stats/technician/:seq', function (req, res) {

   var seq = req.params.seq;

   if (!seq)
   {
   res.status(404).send("A required parameter 'seq' was not specified for this request.");
   }
   else
   {
   var result = db.getTechnicianPerformanceMetric(seq);
   res.status(200).send(JSON.stringify(result));
   }
   });
   */

  // LOCATIONS ENDPOINTS
  api.get(CONTEXT_ROOT + '/locations/:id', function (req, res)
  {
    var qp = req.params;
    var location;

    if (qp && qp.id)
    {
      location = db.getLocation(qp.id);
    }
    else
    {
      res.status(400).send("A location 'id' was not specified for this request.");
    }

    if (location)
    {
      res.status(200).send(JSON.stringify(location));
    }
    else
    {
      res.status(404).send("location data cannot be located!");
    }
  });

  /*

   NOTE: Commented for beta

   // STORAGE ENDPOINTS
   api.delete(CONTEXT_ROOT + '/storage', function (req, res)
   {
   db.resetStorage();

   res.status(200).send(JSON.stringify({ success: true }));
   });

   api.get(CONTEXT_ROOT + '/storage/collections/objects/:object', function (req, res)
   {
   var id = req.params.object;
   var obj = db.getCollectionObject(id);

   res.status(200).send(JSON.stringify(obj));
   });

   api.put(CONTEXT_ROOT + '/storage/collections/objects/:object', function (req, res)
   {
   var id = req.params.object;
   var obj = req.body;

   //console.log("updateCollectionObject action called id = " + id + " body = " + obj);

   var response = db.updateCollectionObject(id, obj);

   if (response === null)
   {
   res.status(404).send(id + " not found");
   }
   else
   {
   res.status(204).send(JSON.stringify(response));
   }
   });

   */


};

function resolvePath(filePath)
{
  return path.resolve(__dirname, filePath);
}


/**
 * we changed the Companion app, and this service, to use a real username instead of '1',
 * so we need to support both, so old Companion MAX Appsd work with the new service
 */
function _mapUsername(username)
{
  if (username === '1')
  {
    //console.log('mapping user: ' + username);
    username = 'hcr';
  }
  return username;
}
