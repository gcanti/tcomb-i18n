'use strict';

var tape = require('tape');
var formatInteger = require('../lib/formatInteger');

tape.test('formatInteger', function (tape) {
  tape.plan(12);

  tape.strictEqual(formatInteger(1000), '1,000');
  tape.strictEqual(formatInteger(-1000), '-1,000');

  var bundle = { // it-IT
    grouping: '.',
    decimal: ','
  };

  tape.strictEqual(formatInteger(0, null, bundle), '0');
  tape.strictEqual(formatInteger(-0, null, bundle), '0');

  tape.strictEqual(formatInteger(1.1, null, bundle), '1');
  tape.strictEqual(formatInteger(-1.1, null, bundle), '-1');

  tape.strictEqual(formatInteger(1000, null, bundle), '1.000');
  tape.strictEqual(formatInteger(-1000, null, bundle), '-1.000');

  tape.strictEqual(formatInteger(1000, true, bundle), '1.000');
  tape.strictEqual(formatInteger(-1000, true, bundle), '-1.000');

  tape.strictEqual(formatInteger(1000, false, bundle), '1000');
  tape.strictEqual(formatInteger(-1000, false, bundle), '-1000');

});

