(function() {
  var _checkDigit;

  _checkDigit = function(trk, multipliers, mod) {
    var checkdigit, index, midx, sum, _i, _ref;
    midx = 0;
    sum = 0;
    for (index = _i = 0, _ref = trk.length - 2; 0 <= _ref ? _i <= _ref : _i >= _ref; index = 0 <= _ref ? ++_i : --_i) {
      sum += parseInt(trk[index], 10) * multipliers[midx];
      midx = midx === multipliers.length - 1 ? 0 : midx + 1;
    }
    if (mod === 11) {
      checkdigit = sum % 11;
      if (checkdigit === 10) {
        checkdigit = 0;
      }
    }
    if (mod === 10) {
      checkdigit = 0;
      if ((sum % 10) > 0) {
        checkdigit = 10 - sum % 10;
      }
    }
    return checkdigit === parseInt(trk[trk.length - 1]);
  };

  module.exports = _checkDigit;

}).call(this);
