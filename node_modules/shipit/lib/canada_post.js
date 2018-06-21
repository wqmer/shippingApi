(function() {
  var CanadaPostClient, Parser, ShipperClient, find, moment, titleCase,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Parser = require('xml2js').Parser;

  find = require('underscore').find;

  moment = require('moment-timezone');

  titleCase = require('change-case').titleCase;

  ShipperClient = require('./shipper').ShipperClient;

  CanadaPostClient = (function(_super) {
    var STATUS_MAP;

    __extends(CanadaPostClient, _super);

    function CanadaPostClient(_arg, options) {
      this.username = _arg.username, this.password = _arg.password;
      this.options = options;
      CanadaPostClient.__super__.constructor.apply(this, arguments);
      this.parser = new Parser();
    }

    CanadaPostClient.prototype.validateResponse = function(response, cb) {
      var handleResponse;
      handleResponse = function(xmlErr, trackResult) {
        var details;
        if ((xmlErr != null) || (trackResult == null)) {
          return cb(xmlErr);
        }
        details = trackResult['tracking-detail'];
        if (details == null) {
          return cb('response not recognized');
        }
        return cb(null, details);
      };
      this.parser.reset();
      return this.parser.parseString(response, handleResponse);
    };

    STATUS_MAP = {
      'in transit': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'processed': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'information submitted': ShipperClient.STATUS_TYPES.SHIPPING,
      'Shipment picked up': ShipperClient.STATUS_TYPES.SHIPPING,
      'Shipment received': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'delivered': ShipperClient.STATUS_TYPES.DELIVERED,
      'out for delivery': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'item released': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'arrived': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'departed': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'is en route': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'item mailed': ShipperClient.STATUS_TYPES.SHIPPING,
      'available for pickup': ShipperClient.STATUS_TYPES.DELAYED,
      'Attempted delivery': ShipperClient.STATUS_TYPES.DELAYED
    };

    CanadaPostClient.prototype.findStatusFromMap = function(statusText) {
      var regex, status, statusCode, text;
      status = ShipperClient.STATUS_TYPES.UNKNOWN;
      if (!(statusText != null ? statusText.length : void 0)) {
        return status;
      }
      for (text in STATUS_MAP) {
        statusCode = STATUS_MAP[text];
        regex = new RegExp(text, 'i');
        if (regex.test(statusText)) {
          status = statusCode;
          break;
        }
      }
      return status;
    };

    CanadaPostClient.prototype.getStatus = function(lastEvent) {
      return this.findStatusFromMap(lastEvent != null ? lastEvent.details : void 0);
    };

    CanadaPostClient.prototype.getActivitiesAndStatus = function(shipment) {
      var activities, activity, city, details, event, events, location, stateCode, status, timestamp, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
      activities = [];
      status = null;
      events = (_ref = shipment['significant-events']) != null ? (_ref1 = _ref[0]) != null ? _ref1['occurrence'] : void 0 : void 0;
      _ref2 = events || [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        event = _ref2[_i];
        city = (_ref3 = event['event-site']) != null ? _ref3[0] : void 0;
        stateCode = (_ref4 = event['event-province']) != null ? _ref4[0] : void 0;
        location = this.presentLocation({
          city: city,
          stateCode: stateCode
        });
        timestamp = "" + ((_ref5 = event['event-date']) != null ? _ref5[0] : void 0) + "T" + ((_ref6 = event['event-time']) != null ? _ref6[0] : void 0) + "Z";
        timestamp = moment(timestamp).toDate();
        details = (_ref7 = event['event-description']) != null ? _ref7[0] : void 0;
        if ((details != null) && (timestamp != null)) {
          activity = {
            timestamp: timestamp,
            location: location,
            details: details
          };
          activities.push(activity);
        }
      }
      return {
        activities: activities,
        status: this.getStatus(activities != null ? activities[0] : void 0)
      };
    };

    CanadaPostClient.prototype.getEta = function(shipment) {
      var ts, _ref, _ref1;
      ts = ((_ref = shipment['changed-expected-date']) != null ? _ref[0] : void 0) || ((_ref1 = shipment['expected-delivery-date']) != null ? _ref1[0] : void 0);
      if (!(ts != null ? ts.length : void 0)) {
        return;
      }
      if (ts != null ? ts.length : void 0) {
        return moment("" + ts + "T00:00:00Z").toDate();
      }
    };

    CanadaPostClient.prototype.getService = function(shipment) {
      var _ref;
      return (_ref = shipment['service-name']) != null ? _ref[0] : void 0;
    };

    CanadaPostClient.prototype.getWeight = function(shipment) {};

    CanadaPostClient.prototype.getDestination = function(shipment) {
      var _ref;
      return (_ref = shipment['destination-postal-id']) != null ? _ref[0] : void 0;
    };

    CanadaPostClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "https://soa-gw.canadapost.ca/vis/track/pin/" + trackingNumber + "/detail.xml",
        auth: {
          user: this.username,
          pass: this.password
        }
      };
    };

    return CanadaPostClient;

  })(ShipperClient);

  module.exports = {
    CanadaPostClient: CanadaPostClient
  };

}).call(this);
