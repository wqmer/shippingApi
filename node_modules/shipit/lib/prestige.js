(function() {
  var PrestigeClient, ShipperClient, moment, reduce, titleCase,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  reduce = require('underscore').reduce;

  moment = require('moment-timezone');

  titleCase = require('change-case').titleCase;

  ShipperClient = require('./shipper').ShipperClient;

  PrestigeClient = (function(_super) {
    var ADDR_ATTRS, STATUS_MAP;

    __extends(PrestigeClient, _super);

    function PrestigeClient(options) {
      this.options = options;
      PrestigeClient.__super__.constructor.apply(this, arguments);
    }

    PrestigeClient.prototype.validateResponse = function(response, cb) {
      response = JSON.parse(response);
      if (!(response != null ? response.length : void 0)) {
        return cb({
          error: 'no tracking info found'
        });
      }
      response = response[0];
      if (response['TrackingEventHistory'] == null) {
        return cb({
          error: 'missing events'
        });
      }
      return cb(null, response);
    };

    ADDR_ATTRS = ['City', 'State', 'Zip'];

    PrestigeClient.prototype.presentAddress = function(prefix, event) {
      var address, city, postalCode, stateCode;
      if (event == null) {
        return;
      }
      address = reduce(ADDR_ATTRS, (function(d, v) {
        d[v] = event["" + prefix + v];
        return d;
      }), {});
      city = address['City'];
      stateCode = address['State'];
      postalCode = address['Zip'];
      return this.presentLocation({
        city: city,
        stateCode: stateCode,
        postalCode: postalCode
      });
    };

    STATUS_MAP = {
      301: ShipperClient.STATUS_TYPES.DELIVERED,
      302: ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      101: ShipperClient.STATUS_TYPES.SHIPPING
    };

    PrestigeClient.prototype.presentStatus = function(eventType) {
      var codeStr, eventCode, status, _ref;
      codeStr = (_ref = eventType.match('EVENT_(.*)$')) != null ? _ref[1] : void 0;
      if (!(codeStr != null ? codeStr.length : void 0)) {
        return;
      }
      eventCode = parseInt(codeStr);
      if (isNaN(eventCode)) {
        return;
      }
      status = STATUS_MAP[eventCode];
      if (status != null) {
        return status;
      }
      if (eventCode < 300 && eventCode > 101) {
        return ShipperClient.STATUS_TYPES.EN_ROUTE;
      }
    };

    PrestigeClient.prototype.getActivitiesAndStatus = function(shipment) {
      var activities, activity, dateTime, details, location, rawActivities, rawActivity, status, timestamp, _i, _len, _ref;
      activities = [];
      status = null;
      rawActivities = shipment != null ? shipment['TrackingEventHistory'] : void 0;
      _ref = rawActivities || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        rawActivity = _ref[_i];
        location = this.presentAddress('EL', rawActivity);
        dateTime = "" + (rawActivity != null ? rawActivity['serverDate'] : void 0) + " " + (rawActivity != null ? rawActivity['serverTime'] : void 0);
        timestamp = moment("" + dateTime + " +00:00").toDate();
        details = rawActivity != null ? rawActivity['EventCodeDesc'] : void 0;
        if ((details != null) && (timestamp != null)) {
          activity = {
            timestamp: timestamp,
            location: location,
            details: details
          };
          activities.push(activity);
        }
        if (!status) {
          status = this.presentStatus(rawActivity != null ? rawActivity['EventCode'] : void 0);
        }
      }
      return {
        activities: activities,
        status: status
      };
    };

    PrestigeClient.prototype.getEta = function(shipment) {
      var eta, _ref, _ref1;
      eta = shipment != null ? (_ref = shipment['TrackingEventHistory']) != null ? (_ref1 = _ref[0]) != null ? _ref1['EstimatedDeliveryDate'] : void 0 : void 0 : void 0;
      if (!(eta != null ? eta.length : void 0)) {
        return;
      }
      eta = "" + eta + " 00:00 +00:00";
      return moment(eta, 'MM/DD/YYYY HH:mm ZZ').toDate();
    };

    PrestigeClient.prototype.getService = function(shipment) {};

    PrestigeClient.prototype.getWeight = function(shipment) {
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

    PrestigeClient.prototype.getDestination = function(shipment) {
      var _ref;
      return this.presentAddress('PD', shipment != null ? (_ref = shipment['TrackingEventHistory']) != null ? _ref[0] : void 0 : void 0);
    };

    PrestigeClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "http://www.prestigedelivery.com/TrackingHandler.ashx?trackingNumbers=" + trackingNumber
      };
    };

    return PrestigeClient;

  })(ShipperClient);

  module.exports = {
    PrestigeClient: PrestigeClient
  };

}).call(this);
