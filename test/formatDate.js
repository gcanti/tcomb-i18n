'use strict';

var tape = require('tape');
var formatDate = require('../lib/formatDate');

tape.test('formatDate', function (tape) {
  tape.plan(4);

  var date = new Date(1973, 10, 1);

  tape.strictEqual(formatDate(date), '11/01/1973');
  tape.strictEqual(formatDate(date, '<%= D %>/<%= M %>/<%= YY %>'), '01/11/1973');
  tape.strictEqual(formatDate(date, 'short', {'short': '<%= D %>/<%= M %>/<%= YY %>'}), '01/11/1973');
  tape.strictEqual(formatDate(date, '<%= D %>, <%= MM %> <%= YY %>'), '01, November 1973');

});
