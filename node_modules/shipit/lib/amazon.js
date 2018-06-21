(function() {
  var AmazonClient, ShipperClient, load, lowerCase, moment, request, titleCase, upperCase, upperCaseFirst, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  load = require('cheerio').load;

  moment = require('moment-timezone');

  request = require('request');

  _ref = require('change-case'), titleCase = _ref.titleCase, upperCaseFirst = _ref.upperCaseFirst, lowerCase = _ref.lowerCase, upperCase = _ref.upperCase;

  ShipperClient = require('./shipper').ShipperClient;

  AmazonClient = (function(_super) {
    var DAYS_OF_THE_WEEK, STATUS_MAP;

    __extends(AmazonClient, _super);

    STATUS_MAP = {};

    DAYS_OF_THE_WEEK = {};

    function AmazonClient(options) {
      this.options = options;
      STATUS_MAP[ShipperClient.STATUS_TYPES.DELAYED] = ['delivery attempted'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.DELIVERED] = ['delivered'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.OUT_FOR_DELIVERY] = ['out for delivery'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.SHIPPING] = ['in transit to carrier', 'shipping soon'];
      STATUS_MAP[ShipperClient.STATUS_TYPES.EN_ROUTE] = ['on the way', 'package arrived', 'package received', 'shipment departed', 'shipment arrived'];
      DAYS_OF_THE_WEEK['SUNDAY'] = 0;
      DAYS_OF_THE_WEEK['MONDAY'] = 1;
      DAYS_OF_THE_WEEK['TUESDAY'] = 2;
      DAYS_OF_THE_WEEK['WEDNESDAY'] = 3;
      DAYS_OF_THE_WEEK['THURSDAY'] = 4;
      DAYS_OF_THE_WEEK['FRIDAY'] = 5;
      DAYS_OF_THE_WEEK['SATURDAY'] = 6;
      AmazonClient.__super__.constructor.apply(this, arguments);
    }

    AmazonClient.prototype.validateResponse = function(response, cb) {
      var $, rightNow, _ref1;
      $ = load(response, {
        normalizeWhitespace: true
      });
      rightNow = (_ref1 = /<!-- navp-.* \((.*)\) --?>/.exec(response)) != null ? _ref1[1] : void 0;
      return cb(null, {
        $: $,
        rightNow: rightNow
      });
    };

    AmazonClient.prototype.getService = function() {};

    AmazonClient.prototype.getWeight = function() {};

    AmazonClient.prototype.getDestination = function(data) {
      var $, dest, rightNow;
      if (data == null) {
        return;
      }
      $ = data.$, rightNow = data.rightNow;
      dest = $(".delivery-address").text();
      if (dest != null ? dest.length : void 0) {
        return this.presentLocationString(dest);
      }
    };

    AmazonClient.prototype.getEta = function(data) {
      var $, container, dateComponent, dateComponentStr, deliveryStatus, etaDayVal, etaString, matches, nowDayVal, numDays, rightNow, timeComponent, _ref1, _ref2;
      if (data == null) {
        return;
      }
      $ = data.$, rightNow = data.rightNow;
      container = $(".shipment-status-content").children('span');
      if (!container.length) {
        return;
      }
      deliveryStatus = $(container[0]).text().trim();
      if (/delivered/i.test(deliveryStatus)) {
        return;
      }
      if (!/arriving/i.test(deliveryStatus)) {
        return;
      }
      if (/.* by .*/i.test(deliveryStatus)) {
        matches = deliveryStatus.match(/(.*) by (.*)/, 'i');
        deliveryStatus = matches[1];
        timeComponent = matches[2];
      }
      matches = deliveryStatus.match(/Arriving (.*)/, 'i');
      dateComponentStr = matches != null ? matches[1] : void 0;
      if (/-/.test(dateComponentStr)) {
        dateComponentStr = (_ref1 = dateComponentStr.split('-')) != null ? (_ref2 = _ref1[1]) != null ? _ref2.trim() : void 0 : void 0;
      }
      dateComponent = moment(rightNow);
      if (/today/i.test(dateComponentStr)) {
        numDays = 0;
      } else if (/tomorrow/i.test(dateComponentStr)) {
        numDays = 1;
      } else if (/day/i.test(dateComponentStr)) {
        nowDayVal = DAYS_OF_THE_WEEK[upperCase(moment(rightNow).format('dddd'))];
        etaDayVal = DAYS_OF_THE_WEEK[upperCase(dateComponentStr)];
        if (etaDayVal > nowDayVal) {
          numDays = etaDayVal - nowDayVal;
        } else {
          numDays = 7 + (etaDayVal - nowDayVal);
        }
      } else {
        if (!/20\d{2}/.test(dateComponentStr)) {
          dateComponentStr += ', 2015';
        }
        numDays = (moment(dateComponentStr) - moment(rightNow)) / (1000 * 3600 * 24) + 1;
      }
      dateComponent = moment(rightNow).add(numDays, 'days');
      if (timeComponent == null) {
        timeComponent = "11pm";
      }
      timeComponent = upperCase(timeComponent);
      etaString = "" + (dateComponent.format('YYYY-MM-DD')) + " " + timeComponent + " +00:00";
      return moment(etaString, 'YYYY-MM-DD HA Z').toDate();
    };

    AmazonClient.prototype.presentStatus = function(details) {
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

    AmazonClient.prototype.getActivitiesAndStatus = function(data) {
      var $, activities, columns, components, date, dateStr, details, location, rightNow, row, rows, status, timeOfDay, timestamp, ts, _i, _len;
      activities = [];
      status = null;
      if (data == null) {
        return {
          activities: activities,
          status: status
        };
      }
      $ = data.$, rightNow = data.rightNow;
      status = this.presentStatus($(".latest-event-status").text());
      rows = $("div[data-a-expander-name=event-history-list] .a-box");
      for (_i = 0, _len = rows.length; _i < _len; _i++) {
        row = rows[_i];
        columns = $($(row).find(".a-row")[0]).children('.a-column');
        if (columns.length === 2) {
          timeOfDay = $(columns[0]).text().trim();
          if (timeOfDay === '--') {
            timeOfDay = '12:00 AM';
          }
          components = $(columns[1]).children('span');
          details = (components != null ? components[0] : void 0) != null ? $(components[0]).text().trim() : '';
          location = (components != null ? components[1] : void 0) != null ? $(components[1]).text().trim() : '';
          location = this.presentLocationString(location);
          ts = "" + dateStr + " " + timeOfDay + " +00:00";
          timestamp = moment(ts, 'YYYY-MM-DD H:mm A Z').toDate();
          if ((timestamp != null) && (details != null ? details.length : void 0)) {
            activities.push({
              timestamp: timestamp,
              location: location,
              details: details
            });
            if (status == null) {
              status = this.presentStatus(details);
            }
          }
        } else {
          dateStr = $(row).text().trim().replace('Latest update: ', '');
          if (/yesterday/i.test(dateStr)) {
            date = moment(rightNow).subtract(1, 'day');
          } else if (/today/i.test(dateStr)) {
            date = moment(rightNow);
          } else if (/day/.test(dateStr)) {
            date = moment("" + dateStr + ", " + (moment(rightNow).format('YYYY')));
          } else {
            date = moment(dateStr);
          }
          dateStr = date.format('YYYY-MM-DD');
        }
      }
      return {
        activities: activities,
        status: status
      };
    };

    AmazonClient.prototype.requestOptions = function(_arg) {
      var orderID, orderingShipmentId;
      orderID = _arg.orderID, orderingShipmentId = _arg.orderingShipmentId;
      return {
        method: 'GET',
        uri: "https://www.amazon.com/gp/css/shiptrack/view.html" + "/ref=pe_385040_121528360_TE_SIMP_typ?ie=UTF8" + ("&orderID=" + orderID) + ("&orderingShipmentId=" + orderingShipmentId) + "&packageId=1"
      };
    };

    return AmazonClient;

  })(ShipperClient);

  module.exports = {
    AmazonClient: AmazonClient
  };

}).call(this);
