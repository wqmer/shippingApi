(function() {
  var A1Client, Parser, ShipperClient, moment, titleCase,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Parser = require('xml2js').Parser;

  moment = require('moment-timezone');

  titleCase = require('change-case').titleCase;

  ShipperClient = require('./shipper').ShipperClient;

  A1Client = (function(_super) {
    var STATUS_MAP;

    __extends(A1Client, _super);

    function A1Client(options) {
      this.options = options;
      A1Client.__super__.constructor.apply(this, arguments);
      this.parser = new Parser();
    }

    A1Client.prototype.validateResponse = function(response, cb) {
      var handleResponse;
      handleResponse = function(xmlErr, trackResult) {
        var error, errorInfo, trackingInfo, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
        if ((xmlErr != null) || (trackResult == null)) {
          return cb(xmlErr);
        }
        trackingInfo = (_ref = trackResult['AmazonTrackingResponse']) != null ? (_ref1 = _ref['PackageTrackingInfo']) != null ? _ref1[0] : void 0 : void 0;
        if ((trackingInfo != null ? trackingInfo['TrackingNumber'] : void 0) == null) {
          errorInfo = (_ref2 = trackResult['AmazonTrackingResponse']) != null ? (_ref3 = _ref2['TrackingErrorInfo']) != null ? _ref3[0] : void 0 : void 0;
          error = errorInfo != null ? (_ref4 = errorInfo['TrackingErrorDetail']) != null ? (_ref5 = _ref4[0]) != null ? (_ref6 = _ref5['ErrorDetailCodeDesc']) != null ? _ref6[0] : void 0 : void 0 : void 0 : void 0;
          if (error != null) {
            return cb(error);
          }
          cb('unknown error');
        }
        return cb(null, trackingInfo);
      };
      this.parser.reset();
      return this.parser.parseString(response, handleResponse);
    };

    A1Client.prototype.presentAddress = function(address) {
      var city, countryCode, postalCode, stateCode, _ref, _ref1, _ref2, _ref3;
      if (address == null) {
        return;
      }
      city = (_ref = address['City']) != null ? _ref[0] : void 0;
      stateCode = (_ref1 = address['StateProvince']) != null ? _ref1[0] : void 0;
      countryCode = (_ref2 = address['CountryCode']) != null ? _ref2[0] : void 0;
      postalCode = (_ref3 = address['PostalCode']) != null ? _ref3[0] : void 0;
      return this.presentLocation({
        city: city,
        stateCode: stateCode,
        countryCode: countryCode,
        postalCode: postalCode
      });
    };

    STATUS_MAP = {
      101: ShipperClient.STATUS_TYPES.EN_ROUTE,
      102: ShipperClient.STATUS_TYPES.EN_ROUTE,
      302: ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      304: ShipperClient.STATUS_TYPES.DELAYED,
      301: ShipperClient.STATUS_TYPES.DELIVERED
    };

    A1Client.prototype.getStatus = function(shipment) {
      var code, lastActivity, statusCode, _ref, _ref1, _ref2, _ref3, _ref4;
      lastActivity = (_ref = shipment['TrackingEventHistory']) != null ? (_ref1 = _ref[0]) != null ? (_ref2 = _ref1['TrackingEventDetail']) != null ? _ref2[0] : void 0 : void 0 : void 0;
      statusCode = lastActivity != null ? (_ref3 = lastActivity['EventCode']) != null ? _ref3[0] : void 0 : void 0;
      if (statusCode == null) {
        return;
      }
      code = parseInt((_ref4 = statusCode.match(/EVENT_(.*)$/)) != null ? _ref4[1] : void 0);
      if (isNaN(code)) {
        return;
      }
      if (STATUS_MAP[code] != null) {
        return STATUS_MAP[code];
      } else {
        if (code < 300) {
          return ShipperClient.STATUS_TYPES.EN_ROUTE;
        } else {
          return ShipperClient.STATUS_TYPES.UNKNOWN;
        }
      }
    };

    A1Client.prototype.getActivitiesAndStatus = function(shipment) {
      var activities, activity, datetime, details, event_time, location, rawActivities, rawActivity, raw_timestamp, status, timestamp, _i, _len, _ref, _ref1, _ref2, _ref3, _ref4;
      activities = [];
      status = null;
      rawActivities = (_ref = shipment['TrackingEventHistory']) != null ? (_ref1 = _ref[0]) != null ? _ref1['TrackingEventDetail'] : void 0 : void 0;
      _ref2 = rawActivities || [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        rawActivity = _ref2[_i];
        location = this.presentAddress(rawActivity != null ? (_ref3 = rawActivity['EventLocation']) != null ? _ref3[0] : void 0 : void 0);
        raw_timestamp = rawActivity != null ? rawActivity['EventDateTime'][0] : void 0;
        if (raw_timestamp != null) {
          event_time = moment(raw_timestamp);
          timestamp = event_time.toDate();
          datetime = raw_timestamp.slice(0, 19);
        }
        details = rawActivity != null ? (_ref4 = rawActivity['EventCodeDesc']) != null ? _ref4[0] : void 0 : void 0;
        if ((details != null) && (timestamp != null)) {
          activity = {
            timestamp: timestamp,
            datetime: datetime,
            location: location,
            details: details
          };
          activities.push(activity);
        }
      }
      return {
        activities: activities,
        status: this.getStatus(shipment)
      };
    };

    A1Client.prototype.getEta = function(shipment) {
      var activities, firstActivity, _ref, _ref1, _ref2, _ref3;
      activities = ((_ref = shipment['TrackingEventHistory']) != null ? (_ref1 = _ref[0]) != null ? _ref1['TrackingEventDetail'] : void 0 : void 0) || [];
      firstActivity = activities[activities.length - 1];
      if ((firstActivity != null ? (_ref2 = firstActivity['EstimatedDeliveryDate']) != null ? _ref2[0] : void 0 : void 0) == null) {
        return;
      }
      return moment("" + (firstActivity != null ? (_ref3 = firstActivity['EstimatedDeliveryDate']) != null ? _ref3[0] : void 0 : void 0) + "T00:00:00Z").toDate();
    };

    A1Client.prototype.getService = function(shipment) {
      return null;
    };

    A1Client.prototype.getWeight = function(shipment) {
      return null;
    };

    A1Client.prototype.getDestination = function(shipment) {
      var _ref;
      return this.presentAddress(shipment != null ? (_ref = shipment['PackageDestinationLocation']) != null ? _ref[0] : void 0 : void 0);
    };

    A1Client.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "http://www.aoneonline.com/pages/customers/trackingrequest.php?tracking_number=" + trackingNumber
      };
    };

    return A1Client;

  })(ShipperClient);

  module.exports = {
    A1Client: A1Client
  };

}).call(this);
