'use strict';

var t = require('tcomb');

function getOrElse(x, y) {
  return t.Nil.is(x) ? y : x;
}

var insertGroupingRegexp = /(\d+)(\d{3})/;

function insertGrouping(str, grouping) {
  var times = Math.floor(str.length / 3);
  for (var i = 0 ; i < times ; i++) {
    str = str.replace(insertGroupingRegexp, "$1" + grouping + "$2");
  }
  return str;
}

function formatNumber(number, options, bundle) {
  options = options || {};
  bundle = bundle || { // en-US
    grouping: ',',
    decimal: '.'
  };
  var fractionDigits = t.Num(getOrElse(options.fractionDigits, 2));
  var useGrouping = t.Bool(getOrElse(options.useGrouping, true));
  var arr = t.Num(number).toFixed(fractionDigits).split('.');
  if (useGrouping) {
    var grouping = bundle.grouping || fail('formatNumber() missing bundle `grouping`');
    arr[0] = insertGrouping(arr[0], grouping);
  }
  var decimal = bundle.decimal || fail('formatNumber() missing bundle `decimal`');
  return arr[0] + (fractionDigits> 0 ? decimal + arr[1] : '');
}

module.exports = formatNumber;