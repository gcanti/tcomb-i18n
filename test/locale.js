'use strict';

var tape = require('tape');
var locale = require('../lib/locale');
var t = require('tcomb');

var Language = t.enums.of('it en', 'Language');
var Country = t.enums.of('IT US', 'Country');
var Locale = locale(Language, Country);
var it_IT = new Locale({language: 'it', country: 'IT'});
var en_US = new Locale({language: 'en', country: 'US'});

tape.test('fields', function (tape) {
  tape.plan(2);

  Locale.clear();
  var locale = new Locale({language: 'it', country: 'IT'});

  tape.strictEqual(
    locale.language,
    'it',
    'should have a language field');

  tape.strictEqual(
    locale.country,
    'IT',
    'should have a country field');

});

tape.test('toString(pattern?: string)', function (tape) {
  tape.plan(2);

  Locale.clear();
  var locale = new Locale({language: 'it', country: 'IT'});

  tape.strictEqual(
    locale.toString(),
    'it-IT',
    'should return a string representation');

  tape.strictEqual(
    locale.toString('%s_%s'),
    'it_IT',
    'should handle the optional param `pattern`');

});

tape.test('fromString(str: string, separator?: string)', function (tape) {
  tape.plan(2);

  Locale.clear();
  tape.strictEqual(
    Locale.fromString('it-IT').toString(),
    'it-IT',
    'should return a locale');

  tape.strictEqual(
    Locale.fromString('it_IT', '_').toString(),
    'it-IT',
    'should handle the optional param `separator`');

});

tape.test('getLanguageName', function (tape) {
  tape.plan(4);

  Locale.clear();
  Locale.addLanguages({
    it: {
      it: 'Italiano',
      en: 'Inglese'
    }
  });

  tape.strictEqual(
    it_IT.getLanguageName(),
    'Italiano',
    'should return the base language name');

  tape.strictEqual(
    it_IT.getLanguageName(en_US.language),
    'Inglese',
    'should return the language name');

  Locale.addLanguages({
    'it-IT': {
      it: 'exact Italiano',
      en: 'exact Inglese'
    }
  });

  tape.strictEqual(
    it_IT.getLanguageName(),
    'exact Italiano',
    'should return the exact base language name');

  tape.strictEqual(
    it_IT.getLanguageName(en_US.language),
    'exact Inglese',
    'should return the exact language name');

});

tape.test('getCountryName', function (tape) {
  tape.plan(4);

  Locale.clear();
  Locale.addCountries({
    it: {
      IT: 'Italia',
      US: 'Stati Uniti'
    }
  });

  tape.strictEqual(
    it_IT.getCountryName(),
    'Italia',
    'should return the base country name');

  tape.strictEqual(
    it_IT.getCountryName(en_US.country),
    'Stati Uniti',
    'should return the country name');

  Locale.addCountries({
    'it-IT': {
      IT: 'exact Italia',
      US: 'exact Stati Uniti'
    }
  });

  tape.strictEqual(
    it_IT.getCountryName(),
    'exact Italia',
    'should return the exact base country name');

  tape.strictEqual(
    it_IT.getCountryName(en_US.country),
    'exact Stati Uniti',
    'should return the exact country name');

});

tape.test('getLocaleName', function (tape) {
  tape.plan(4);

  Locale.clear();
  Locale.addLanguages({
    it: {
      it: 'Italiano',
      en: 'Inglese'
    }
  });
  Locale.addCountries({
    it: {
      IT: 'Italia',
      US: 'Stati Uniti'
    }
  });

  tape.strictEqual(
    it_IT.getLocaleName(),
    'Italiano (Italia)',
    'should return the base locale name');

  tape.strictEqual(
    it_IT.getLocaleName(en_US),
    'Inglese (Stati Uniti)',
    'should return the locale name');

  Locale.addCountries({
    'it-IT': {
      IT: 'exact Italia',
      US: 'exact Stati Uniti'
    }
  });

  tape.strictEqual(
    it_IT.getLocaleName(),
    'Italiano (exact Italia)',
    'should return the exact base locale name');

  tape.strictEqual(
    it_IT.getLocaleName(en_US),
    'Inglese (exact Stati Uniti)',
    'should return the exact locale name');


});

tape.test('getMessage', function (tape) {
  tape.plan(2);

  Locale.clear();
  Locale.addMessages({
    it: {
      page: {
        message1: 'my message 1'
      }
    }
  });

  tape.strictEqual(
    it_IT.getMessage('page.message1'),
    'my message 1',
    'should return the a message');

  Locale.addMessages({
    'it-IT': {
      page: {
        message1: 'exact my message 1'
      }
    }
  });

  tape.strictEqual(
    it_IT.getMessage('page.message1'),
    'exact my message 1',
    'should return the a message');

});

