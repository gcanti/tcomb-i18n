'use strict';

var tape = require('tape');
var formatPercentage = require('../lib/formatPercentage');

tape.test('formatPercentage', function (tape) {
  tape.plan(5);

  tape.strictEqual(formatPercentage(0), '0%');
  tape.strictEqual(formatPercentage(100), '100%');
  tape.strictEqual(formatPercentage(50), '50%');
  tape.strictEqual(formatPercentage(50.4), '50%');
  tape.strictEqual(formatPercentage(50.5), '51%');

});
