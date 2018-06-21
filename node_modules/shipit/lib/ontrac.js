(function() {
  var OnTracClient, ShipperClient, async, load, lowerCase, moment, request, titleCase, upperCaseFirst, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  load = require('cheerio').load;

  moment = require('moment-timezone');

  async = require('async');

  request = require('request');

  _ref = require('change-case'), titleCase = _ref.titleCase, upperCaseFirst = _ref.upperCaseFirst, lowerCase = _ref.lowerCase;

  ShipperClient = require('./shipper').ShipperClient;

  OnTracClient = (function(_super) {
    var LOCATION_STATES, STATUS_MAP;

    __extends(OnTracClient, _super);

    function OnTracClient(options) {
      this.options = options;
      OnTracClient.__super__.constructor.apply(this, arguments);
    }

    OnTracClient.prototype.validateResponse = function(response, cb) {
      var data;
      data = load(response, {
        normalizeWhitespace: true
      });
      return cb(null, data);
    };

    OnTracClient.prototype.extractSummaryField = function(shipment, name) {
      var $, value;
      value = null;
      $ = shipment;
      if ($ == null) {
        return;
      }
      $('td[bgcolor="#ffd204"]').each(function(index, element) {
        var regex, _ref1, _ref2;
        regex = new RegExp(name);
        if (!regex.test($(element).text())) {
          return;
        }
        value = (_ref1 = $(element).next()) != null ? (_ref2 = _ref1.text()) != null ? _ref2.trim() : void 0 : void 0;
        return false;
      });
      return value;
    };

    OnTracClient.prototype.getEta = function(shipment) {
      var eta, regexMatch;
      eta = this.extractSummaryField(shipment, 'Service Commitment');
      if (eta == null) {
        return;
      }
      regexMatch = eta.match('(.*) by (.*)');
      if ((regexMatch != null ? regexMatch.length : void 0) > 1) {
        eta = "" + regexMatch[1] + " 23:59:59 +00:00";
      }
      return moment(eta).toDate();
    };

    OnTracClient.prototype.getService = function(shipment) {
      var service;
      service = this.extractSummaryField(shipment, 'Service Code');
      if (service == null) {
        return;
      }
      return titleCase(service);
    };

    OnTracClient.prototype.getWeight = function(shipment) {
      return this.extractSummaryField(shipment, 'Weight');
    };

    LOCATION_STATES = {
      'Ontario': 'CA',
      'Bakersfield': 'CA',
      'Denver': 'CO',
      'Vancouver': 'WA',
      'Orange': 'CA',
      'Hayward': 'CA',
      'Phoenix': 'AZ',
      'Sacramento': 'CA',
      'Vegas': 'NV',
      'Los Angeles': 'CA',
      'Santa Maria': 'CA',
      'Eugene': 'OR',
      'Commerce': 'CA',
      'Kettleman City': 'CA',
      'Menlo Park': 'CA',
      'San Jose': 'CA',
      'Burbank': 'CA',
      'Ventura': 'CA',
      'Petaluma': 'CA',
      'Corporate': 'CA',
      'Medford': 'OR',
      'Monterey': 'CA',
      'San Francisco': 'CA',
      'Stockton': 'CA',
      'San Diego': 'CA',
      'Fresno': 'CA',
      'Salt Lake': 'UT',
      'SaltLake': 'UT',
      'Concord': 'CA',
      'Tucson': 'AZ',
      'Reno': 'NV',
      'Seattle': 'WA'
    };

    OnTracClient.prototype.presentAddress = function(location) {
      var addressState;
      addressState = LOCATION_STATES[location];
      if (addressState != null) {
        return "" + location + ", " + addressState;
      } else {
        return location;
      }
    };

    STATUS_MAP = {
      'DELIVERED': ShipperClient.STATUS_TYPES.DELIVERED,
      'OUT FOR DELIVERY': ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY,
      'PACKAGE RECEIVED AT FACILITY': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'IN TRANSIT': ShipperClient.STATUS_TYPES.EN_ROUTE,
      'DATA ENTRY': ShipperClient.STATUS_TYPES.SHIPPING
    };

    OnTracClient.prototype.presentStatus = function(status) {
      var statusType, _ref1;
      status = status != null ? (_ref1 = status.replace('DETAILS', '')) != null ? _ref1.trim() : void 0 : void 0;
      if (!(status != null ? status.length : void 0)) {
        return ShipperClient.STATUS_TYPES.UNKNOWN;
      }
      statusType = STATUS_MAP[status];
      if (statusType != null) {
        return statusType;
      } else {
        return ShipperClient.STATUS_TYPES.UNKNOWN;
      }
    };

    OnTracClient.prototype.presentTimestamp = function(ts) {
      if (ts == null) {
        return;
      }
      ts = ts.replace(/AM$/, ' AM').replace(/PM$/, ' PM');
      return moment("" + ts + " +0000").toDate();
    };

    OnTracClient.prototype.getActivitiesAndStatus = function(shipment) {
      var $, activities, status;
      activities = [];
      status = this.presentStatus(this.extractSummaryField(shipment, 'Delivery Status'));
      $ = shipment;
      if ($ == null) {
        return {
          activities: activities,
          status: status
        };
      }
      $("#trkdetail table table").children('tr').each((function(_this) {
        return function(rowIndex, row) {
          var details, fields, location, timestamp;
          if (!(rowIndex > 0)) {
            return;
          }
          fields = [];
          $(row).find('td').each(function(colIndex, col) {
            return fields.push($(col).text().trim());
          });
          if (fields.length) {
            if (fields[0].length) {
              details = upperCaseFirst(lowerCase(fields[0]));
            }
            timestamp = _this.presentTimestamp(fields[1]);
            if (fields[2].length) {
              location = _this.presentAddress(fields[2]);
            }
            if ((details != null) && (timestamp != null)) {
              return activities.unshift({
                details: details,
                timestamp: timestamp,
                location: location
              });
            }
          }
        };
      })(this));
      return {
        activities: activities,
        status: status
      };
    };

    OnTracClient.prototype.getDestination = function(shipment) {
      var destination;
      destination = this.extractSummaryField(shipment, 'Deliver To');
      return this.presentLocationString(destination);
    };

    OnTracClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "https://www.ontrac.com/trackingdetail.asp?tracking=" + trackingNumber + "&run=0"
      };
    };

    return OnTracClient;

  })(ShipperClient);

  module.exports = {
    OnTracClient: OnTracClient
  };

}).call(this);
