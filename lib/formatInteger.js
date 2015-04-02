'use strict';

var formatNumber = require('./formatNumber');

function formatInteger(n, useGrouping, bundle) {
  return formatNumber(n, {fractionDigits: 0, useGrouping: useGrouping}, bundle);
}

module.exports = formatInteger;