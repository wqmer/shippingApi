(function() {
  var ShipperClient, moment, request, titleCase;

  titleCase = require('change-case').titleCase;

  request = require('request');

  moment = require('moment-timezone');

  ShipperClient = (function() {
    function ShipperClient() {}

    ShipperClient.STATUS_TYPES = {
      UNKNOWN: 0,
      SHIPPING: 1,
      EN_ROUTE: 2,
      OUT_FOR_DELIVERY: 3,
      DELIVERED: 4,
      DELAYED: 5
    };

    ShipperClient.prototype.presentPostalCode = function(rawCode) {
      rawCode = rawCode != null ? rawCode.trim() : void 0;
      if (/^\d{9}$/.test(rawCode)) {
        return "" + rawCode.slice(0, 5) + "-" + rawCode.slice(5);
      } else {
        return rawCode;
      }
    };

    ShipperClient.prototype.presentLocationString = function(location) {
      var field, newFields, _i, _len, _ref;
      newFields = [];
      _ref = (location != null ? location.split(',') : void 0) || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        field = field.trim();
        if (field.length > 2) {
          field = titleCase(field);
        }
        newFields.push(field);
      }
      return newFields.join(', ');
    };

    ShipperClient.prototype.presentLocation = function(_arg) {
      var address, city, countryCode, postalCode, stateCode;
      city = _arg.city, stateCode = _arg.stateCode, countryCode = _arg.countryCode, postalCode = _arg.postalCode;
      if (city != null ? city.length : void 0) {
        city = titleCase(city);
      }
      if (stateCode != null ? stateCode.length : void 0) {
        stateCode = stateCode.trim();
        if (stateCode.length > 3) {
          stateCode = titleCase(stateCode);
        }
        if (city != null ? city.length : void 0) {
          city = city.trim();
          address = "" + city + ", " + stateCode;
        } else {
          address = stateCode;
        }
      } else {
        address = city;
      }
      postalCode = this.presentPostalCode(postalCode);
      if (countryCode != null ? countryCode.length : void 0) {
        countryCode = countryCode.trim();
        if (countryCode.length > 3) {
          countryCode = titleCase(countryCode);
        }
        if (address != null ? address.length : void 0) {
          address = countryCode !== 'US' ? "" + address + ", " + countryCode : address;
        } else {
          address = countryCode;
        }
      }
      if (postalCode != null ? postalCode.length : void 0) {
        address = address != null ? "" + address + " " + postalCode : postalCode;
      }
      return address;
    };

    ShipperClient.prototype.presentResponse = function(response, requestData, cb) {
      return this.validateResponse(response, (function(_this) {
        return function(err, shipment) {
          var activities, adjustedEta, eta, presentedResponse, status, _ref, _ref1;
          if ((err != null) || (shipment == null)) {
            return cb(err);
          }
          _ref = _this.getActivitiesAndStatus(shipment), activities = _ref.activities, status = _ref.status;
          eta = _this.getEta(shipment);
          if (eta != null) {
            adjustedEta = moment(eta).utc().format().replace(/T00:00:00/, 'T23:59:59');
          }
          if (adjustedEta != null) {
            adjustedEta = moment(adjustedEta).toDate();
          }
          presentedResponse = {
            eta: adjustedEta,
            service: _this.getService(shipment),
            weight: _this.getWeight(shipment),
            destination: _this.getDestination(shipment),
            activities: activities,
            status: status
          };
          if ((requestData != null ? requestData.raw : void 0) != null) {
            if (requestData.raw) {
              presentedResponse.raw = response;
            }
          } else {
            if ((_ref1 = _this.options) != null ? _ref1.raw : void 0) {
              presentedResponse.raw = response;
            }
          }
          presentedResponse.request = requestData;
          return cb(null, presentedResponse);
        };
      })(this));
    };

    ShipperClient.prototype.requestData = function(requestData, cb) {
      var opts, _ref;
      opts = this.requestOptions(requestData);
      opts.timeout = (requestData != null ? requestData.timeout : void 0) || ((_ref = this.options) != null ? _ref.timeout : void 0);
      return request(opts, (function(_this) {
        return function(err, response, body) {
          if ((body == null) || (err != null)) {
            return cb(err);
          }
          if (response.statusCode !== 200) {
            return cb("response status " + response.statusCode);
          }
          return _this.presentResponse(body, requestData, cb);
        };
      })(this));
    };

    return ShipperClient;

  })();

  module.exports = {
    ShipperClient: ShipperClient
  };

}).call(this);
