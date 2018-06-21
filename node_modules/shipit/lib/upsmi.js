(function() {
  var ShipperClient, UpsMiClient, load, lowerCase, moment, titleCase, upperCaseFirst, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  load = require('cheerio').load;

  moment = require('moment-timezone');

  _ref = require('change-case'), titleCase = _ref.titleCase, upperCaseFirst = _ref.upperCaseFirst, lowerCase = _ref.lowerCase;

  ShipperClient = require('./shipper').ShipperClient;

  UpsMiClient = (function(_super) {
    var STATUS_MAP;

    __extends(UpsMiClient, _super);

    STATUS_MAP = {};

    function UpsMiClient(options) {
      this.options = options;
      STATUS_MAP[ShipperClient.STATUS_TYPES.DELIVERED] = ['delivered'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.EN_ROUTE] = ['transferred', 'received', 'processed', 'sorted', 'post office entry'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY] = ['out for post office delivery'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.SHIPPING] = ['shipment information received'];
      UpsMiClient.__super__.constructor.apply(this, arguments);
    }

    UpsMiClient.prototype.validateResponse = function(response, cb) {
      var $, miDetails, summary, uspsDetails, _ref1;
      $ = load(response, {
        normalizeWhitespace: true
      });
      summary = (_ref1 = $('#Table6').find('table')) != null ? _ref1[0] : void 0;
      uspsDetails = $('#ctl00_mainContent_ctl00_pnlUSPS > table');
      miDetails = $('#ctl00_mainContent_ctl00_pnlMI > table');
      return cb(null, {
        $: $,
        summary: summary,
        uspsDetails: uspsDetails,
        miDetails: miDetails
      });
    };

    UpsMiClient.prototype.extractSummaryField = function(data, name) {
      var $, summary, value;
      value = null;
      $ = data.$, summary = data.summary;
      if (summary == null) {
        return;
      }
      $(summary).children('tr').each(function(rindex, row) {
        $(row).children('td').each(function(cindex, col) {
          var regex, _ref1, _ref2;
          regex = new RegExp(name);
          if (regex.test($(col).text())) {
            value = (_ref1 = $(col).next()) != null ? (_ref2 = _ref1.text()) != null ? _ref2.trim() : void 0 : void 0;
          }
          if (value != null) {
            return false;
          }
        });
        if (value != null) {
          return false;
        }
      });
      return value;
    };

    UpsMiClient.prototype.getEta = function(data) {
      var eta, formattedEta;
      eta = this.extractSummaryField(data, 'Projected Delivery Date');
      if (eta != null) {
        formattedEta = moment("" + eta + " 00:00 +0000");
      }
      if (formattedEta != null ? formattedEta.isValid() : void 0) {
        return formattedEta.toDate();
      } else {
        return void 0;
      }
    };

    UpsMiClient.prototype.getService = function() {};

    UpsMiClient.prototype.getWeight = function(data) {
      var weight;
      weight = this.extractSummaryField(data, 'Weight');
      if (weight != null ? weight.length : void 0) {
        return "" + weight + " lbs.";
      }
    };

    UpsMiClient.prototype.presentStatus = function(details) {
      var matchStrings, regex, status, statusCode, text, _i, _len;
      status = null;
      for (statusCode in STATUS_MAP) {
        matchStrings = STATUS_MAP[statusCode];
        for (_i = 0, _len = matchStrings.length; _i < _len; _i++) {
          text = matchStrings[_i];
          regex = new RegExp(text, 'i');
          if (regex.test(lowerCase(details))) {
            status = statusCode;
            break;
          }
        }
        if (status != null) {
          break;
        }
      }
      if (status != null) {
        return parseInt(status, 10);
      }
    };

    UpsMiClient.prototype.extractTimestamp = function(tsString) {
      if (tsString.match(':')) {
        return moment("" + tsString + " +0000").toDate();
      } else {
        return moment("" + tsString + " 00:00 +0000").toDate();
      }
    };

    UpsMiClient.prototype.extractActivities = function($, table) {
      var activities;
      activities = [];
      $(table).children('tr').each((function(_this) {
        return function(rindex, row) {
          var details, location, timestamp;
          if (rindex === 0) {
            return;
          }
          details = location = timestamp = null;
          $(row).children('td').each(function(cindex, col) {
            var value, _ref1, _ref2;
            value = (_ref1 = $(col)) != null ? (_ref2 = _ref1.text()) != null ? _ref2.trim() : void 0 : void 0;
            switch (cindex) {
              case 0:
                return timestamp = _this.extractTimestamp(value);
              case 1:
                return details = value;
              case 2:
                return location = _this.presentLocationString(value);
            }
          });
          if ((details != null) && (timestamp != null)) {
            return activities.push({
              details: details,
              location: location,
              timestamp: timestamp
            });
          }
        };
      })(this));
      return activities;
    };

    UpsMiClient.prototype.getActivitiesAndStatus = function(data) {
      var $, activities, activity, miDetails, set1, set2, status, uspsDetails, _i, _len, _ref1;
      status = null;
      $ = data.$, uspsDetails = data.uspsDetails, miDetails = data.miDetails;
      set1 = this.extractActivities($, uspsDetails);
      set2 = this.extractActivities($, miDetails);
      activities = set1.concat(set2);
      _ref1 = activities || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        activity = _ref1[_i];
        if (status != null) {
          break;
        }
        status = this.presentStatus(activity != null ? activity.details : void 0);
      }
      return {
        activities: activities,
        status: status
      };
    };

    UpsMiClient.prototype.getDestination = function(data) {
      var destination;
      destination = this.extractSummaryField(data, 'Zip Code');
      if (destination != null ? destination.length : void 0) {
        return destination;
      }
    };

    UpsMiClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "http://www.ups-mi.net/packageID/PackageID.aspx?PID=" + trackingNumber
      };
    };

    return UpsMiClient;

  })(ShipperClient);

  module.exports = {
    UpsMiClient: UpsMiClient
  };

}).call(this);
