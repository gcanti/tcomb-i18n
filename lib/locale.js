'use strict';

var t = require('tcomb');

// locale combinator: given the Language and Country enums
// returns a Locale type
function locale(Language, Country, name) {

  var bundle = {
    languages: {},
    countries: {},
    number: {},
    date: {},
    messages: {}
  };

  var Locale = t.struct({
    language: Language,
    country: Country
  }, name);

  Locale.prototype.toString = function () {
    return this.language + '-' + this.country;
  };

  //
  // config methods
  //

  Locale.addLanguages = function (languages) {
    t.mixin(bundle.languages, languages);
  };

  Locale.addCountries = function (countries) {
    t.mixin(bundle.countries, countries);
  };

  Locale.addMessages = function (messages) {
    t.mixin(bundle.messages, messages);
  };

  //
  // i18n methods
  //

  Locale.prototype.getLanguageName = function (language) {
    language = language || this.language;
    var languages = bundle.languages[this.language] || bundle.languages[this];
    return languages[language] || t.fail(t.format('getLanguageName(): missing translation of language %s for locale %s', language, this));
  };

  Locale.prototype.getCountryName = function (country) {
    country = country || this.country;
    var countries = bundle.countries[this.language] || bundle.countries[this];
    return countries[country] || t.fail(t.format('getLanguageName(): missing translation of country %s for locale %s', country, this));
  };

  Locale.prototype.getLocaleName = function (locale) {
    locale = locale || this;
    return this.getLanguageName(locale.language) + ' (' + this.getCountryName(locale.country) + ')';
  };

  Locale.prototype.getMessage = function (path) {
    var messages = bundle.messages[this.language] || bundle.messages[this];
    var message = path.split('.').reduce(function (acc, x) {
      return acc[x] ? acc[x] : t.fail(t.format('getMessage(): missing message for path %s', path));
    }, messages);
    return message;
  };

  //
  // i17n methods
  //

  return Locale;

}

module.exports = locale;