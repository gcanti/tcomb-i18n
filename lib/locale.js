'use strict';

var t = require('tcomb');
var template = require('./template');
var fail = t.fail;
var format = t.format;
var mixin = t.mixin;
var Str = t.Str;
var maybe = t.maybe;

function getOrElse(x, y) {
  return t.Nil.is(x) ? y : x;
}

function escapeRegexp(str) {
  return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
}

var insertGroupingRegexp = /(\d+)(\d{3})/;

function insertGrouping(str, grouping) {
  var times = Math.floor(str.length / 3);
  for (var i = 0 ; i < times ; i++) {
    str = str.replace(insertGroupingRegexp, "$1" + grouping + "$2");
  }
  return str;
}

function stripSymbols(str, grouping, decimal) {
  str = str.replace(new RegExp(escapeRegexp(grouping), 'gm'), '');
  return str.replace(new RegExp(escapeRegexp(decimal), 'gm'), '.');
}

function padLeft(str, len) {
  var times = len - str.length;
  for (var i = 0 ; i < times ; i++ ) {
    str = '0' + str;
  }
  return str;
}

function splitDate(date, dates) {
  var YY = date.getFullYear() + '';
  var M = padLeft(date.getMonth() + 1, 2);
  return {
    YY: YY,
    Y: YY.substr(-2),
    M: M,
    MM: dates.months[M] || M,
    D: padLeft(date.getDate(), 2),
    h: padLeft(date.getHours(), 2),
    m: padLeft(date.getMinutes(), 2)
  };
}

// `locale` combinator: given a `Language` and a `Country` enum
// returns a `Locale` type
function locale(Language, Country, name) {

  var bundle;

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
    var arr = t.tuple([Str, Str])(Str(str).split(separator))
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

  Locale.prototype.getMessage = function (path, values) {
    var messages = bundle.messages[this] || bundle.messages[this.language] || {};
    var message = Str(path).split('.').reduce(function (acc, key) {
      return acc[key] ? acc[key] : fail(format('missing message for key `%s`, path `%s` and locale `%s`', key, path, this));
    }.bind(this), messages);
    return values ? template(message)(values) : message;
  };

  //
  // i17n methods
  //

  Locale.prototype.formatNumber = function (number, options) {
    options = options || {};
    var fractionDigits = t.Num(getOrElse(options.fractionDigits, 2));
    var useGrouping = getOrElse(options.useGrouping, true);
    var numbers = bundle.numbers[this] || bundle.numbers[this.language] || {};
    var arr = t.Num(number).toFixed(fractionDigits).split('.');
    if (useGrouping) {
      var grouping = numbers.grouping || fail(format('missing `grouping` for locale `%s`', this));
      arr[0] = insertGrouping(arr[0], grouping);
    }
    var decimal = numbers.decimal || fail(format('missing `decimal` for locale `%s`', this));
    return arr[0] + (fractionDigits> 0 ? decimal + arr[1] : '');
  };

  Locale.prototype.parseNumber = function (str) {
    var numbers = bundle.numbers[this] || bundle.numbers[this.language] || {};
    var grouping = numbers.grouping || fail(format('missing `grouping` for locale `%s`', this));
    var decimal = numbers.decimal || fail(format('missing `decimal` for locale `%s`', this));
    return parseFloat(stripSymbols(str, grouping, decimal));
  };

  Locale.prototype.formatInteger = function (integer) {
    return this.formatNumber(integer, {fractionDigits: 0});
  };

  Locale.prototype.formatPercentage = function (percentage, options) {
    t.assert(percentage >= 0 && percentage <= 100, '`percentage` must be a number in the [0, 100] interval');
    options = mixin({fractionDigits: 0}, options, true);
    return this.formatNumber(percentage, options) + '%';
  };

  Locale.prototype.formatDate = function (date, pattern) {
    var dates = bundle.dates[this] || bundle.dates[this.language] || {};
    pattern = dates[maybe(Str)(pattern)] || '<%= YY %>-<%= M %>-<%= D %>';
    return template(pattern)(splitDate(t.Dat(date), dates));
  };

  Locale.prototype.formatCurrency = function (currency) {
    var currencies = bundle.currencies[this] || bundle.currencies[this.language] || {};
    return currencies[currency] || currency;
  };

  Locale.prototype.formatAmount = function (amount, currency, options) {
    return this.formatCurrency(currency) + ' ' + this.formatNumber(amount, options);
  };

  // initialize bundle
  Locale.clear();

  return Locale;

}

module.exports = locale;