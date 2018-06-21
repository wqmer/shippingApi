(function() {
  var LasershipClient, ShipperClient, find, moment, titleCase,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  find = require('underscore').find;

  moment = require('moment-timezone');

  titleCase = require('change-case').titleCase;

  ShipperClient = require('./shipper').ShipperClient;

  LasershipClient = (function(_super) {
    var STATUS_MAP;

    __extends(LasershipClient, _super);

    function LasershipClient(options) {
      this.options = options;
      LasershipClient.__super__.constructor.apply(this, arguments);
    }

    LasershipClient.prototype.validateResponse = function(response, cb) {
      response = JSON.parse(response);
      if (response['Events'] == null) {
        return cb({
          error: 'missing events'
        });
      }
      return cb(null, response);
    };

    LasershipClient.prototype.presentAddress = function(address) {
      var city, countryCode, postalCode, stateCode;
      city = address['City'];
      stateCode = address['State'];
      postalCode = address['PostalCode'];
      countryCode = address['Country'];
      return this.presentLocation({
        city: city,
        stateCode: stateCode,
        countryCode: countryCode,
        postalCode: postalCode
      });
    };

    STATUS_MAP = {
      'Released': ShipperClient.STATUS_TYPES.DELIVERED,
      'Delivered': ShipperClient.STATUS_TYPES.DELIVERED,
      'OutForDelivery': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'Arrived': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Received': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'OrderReceived': ShipperClient.STATUS_TYPES.SHIPPING,
      'OrderCreated': ShipperClient.STATUS_TYPES.SHIPPING
    };

    LasershipClient.prototype.presentStatus = function(eventType) {
      if (eventType != null) {
        return STATUS_MAP[eventType];
      }
    };

    LasershipClient.prototype.getActivitiesAndStatus = function(shipment) {
      var activities, activity, dateTime, details, location, rawActivities, rawActivity, status, timestamp, _i, _len, _ref;
      activities = [];
      status = null;
      rawActivities = shipment != null ? shipment['Events'] : void 0;
      _ref = rawActivities || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rawActivity = _ref[_i];
        location = this.presentAddress(rawActivity);
        dateTime = rawActivity != null ? rawActivity['DateTime'] : void 0;
        if (dateTime != null) {
          timestamp = moment("" + dateTime + "Z").toDate();
        }
        details = rawActivity != null ? rawActivity['EventShortText'] : void 0;
        if ((details != null) && (timestamp != null)) {
          activity = {
            timestamp: timestamp,
            location: location,
            details: details
          };
          activities.push(activity);
        }
        if (!status) {
          status = this.presentStatus(rawActivity != null ? rawActivity['EventType'] : void 0);
        }
      }
      return {
        activities: activities,
        status: status
      };
    };

    LasershipClient.prototype.getEta = function(shipment) {
      if ((shipment != null ? shipment['EstimatedDeliveryDate'] : void 0) == null) {
        return;
      }
      return moment("" + shipment['EstimatedDeliveryDate'] + "T00:00:00Z").toDate();
    };

    LasershipClient.prototype.getService = function(shipment) {};

    LasershipClient.prototype.getWeight = function(shipment) {
      var piece, units, weight, _ref;
      if (!(shipment != null ? (_ref = shipment['Pieces']) != null ? _ref.length : void 0 : void 0)) {
        return;
      }
      piece = shipment['Pieces'][0];
      weight = "" + piece['Weight'];
      units = piece['WeightUnit'];
      if (units != null) {
        weight = "" + weight + " " + units;
      }
      return weight;
    };

    LasershipClient.prototype.getDestination = function(shipment) {
      var destination;
      destination = shipment != null ? shipment['Destination'] : void 0;
      if (destination == null) {
        return;
      }
      return this.presentAddress(destination);
    };

    LasershipClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "http://www.lasership.com/track/" + trackingNumber + "/json"
      };
    };

    return LasershipClient;

  })(ShipperClient);

  module.exports = {
    LasershipClient: LasershipClient
  };

}).call(this);
