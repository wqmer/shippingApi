(function() {
  var DhlGmClient, ShipperClient, load, lowerCase, moment, titleCase, upperCaseFirst, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  load = require('cheerio').load;

  moment = require('moment-timezone');

  _ref = require('change-case'), titleCase = _ref.titleCase, upperCaseFirst = _ref.upperCaseFirst, lowerCase = _ref.lowerCase;

  ShipperClient = require('./shipper').ShipperClient;

  DhlGmClient = (function(_super) {
    var STATUS_MAP;

    __extends(DhlGmClient, _super);

    STATUS_MAP = {};

    function DhlGmClient(options) {
      this.options = options;
      STATUS_MAP[ShipperClient.STATUS_TYPES.DELIVERED] = ['delivered'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.EN_ROUTE] = ['transferred', 'cleared', 'received', 'processed', 'sorted', 'sorting complete', 'arrival', 'tendered'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY] = ['out for delivery'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.SHIPPING] = ['electronic notification received'];
      DhlGmClient.__super__.constructor.apply(this, arguments);
    }

    DhlGmClient.prototype.validateResponse = function(response, cb) {
      var error;
      try {
        response = response.replace(/<br>/gi, ' ');
        return cb(null, load(response, {
          normalizeWhitespace: true
        }));
      } catch (_error) {
        error = _error;
        return cb(error);
      }
    };

    DhlGmClient.prototype.extractSummaryField = function(data, name) {
      var $, regex, value;
      if (data == null) {
        return;
      }
      $ = data;
      value = void 0;
      regex = new RegExp(name);
      $(".card-info > dl").children().each(function(findex, field) {
        var _ref1, _ref2;
        if (regex.test($(field).text())) {
          value = (_ref1 = $(field).next()) != null ? (_ref2 = _ref1.text()) != null ? _ref2.trim() : void 0 : void 0;
        }
        if (value != null) {
          return false;
        }
      });
      return value;
    };

    DhlGmClient.prototype.extractHeaderField = function(data, name) {
      var $, regex, value;
      if (data == null) {
        return;
      }
      $ = data;
      value = void 0;
      regex = new RegExp(name);
      $(".card > .row").children().each(function(findex, field) {
        $(field).children().each(function(cindex, col) {
          return $(col).find('dt').each(function(dindex, element) {
            var _ref1, _ref2;
            if (regex.test($(element).text())) {
              return value = (_ref1 = $(element).next()) != null ? (_ref2 = _ref1.text()) != null ? _ref2.trim() : void 0 : void 0;
            }
          });
        });
        if (value != null) {
          return false;
        }
      });
      return value;
    };

    DhlGmClient.prototype.getEta = function(data) {
      var $, eta;
      if (data == null) {
        return;
      }
      $ = data;
      eta = $(".status-info > .row .est-delivery > p").text();
      if (!(eta != null ? eta.length : void 0)) {
        return;
      }
      return moment("" + eta + " 23:59:59 +00:00").toDate();
    };

    DhlGmClient.prototype.getService = function(data) {
      return this.extractSummaryField(data, 'Service');
    };

    DhlGmClient.prototype.getWeight = function(data) {
      return this.extractSummaryField(data, 'Weight');
    };

    DhlGmClient.prototype.presentStatus = function(details) {
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

    DhlGmClient.prototype.getActivitiesAndStatus = function(data) {
      var $, activities, currentDate, currentTime, details, location, row, rowData, status, timestamp, _i, _len, _ref1, _ref2, _ref3;
      status = null;
      activities = [];
      if (data == null) {
        return {
          activities: activities,
          status: status
        };
      }
      $ = data;
      currentDate = null;
      _ref1 = $(".timeline").children() || [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        rowData = _ref1[_i];
        row = $(rowData);
        if (row.hasClass('timeline-date')) {
          currentDate = row.text();
        }
        if (row.hasClass('timeline-event')) {
          currentTime = row.find(".timeline-time").text();
          if (currentTime != null ? currentTime.length : void 0) {
            if (currentTime != null ? currentTime.length : void 0) {
              currentTime = (_ref2 = currentTime.trim().split(' ')) != null ? _ref2[0] : void 0;
            }
            currentTime = currentTime.replace('AM', ' AM').replace('PM', ' PM');
            currentTime += " +00:00";
            timestamp = moment("" + currentDate + " " + currentTime).toDate();
          }
          location = row.find(".timeline-location-responsive").text();
          location = location != null ? location.trim() : void 0;
          if (location != null ? location.length : void 0) {
            location = upperCaseFirst(location);
          }
          details = (_ref3 = row.find(".timeline-description").text()) != null ? _ref3.trim() : void 0;
          if ((details != null) && (timestamp != null)) {
            if (status == null) {
              status = this.presentStatus(details);
            }
            activities.push({
              details: details,
              location: location,
              timestamp: timestamp
            });
          }
        }
      }
      return {
        activities: activities,
        status: status
      };
    };

    DhlGmClient.prototype.getDestination = function(data) {
      return this.extractHeaderField(data, 'To:');
    };

    DhlGmClient.prototype.requestOptions = function(_arg) {
      var trackingNumber;
      trackingNumber = _arg.trackingNumber;
      return {
        method: 'GET',
        uri: "http://webtrack.dhlglobalmail.com/?trackingnumber=" + trackingNumber
      };
    };

    return DhlGmClient;

  })(ShipperClient);

  module.exports = {
    DhlGmClient: DhlGmClient
  };

}).call(this);
