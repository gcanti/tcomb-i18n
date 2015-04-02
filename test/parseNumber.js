'use strict';

var tape = require('tape');
var parseNumber = require('../lib/parseNumber');

tape.test('parseNumber', function (tape) {
  tape.plan(7);

  tape.strictEqual(parseNumber('1,000.00'), 1000);
  tape.strictEqual(parseNumber('-1,000.00'), -1000);

  var bundle = { // it-IT
    grouping: '.',
    decimal: ','
  };

  tape.strictEqual(parseNumber('0,00', bundle), 0);

  tape.strictEqual(parseNumber('1,10', bundle), 1.1);
  tape.strictEqual(parseNumber('-1,10', bundle), -1.1);

  tape.strictEqual(parseNumber('1.000,00', bundle), 1000);
  tape.strictEqual(parseNumber('-1.000,00', bundle), -1000);

});
