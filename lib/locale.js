'use strict';

var t = require('tcomb');
var template = require('./template');
var formatNumber = require('./formatNumber');
var parseNumber = require('./parseNumber');
var formatInteger = require('./formatInteger');
var formatPercentage = require('./formatPercentage');
var formatDate = require('./formatDate');

var fail = t.fail;
var format = t.format;
var mixin = t.mixin;
var Str = t.Str;
var maybe = t.maybe;

var defaultLocaleToStringTemplate = template('<%= language %>-<%= country %>');
var defaultLocaleNameTemplate = template('<%= language %> (<%= country %>)');
var defaultFormatAmountTemplate = template('<%= currency %> <%= amount %>');

// `locale` combinator: given a `Language` and a `Country` enum
// returns a `Locale` type
function locale(Language, Country, name) {

  var bundle;

  var Locale = t.struct({
    language: Language,
    country: Country
  }, name || 'Locale');

  Locale.prototype.toString = function (pattern) {
    var tmpl = pattern ? template(maybe(Str)(pattern)) : defaultLocaleToStringTemplate;
    return tmpl({
      language: this.language,
      country: this.country
    });
  };

  Locale.fromString = function (str, separator) {
    separator = maybe(Str)(separator) || '-';
    var arr = t.tuple([Str, Str])(Str(str).split(separator));
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
    mixin(bundle.languages, languages);
  };

  Locale.addCountries = function (countries) {
    mixin(bundle.countries, countries);
  };

  Locale.addMessages = function (messages) {
    mixin(bundle.messages, messages);
  };

  Locale.addNumbers = function (numbers) {
    mixin(bundle.numbers, numbers);
  };

  Locale.addDates = function (dates) {
    mixin(bundle.dates, dates);
  };

  Locale.addCurrencies = function (currencies) {
    mixin(bundle.currencies, currencies);
  };

  Locale.addAll = function (bundle) {
    Locale.addLanguages(bundle.languages);
    Locale.addCountries(bundle.countries);
    Locale.addMessages(bundle.messages);
    Locale.addNumbers(bundle.numbers);
    Locale.addDates(bundle.dates);
    Locale.addCurrencies(bundle.currencies);
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

  Locale.prototype.getLocaleName = function (locale, pattern) {
    locale = maybe(Locale)(locale) || this;
    var tmpl = pattern ? template(maybe(Str)(pattern)) : defaultLocaleNameTemplate;
    return tmpl({
      language: this.getLanguageName(locale.language),
      country: this.getCountryName(locale.country)
    });
  };

  Locale.prototype.getMessage = function (path, values) {
    var messages = bundle.messages[this] || bundle.messages[this.language] || {};
    var message = Str(path).split('.').reduce(function (acc, key) {
      return acc[key] ? acc[key] : fail(format('missing message for key `%s`, path `%s` and locale `%s`', key, path, this));
    }.bind(this), messages);
    return t.Obj.is(values) ? template(message)(values) : message;
  };

  //
  // i17n methods
  //

  Locale.prototype.formatNumber = function (number, options) {
    return formatNumber(number, options, bundle.numbers[this] || bundle.numbers[this.language]);
  };

  Locale.prototype.parseNumber = function (str) {
    return parseNumber(str, bundle.numbers[this] || bundle.numbers[this.language]);
  };

  Locale.prototype.formatInteger = function (n, useGrouping) {
    return formatInteger(n, useGrouping, bundle.numbers[this] || bundle.numbers[this.language]);
  };

  Locale.prototype.formatPercentage = function (percentage, options) {
    return formatPercentage(percentage, options, bundle.numbers[this] || bundle.numbers[this.language]);
  };

  Locale.prototype.formatDate = function (date, pattern) {
    return formatDate(date, pattern, bundle.dates[this] || bundle.dates[this.language]);
  };

  Locale.prototype.formatCurrency = function (currency) {
    var currencies = bundle.currencies[this] || bundle.currencies[this.language] || {};
    return currencies[currency] || currency;
  };

  Locale.prototype.formatAmount = function (amount, currency, options, pattern) {
    var tmpl = pattern ? template(maybe(Str)(pattern)) : defaultFormatAmountTemplate;
    return tmpl({
      currency: this.formatCurrency(currency),
      amount: this.formatNumber(amount, options)
    });
  };

  // initialize bundle
  Locale.clear();

  return Locale;

}

module.exports = locale;