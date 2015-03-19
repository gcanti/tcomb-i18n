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

  Locale.addLanguages = function (languages) {
    t.mixin(bundle.languages, languages);
  };

  Locale.addCountries = function (countries) {
    t.mixin(bundle.countries, countries);
  };

  Locale.prototype.toString = function () {
    return this.language + '-' + this.country;
  };

  Locale.prototype.getLanguageName = function (language) {
    language = language || this.language;
    if (bundle.languages[this.language]) {
      return bundle.languages[this.language][language];
    }
    if (bundle.languages[this]) {
      return bundle.languages[this][language];
    }
    t.fail(t.format('getLanguageName(): missing translation of language %s in locale %s', language, this));
  };

  Locale.prototype.getCountryName = function (country) {
    country = country || this.country;
    if (bundle.countries[this.language]) {
      return bundle.countries[this.language][country];
    }
    if (bundle.countries[this]) {
      return bundle.countries[this][country];
    }
    t.fail(t.format('getLanguageName(): missing translation of country %s in locale %s', country, this));
  };

  Locale.prototype.getLocaleName = function (locale) {
    locale = locale || this;
    return this.getLanguageName(locale.language) + ' (' + this.getCountryName(locale.country) + ')';
  };

  return Locale;

}

module.exports = locale;