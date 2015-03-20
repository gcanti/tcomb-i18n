'use strict';

var t = require('tcomb');
var fail = t.fail;
var format = t.format;
var Str = t.Str;
var maybe = t.maybe;

function split(str, separator) {
  return t.tuple([Str, Str])(Str(str).split(separator));
}

// locale combinator: given a Language and a Country enum
// returns a Locale type
function locale(Language, Country, name) {

  var bundle = {
    languages: {},
    countries: {},
    numbers: {},
    dates: {},
    currencies: {},
    messages: {}
  };

  var Locale = t.struct({
    language: Language,
    country: Country
  }, name || 'Locale');

  Locale.prototype.toString = function (pattern) {
    pattern = maybe(Str)(pattern) || '%s-%s';
    return format(pattern, this.language, this.country);
  };

  Locale.fromString = function (str, separator) {
    separator = maybe(Str)(separator) || '-';
    var arr = split(str, separator);
    return new Locale({language: arr[0], country: arr[1]});
  };

  // for tests
  Locale.clear = function () {
    bundle = {
      languages: {},
      countries: {},
      numbers: {},
      dates: {},
      currencies: {},
      messages: {}
    };
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
    language = maybe(Language)(language) || this.language;
    var languages = bundle.languages[this] || bundle.languages[this.language] || {};
    return languages[language] || fail(format('missing translation of language `%s` for locale `%s`', language, this));
  };

  Locale.prototype.getCountryName = function (country) {
    country = maybe(Country)(country) || this.country;
    var countries = bundle.countries[this] || bundle.countries[this.language] || {};
    return countries[country] || fail(format('missing translation of country `%s` for locale `%s`', country, this));
  };

  Locale.prototype.getLocaleName = function (locale) {
    locale = maybe(Locale)(locale) || this;
    return this.getLanguageName(locale.language) + ' (' + this.getCountryName(locale.country) + ')';
  };

  Locale.prototype.getMessage = function (path, separator) {
    separator = maybe(Str)(separator) || '.';
    var messages = bundle.messages[this] || bundle.messages[this.language] || {};
    var message = Str(path).split(separator).reduce(function (acc, key) {
      return acc[key] ? acc[key] : fail(format('missing message for key `%s`, path `%s` and locale `%s`', key, path, this));
    }.bind(this), messages);
    return message;
  };

  //
  // i17n methods
  //

  return Locale;

}

module.exports = locale;