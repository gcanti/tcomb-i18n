'use strict';

var test = require('tape');
var locale = require('../lib/locale');
var t = require('tcomb');

var Language = t.enums.of('it en', 'Language');
var Country = t.enums.of('IT US', 'Country');
var Locale = locale(Language, Country);
var it_IT = new Locale({language: 'it', country: 'IT'});
var en_US = new Locale({language: 'en', country: 'US'});

test('locale', function (tape) {

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

  tape.test('toString', function (tape) {
    tape.plan(1);

    var locale = new Locale({language: 'it', country: 'IT'});

    tape.strictEqual(
      locale.toString(),
      'it-IT',
      'should return <language>-<country>');

  });

  tape.test('fromString', function (tape) {
    tape.plan(1);

    tape.strictEqual(
      Locale.fromString('it-IT').toString(),
      'it-IT',
      'should return a locale');

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

});