tape.test('formatNumber', function (tape) {
  tape.plan(10);

  Locale.clear();
  Locale.addNumbers({
    it: {
      grouping: '.',
      decimal: ','
    }
  });

  tape.strictEqual(it_IT.formatNumber(0), '0,00');
  tape.strictEqual(it_IT.formatNumber(-0), '0,00');

  tape.strictEqual(it_IT.formatNumber(1.1), '1,10');
  tape.strictEqual(it_IT.formatNumber(-1.1), '-1,10');

  tape.strictEqual(it_IT.formatNumber(1000), '1.000,00');
  tape.strictEqual(it_IT.formatNumber(-1000), '-1.000,00');

  tape.strictEqual(it_IT.formatNumber(1000, {useGrouping: false}), '1000,00');
  tape.strictEqual(it_IT.formatNumber(-1000, {useGrouping: false}), '-1000,00');

  tape.strictEqual(it_IT.formatNumber(1000, {fractionDigits: 0}), '1.000');
  tape.strictEqual(it_IT.formatNumber(-1000, {fractionDigits: 0}), '-1.000');

});

tape.test('parseNumber', function (tape) {
  tape.plan(5);

  Locale.clear();
  Locale.addNumbers({
    it: {
      grouping: '.',
      decimal: ','
    }
  });

  tape.strictEqual(it_IT.parseNumber('0,00'), 0);

  tape.strictEqual(it_IT.parseNumber('1,10'), 1.1);
  tape.strictEqual(it_IT.parseNumber('-1,10'), -1.1);

  tape.strictEqual(it_IT.parseNumber('1.000,00'), 1000);
  tape.strictEqual(it_IT.parseNumber('-1.000,00'), -1000);

});

tape.test('formatInteger', function (tape) {
  tape.plan(1);

  Locale.clear();
  Locale.addNumbers({
    it: {
      grouping: '.',
      decimal: ','
    }
  });

  tape.strictEqual(it_IT.formatInteger(100), '100');

});

tape.test('formatPercentage', function (tape) {
  tape.plan(5);

  Locale.clear();
  Locale.addNumbers({
    it: {
      grouping: '.',
      decimal: ','
    }
  });

  tape.strictEqual(it_IT.formatPercentage(0), '0%');
  tape.strictEqual(it_IT.formatPercentage(100), '100%');
  tape.strictEqual(it_IT.formatPercentage(50), '50%');
  tape.strictEqual(it_IT.formatPercentage(50.4), '50%');
  tape.strictEqual(it_IT.formatPercentage(50.5), '51%');

});

tape.test('formatDate', function (tape) {
  tape.plan(3);

  Locale.clear();
  Locale.addDates({
    it: {
      short: '<%= D %>/<%= M %>/<%= YY %>',
      long: '<%= D %>, <%= MM %> <%= YY %>',
      months: {
        '01': 'Gennaio',
        '02': 'Febbraio',
        '03': 'Marzo',
        '04': 'Aprile',
        '05': 'Maggio',
        '06': 'Giugno',
        '07': 'Luglio',
        '08': 'Agosto',
        '09': 'Settembre',
        '10': 'Ottobre',
        '11': 'Novembre',
        '12': 'Dicembre'
      }
    }
  });

  var date = new Date(1973, 10, 1);

  tape.strictEqual(it_IT.formatDate(date), '1973-11-01');
  tape.strictEqual(it_IT.formatDate(date, 'short'), '01/11/1973');
  tape.strictEqual(it_IT.formatDate(date, 'long'), '01, Novembre 1973');

});

tape.test('formatCurrency', function (tape) {
  tape.plan(2);

  Locale.clear();

  tape.strictEqual(it_IT.formatCurrency('EUR'), 'EUR');

  Locale.addCurrencies({
    it: {
      EUR: '€'
    }
  });

  tape.strictEqual(it_IT.formatCurrency('EUR'), '€');

});

tape.test('formatAmount', function (tape) {
  tape.plan(1);

  Locale.clear();
  Locale.addNumbers({
    it: {
      grouping: '.',
      decimal: ','
    }
  });
  Locale.addCurrencies({
    it: {
      EUR: '€'
    }
  });

  tape.strictEqual(it_IT.formatAmount(1000.12, 'EUR'), '€ 1.000,12');

});
