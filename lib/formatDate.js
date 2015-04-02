'use strict';

var t = require('tcomb');
var template = require('./template');

var defaultFormatDateTemplate = template('<%= M %>/<%= D %>/<%= YY %>'); // en-US
var defaultMonths = { // en-US
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

function padLeft(x, len) {
  var str = String(x);
  var times = len - str.length;
  for (var i = 0 ; i < times ; i++ ) {
    str = '0' + str;
  }
  return str;
}

function splitDate(date, bundle) {
  var YY = date.getFullYear() + '';
  var M = padLeft(date.getMonth() + 1, 2);
  return {
    YY: YY,                     // long year
    Y: YY.substr(-2),           // short year
    M: M,                       // short month
    MM: bundle.months[M] || M,  // long month, fallback to short month
    D: padLeft(date.getDate(), 2),
    h: padLeft(date.getHours(), 2),
    m: padLeft(date.getMinutes(), 2)
  };
}

function formatDate(date, pattern, bundle) {
  pattern = pattern || defaultFormatDateTemplate;
  bundle = bundle || {};
  bundle.months = bundle.months || defaultMonths;
  if (t.Str.is(pattern)) {
    pattern = bundle[pattern] || pattern; // lookup for a named template in the bundle
    pattern = template(pattern);
  }
  return pattern(splitDate(t.Dat(date), bundle));
}

module.exports = formatDate;