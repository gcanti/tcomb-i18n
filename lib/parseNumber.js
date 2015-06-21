'use strict';

var t = require('tcomb');

var regexp = /([.*+?^${}()|[\]\/\\])/g;

function escapeRegexp(str) {
  return str.replace(regexp, '\\$1');
}

function stripSymbols(str, grouping, decimal) {
  str = str.replace(new RegExp(escapeRegexp(grouping), 'gm'), '');
  return str.replace(new RegExp(escapeRegexp(decimal), 'gm'), '.');
}

function parseNumber(str, bundle) {
  bundle = bundle || { // en-US
    grouping: ',',
    decimal: '.'
  };
  var grouping = bundle.grouping || t.fail('parseNumber() missing bundle `grouping`');
  var decimal = bundle.decimal || t.fail('parseNumber() missing bundle `decimal`');
  return parseFloat(stripSymbols(str, grouping, decimal));
}

module.exports = parseNumber;