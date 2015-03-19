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

    var locale = new Locale({language: 'it', country: 'IT'});

    tape.strictEqual(
      locale.language,
      'it',
      'should have a language field');

    tape.strictEqual(
      locale.country,
      'IT',
      'should have a language field');

  });

  tape.test('getLanguageName', function (tape) {
    tape.plan(2);

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

  });

  tape.test('getCountryName', function (tape) {
    tape.plan(2);

    Locale.addCountries({
      it: {
        IT: 'Italia',
        US: 'Stati Uniti'
      }
    });

    tape.strictEqual(
      it_IT.getCountryName(),
      'Italia',
      'should return the base language name');

    tape.strictEqual(
      it_IT.getCountryName(en_US.country),
      'Stati Uniti',
      'should return the language name');

  });

  tape.test('getLocaleName', function (tape) {
    tape.plan(2);

    tape.strictEqual(
      it_IT.getLocaleName(),
      'Italiano (Italia)',
      'should return the base country name');

    tape.strictEqual(
      it_IT.getLocaleName(en_US),
      'Inglese (Stati Uniti)',
      'should return the country name');

  });

  tape.test('getMessage', function (tape) {
    tape.plan(1);

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


  });

});
