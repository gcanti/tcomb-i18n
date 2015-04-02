'use strict';

var t = require('tcomb');
var formatNumber = require('./formatNumber');

function formatPercentage(percentage, options, bundle) {
  t.assert(percentage >= 0 && percentage <= 100, 'formatPercentage() `percentage` must be a number in the [0, 100] interval');
  options = t.mixin({fractionDigits: 0}, options, true);
  return formatNumber(percentage, options, bundle) + '%';
}

module.exports = formatPercentage;