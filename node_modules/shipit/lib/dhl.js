(function() {
  var DhlClient, Parser, ShipperClient, lowerCase, moment, titleCase, upperCaseFirst, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Parser = require('xml2js').Parser;

  moment = require('moment-timezone');

  _ref = require('change-case'), titleCase = _ref.titleCase, upperCaseFirst = _ref.upperCaseFirst, lowerCase = _ref.lowerCase;

  ShipperClient = require('./shipper').ShipperClient;

  DhlClient = (function(_super) {
    var STATUS_MAP;

    __extends(DhlClient, _super);

    function DhlClient(_arg, options) {
      this.userId = _arg.userId, this.password = _arg.password;
      this.options = options;
      DhlClient.__super__.constructor.apply(this, arguments);
      this.parser = new Parser();
    }

    DhlClient.prototype.generateRequest = function(trk) {
      return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<req:KnownTrackingRequest xmlns:req=\"http://www.dhl.com\">\n  <Request>\n    <ServiceHeader>\n      <SiteID>" + this.userId + "</SiteID>\n      <Password>" + this.password + "</Password>\n    </ServiceHeader>\n  </Request>\n  <LanguageCode>en</LanguageCode>\n  <AWBNumber>" + trk + "</AWBNumber>\n  <LevelOfDetails>ALL_CHECK_POINTS</LevelOfDetails>\n</req:KnownTrackingRequest>";
    };

    DhlClient.prototype.validateResponse = function(response, cb) {
      var handleResponse;
      handleResponse = function(xmlErr, trackResult) {
        var awbInfo, shipment, statusCode, trackStatus, trackingResponse, _ref1, _ref2, _ref3;
        if ((xmlErr != null) || (trackResult == null)) {
          return cb(xmlErr);
        }
        trackingResponse = trackResult['req:TrackingResponse'];
        if (trackingResponse == null) {
          return cb({
            error: 'no tracking response'
          });
        }
        awbInfo = (_ref1 = trackingResponse['AWBInfo']) != null ? _ref1[0] : void 0;
        if (awbInfo == null) {
          return cb({
            error: 'no AWBInfo in response'
          });
        }
        shipment = (_ref2 = awbInfo['ShipmentInfo']) != null ? _ref2[0] : void 0;
        if (shipment == null) {
          return cb({
            error: 'could not find shipment'
          });
        }
        trackStatus = (_ref3 = awbInfo['Status']) != null ? _ref3[0] : void 0;
        statusCode = trackStatus != null ? trackStatus['ActionStatus'] : void 0;
        if (statusCode.toString() !== 'success') {
          return cb({
            error: "unexpected track status code=" + statusCode
          });
        }
        return cb(null, shipment);
      };
      this.parser.reset();
      return this.parser.parseString(response, handleResponse);
    };

    DhlClient.prototype.getEta = function(shipment) {};

    DhlClient.prototype.getService = function(shipment) {};

    DhlClient.prototype.getWeight = function(shipment) {
      var weight, _ref1;
      weight = (_ref1 = shipment['Weight']) != null ? _ref1[0] : void 0;
      if (weight != null) {
        return "" + weight + " LB";
      }
    };

    DhlClient.prototype.presentTimestamp = function(dateString, timeString) {
      var inputString;
      if (dateString == null) {
        return;
      }
      if (timeString == null) {
        timeString = '00:00';
      }
      inputString = "" + dateString + " " + timeString + " +0000";
      return moment(inputString).toDate();
    };

    DhlClient.prototype.presentAddress = function(rawAddress) {
      var city, countryCode, firstComma, firstDash, stateCode;
      if (rawAddress == null) {
        return;
      }
      firstComma = rawAddress.indexOf(',');
      firstDash = rawAddress.indexOf('-', firstComma);
      if (firstComma > -1 && firstDash > -1) {
        city = rawAddress.substring(0, firstComma).trim();
        stateCode = rawAddress.substring(firstComma + 1, firstDash).trim();
        countryCode = rawAddress.substring(firstDash + 1).trim();
      } else if (firstComma < 0 && firstDash > -1) {
        city = rawAddress.substring(0, firstDash).trim();
        stateCode = null;
        countryCode = rawAddress.substring(firstDash + 1).trim();
      } else {
        return rawAddress;
      }
      city = city.replace(' HUB', '');
      city = city.replace(' GATEWAY', '');
      return this.presentLocation({
        city: city,
        stateCode: stateCode,
        countryCode: countryCode
      });
    };

    DhlClient.prototype.presentDetails = function(rawAddress, rawDetails) {
      if (rawDetails == null) {
        return;
      }
      if (rawAddress == null) {
        return rawDetails;
      }
      return rawDetails.replace(/\s\s+/, ' ').trim().replace(new RegExp("(?: at| in)? " + (rawAddress.trim()) + "$"), '');
    };

    STATUS_MAP = {
      'AD': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'AF': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'AR': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'BA': ShipperClient.STATUS_TYPES.DELAYED,
      'BN': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'BR': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'CA': ShipperClient.STATUS_TYPES.DELAYED,
      'CC': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'CD': ShipperClient.STATUS_TYPES.DELAYED,
      'CM': ShipperClient.STATUS_TYPES.DELAYED,
      'CR': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'CS': ShipperClient.STATUS_TYPES.DELAYED,
      'DD': ShipperClient.STATUS_TYPES.DELIVERED,
      'DF': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'DS': ShipperClient.STATUS_TYPES.DELAYED,
      'FD': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'HP': ShipperClient.STATUS_TYPES.DELAYED,
      'IC': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'MC': ShipperClient.STATUS_TYPES.DELAYED,
      'MD': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'MS': ShipperClient.STATUS_TYPES.DELAYED,
      'ND': ShipperClient.STATUS_TYPES.DELAYED,
      'NH': ShipperClient.STATUS_TYPES.DELAYED,
      'OH': ShipperClient.STATUS_TYPES.DELAYED,
      'OK': ShipperClient.STATUS_TYPES.DELIVERED,
      'PD': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'PL': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'PO': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'PU': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'RD': ShipperClient.STATUS_TYPES.DELAYED,
      'RR': ShipperClient.STATUS_TYPES.DELAYED,
      'RT': ShipperClient.STATUS_TYPES.DELAYED,
      'SA': ShipperClient.STATUS_TYPES.SHIPPING,
      'SC': ShipperClient.STATUS_TYPES.DELAYED,
      'SS': ShipperClient.STATUS_TYPES.DELAYED,
      'TD': ShipperClient.STATUS_TYPES.DELAYED,
      'TP': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'TR': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'UD': ShipperClient.STATUS_TYPES.DELAYED,
      'WC': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'WX': ShipperClient.STATUS_TYPES.DELAYED
    };

    DhlClient.prototype.presentStatus = function(status) {
      return STATUS_MAP[status] || ShipperClient.STATUS_TYPES.UNKNOWN;
    };

    DhlClient.prototype.getActivitiesAndStatus = function(shipment) {
      var activities, activity, details, location, rawActivities, rawActivity, rawLocation, status, timestamp, _i, _len, _ref1, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
      activities = [];
      status = null;
      rawActivities = shipment['ShipmentEvent'];
      if (rawActivities == null) {
        rawActivities = [];
      }
      rawActivities.reverse();
      _ref1 = rawActivities || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        rawActivity = _ref1[_i];
        rawLocation = (_ref2 = rawActivity['ServiceArea']) != null ? (_ref3 = _ref2[0]) != null ? (_ref4 = _ref3['Description']) != null ? _ref4[0] : void 0 : void 0 : void 0;
        location = this.presentAddress(rawLocation);
        timestamp = this.presentTimestamp((_ref5 = rawActivity['Date']) != null ? _ref5[0] : void 0, (_ref6 = rawActivity['Time']) != null ? _ref6[0] : void 0);
        details = this.presentDetails(rawLocation, (_ref7 = rawActivity['ServiceEvent']) != null ? (_ref8 = _ref7[0]) != null ? (_ref9 = _ref8['Description']) != null ? _ref9[0] : void 0 : void 0 : void 0);
        if ((details != null) && (timestamp != null)) {
          details = details.slice(-1) === '.' ? details.slice(0, -1) : details;
          activity = {
            timestamp: timestamp,
            location: location,
            details: details
          };
          activities.push(activity);
        }
        if (!status) {
          status = this.presentStatus((_ref10 = rawActivity['ServiceEvent']) != null ? (_ref11 = _ref10[0]) != null ? (_ref12 = _ref11['EventCode']) != null ? _ref12[0] : void 0 : void 0 : void 0);
        }
      }
      return {
        activities: activities,
        status: status
      };
    };

    DhlClient.prototype.getDestination = function(shipment) {
      var destination, _ref1, _ref2, _ref3;
      destination = (_ref1 = shipment['DestinationServiceArea']) != null ? (_ref2 = _ref1[0]) != null ? (_ref3 = _ref2['Description']) != null ? _ref3[0] : void 0 : void 0 : void 0;
      if (destination == null) {
        return;
      }
      return this.presentAddress(destination);
    };

    DhlClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'POST',
        uri: 'http://xmlpi-ea.dhl.com/XMLShippingServlet',
        body: this.generateRequest(trackingNumber)
      };
    };

    return DhlClient;

  })(ShipperClient);

  module.exports = {
    DhlClient: DhlClient
  };

}).call(this);
