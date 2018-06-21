(function() {
  var Builder, Parser, ShipperClient, UspsClient, lowerCase, moment, request, titleCase, upperCaseFirst, _ref, _ref1,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('xml2js'), Builder = _ref.Builder, Parser = _ref.Parser;

  request = require('request');

  moment = require('moment-timezone');

  _ref1 = require('change-case'), titleCase = _ref1.titleCase, upperCaseFirst = _ref1.upperCaseFirst, lowerCase = _ref1.lowerCase;

  ShipperClient = require('./shipper').ShipperClient;

  UspsClient = (function(_super) {
    var STATUS_MAP;

    __extends(UspsClient, _super);

    function UspsClient(_arg, options) {
      this.userId = _arg.userId;
      this.options = options;
      UspsClient.__super__.constructor.apply(this, arguments);
      this.parser = new Parser();
      this.builder = new Builder({
        renderOpts: {
          pretty: false
        }
      });
    }

    UspsClient.prototype.generateRequest = function(trk, clientIp) {
      if (clientIp == null) {
        clientIp = '127.0.0.1';
      }
      return this.builder.buildObject({
        'TrackFieldRequest': {
          '$': {
            'USERID': this.userId
          },
          'Revision': '1',
          'ClientIp': clientIp,
          'SourceId': 'shipit',
          'TrackID': {
            '$': {
              'ID': trk
            }
          }
        }
      });
    };

    UspsClient.prototype.validateResponse = function(response, cb) {
      var handleResponse;
      handleResponse = function(xmlErr, trackResult) {
        var trackInfo, _ref2, _ref3;
        trackInfo = trackResult != null ? (_ref2 = trackResult['TrackResponse']) != null ? (_ref3 = _ref2['TrackInfo']) != null ? _ref3[0] : void 0 : void 0 : void 0;
        if ((xmlErr != null) || (trackInfo == null)) {
          return cb(xmlErr);
        }
        return cb(null, trackInfo);
      };
      this.parser.reset();
      return this.parser.parseString(response, handleResponse);
    };

    UspsClient.prototype.getEta = function(shipment) {
      var rawEta, _ref2, _ref3;
      rawEta = ((_ref2 = shipment['PredictedDeliveryDate']) != null ? _ref2[0] : void 0) || ((_ref3 = shipment['ExpectedDeliveryDate']) != null ? _ref3[0] : void 0);
      if (rawEta != null) {
        return moment("" + rawEta + " 00:00:00Z").toDate();
      }
    };

    UspsClient.prototype.getService = function(shipment) {
      var service, _ref2;
      service = (_ref2 = shipment['Class']) != null ? _ref2[0] : void 0;
      if (service != null) {
        return service.replace(/\<SUP\>.*\<\/SUP\>/, '');
      }
    };

    UspsClient.prototype.getWeight = function(shipment) {};

    UspsClient.prototype.presentTimestamp = function(dateString, timeString) {
      if (dateString == null) {
        return;
      }
      timeString = (timeString != null ? timeString.length : void 0) ? timeString : '12:00 am';
      return moment("" + dateString + " " + timeString + " +0000").toDate();
    };

    UspsClient.prototype.presentStatus = function(status) {
      return ShipperClient.STATUS_TYPES.UNKNOWN;
    };

    UspsClient.prototype.getDestination = function(shipment) {
      var city, postalCode, stateCode, _ref2, _ref3, _ref4;
      city = (_ref2 = shipment['DestinationCity']) != null ? _ref2[0] : void 0;
      stateCode = (_ref3 = shipment['DestinationState']) != null ? _ref3[0] : void 0;
      postalCode = (_ref4 = shipment['DestinationZip']) != null ? _ref4[0] : void 0;
      return this.presentLocation({
        city: city,
        stateCode: stateCode,
        postalCode: postalCode
      });
    };

    STATUS_MAP = {
      'Accept': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Processed': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Depart': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Picked Up': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Arrival': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Sorting Complete': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Customs clearance': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Dispatch': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Arrive': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Inbound Out of Customs': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Forwarded': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'Out for Delivery': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'Delivered': ShipperClient.STATUS_TYPES.DELIVERED,
      'Notice Left': ShipperClient.STATUS_TYPES.DELAYED,
      'Refused': ShipperClient.STATUS_TYPES.DELAYED,
      'Item being held': ShipperClient.STATUS_TYPES.DELAYED,
      'Missed delivery': ShipperClient.STATUS_TYPES.DELAYED,
      'Addressee not available': ShipperClient.STATUS_TYPES.DELAYED,
      'Undeliverable as Addressed': ShipperClient.STATUS_TYPES.DELAYED,
      'Tendered to Military Agent': ShipperClient.STATUS_TYPES.DELIVERED
    };

    UspsClient.prototype.findStatusFromMap = function(statusText) {
      var regex, status, statusCode, text;
      status = ShipperClient.STATUS_TYPES.UNKNOWN;
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

    UspsClient.prototype.getStatus = function(shipment) {
      var statusCategory, _ref2, _ref3;
      statusCategory = shipment != null ? (_ref2 = shipment['StatusCategory']) != null ? _ref2[0] : void 0 : void 0;
      switch (statusCategory) {
        case 'Pre-Shipment':
          return ShipperClient.STATUS_TYPES.SHIPPING;
        case 'Delivered':
          return ShipperClient.STATUS_TYPES.DELIVERED;
        default:
          return this.findStatusFromMap(shipment != null ? (_ref3 = shipment['Status']) != null ? _ref3[0] : void 0 : void 0);
      }
    };

    UspsClient.prototype.presentActivity = function(rawActivity) {
      var activity, city, countryCode, details, location, postalCode, stateCode, timestamp, _ref10, _ref11, _ref12, _ref13, _ref14, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      if (rawActivity == null) {
        return;
      }
      activity = null;
      city = (_ref2 = rawActivity['EventCity']) != null ? _ref2[0] : void 0;
      if ((_ref3 = rawActivity['EventState']) != null ? (_ref4 = _ref3[0]) != null ? _ref4.length : void 0 : void 0) {
        stateCode = (_ref5 = rawActivity['EventState']) != null ? _ref5[0] : void 0;
      }
      if ((_ref6 = rawActivity['EventZIPCode']) != null ? (_ref7 = _ref6[0]) != null ? _ref7.length : void 0 : void 0) {
        postalCode = (_ref8 = rawActivity['EventZIPCode']) != null ? _ref8[0] : void 0;
      }
      if ((_ref9 = rawActivity['EventCountry']) != null ? (_ref10 = _ref9[0]) != null ? _ref10.length : void 0 : void 0) {
        countryCode = (_ref11 = rawActivity['EventCountry']) != null ? _ref11[0] : void 0;
      }
      location = this.presentLocation({
        city: city,
        stateCode: stateCode,
        countryCode: countryCode,
        postalCode: postalCode
      });
      timestamp = this.presentTimestamp(rawActivity != null ? (_ref12 = rawActivity['EventDate']) != null ? _ref12[0] : void 0 : void 0, rawActivity != null ? (_ref13 = rawActivity['EventTime']) != null ? _ref13[0] : void 0 : void 0);
      details = rawActivity != null ? (_ref14 = rawActivity['Event']) != null ? _ref14[0] : void 0 : void 0;
      if ((details != null) && (timestamp != null)) {
        activity = {
          timestamp: timestamp,
          location: location,
          details: details
        };
      }
      return activity;
    };

    UspsClient.prototype.getActivitiesAndStatus = function(shipment) {
      var activities, activity, rawActivity, trackSummary, _i, _len, _ref2, _ref3;
      activities = [];
      trackSummary = this.presentActivity(shipment != null ? (_ref2 = shipment['TrackSummary']) != null ? _ref2[0] : void 0 : void 0);
      if (trackSummary != null) {
        activities.push(trackSummary);
      }
      _ref3 = (shipment != null ? shipment['TrackDetail'] : void 0) || [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        rawActivity = _ref3[_i];
        activity = this.presentActivity(rawActivity);
        if (activity != null) {
          activities.push(activity);
        }
      }
      return {
        activities: activities,
        status: this.getStatus(shipment)
      };
    };

    UspsClient.prototype.requestOptions = function(_arg) {
      var clientIp, endpoint, test, trackingNumber, xml;
      trackingNumber = _arg.trackingNumber, clientIp = _arg.clientIp, test = _arg.test;
      endpoint = test ? 'ShippingAPITest.dll' : 'ShippingAPI.dll';
      xml = this.generateRequest(trackingNumber, clientIp);
      return {
        method: 'GET',
        uri: "http://production.shippingapis.com/" + endpoint + "?API=TrackV2&XML=" + xml
      };
    };

    return UspsClient;

  })(ShipperClient);

  module.exports = {
    UspsClient: UspsClient
  };

}).call(this);
