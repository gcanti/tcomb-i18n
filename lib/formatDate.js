'use strict';

var t = require('tcomb');
var template = require('./template');

var defaultFormatDateTemplate = template('<%= M %>/<%= D %>/<%= YY %>'); // en-US

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
    MM: bundle.months[M] || M,  // long month, fallback on short month
    D: padLeft(date.getDate(), 2),
    h: padLeft(date.getHours(), 2),
    m: padLeft(date.getMinutes(), 2)
  };
}

function formatDate(date, pattern, bundle) {
  pattern = pattern || defaultFormatDateTemplate;
  bundle = bundle || {};
  bundle.months = bundle.months || {};
  if (t.Str.is(pattern)) {
    pattern = bundle[pattern] || pattern; // lookup for a named template in the bundle
    pattern = template(pattern);
  }
  return pattern(splitDate(t.Dat(date), bundle));
}

module.exports = formatDate;