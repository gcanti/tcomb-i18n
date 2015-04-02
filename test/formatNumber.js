'use strict';

var tape = require('tape');
var formatNumber = require('../lib/formatNumber');

tape.test('formatNumber', function (tape) {
  tape.plan(12);

  tape.strictEqual(formatNumber(1000), '1,000.00');
  tape.strictEqual(formatNumber(-1000), '-1,000.00');

  var bundle = { // it-IT
    grouping: '.',
    decimal: ','
  };

  tape.strictEqual(formatNumber(0, null, bundle), '0,00');
  tape.strictEqual(formatNumber(-0, null, bundle), '0,00');

  tape.strictEqual(formatNumber(1.1, null, bundle), '1,10');
  tape.strictEqual(formatNumber(-1.1, null, bundle), '-1,10');

  tape.strictEqual(formatNumber(1000, null, bundle), '1.000,00');
  tape.strictEqual(formatNumber(-1000, null, bundle), '-1.000,00');

  tape.strictEqual(formatNumber(1000, {useGrouping: false}, bundle), '1000,00');
  tape.strictEqual(formatNumber(-1000, {useGrouping: false}, bundle), '-1000,00');

  tape.strictEqual(formatNumber(1000, {fractionDigits: 0}, bundle), '1.000');
  tape.strictEqual(formatNumber(-1000, {fractionDigits: 0}, bundle), '-1.000');

});

