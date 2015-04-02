Simple i18n / i17n helpers (WIP)

# Primitive functions

## ./lib/formatNumber(number, [options], [bundle])

Converts numbers to strings.

### options

```js
{
  fractionDigits: 2,  // number of digits, default 2
  useGrouping: true   // if true thousands are separated by `bundle.grouping`, default true
}
```

### bundle

```js
// default en-US
{
  grouping: ',',
  decimal: '.'
}
```

**Example**

```js
formatNumber(1000); // => '1,000.00'
formatNumber(1000, {useGrouping: false}); // => '1000.00'
formatNumber(1000, {fractionDigits: 0}); // => '1,000'

// it-IT
formatNumber(1000, null, {
  grouping: '.',
  decimal: ','
}); // => '1.000,00'
```

## ./lib/parseNumber(string, [bundle])

Converts strings to numbers.

### bundle

```js
// default en-US
{
  grouping: ',',
  decimal: '.'
}
```

**Example**

```js
parseNumber('1,000.00'); // => 1000
// it-IT
parseNumber('1.000,00', {
  grouping: '.',
  decimal: ','
}); // => 1000
```

## ./lib/formatDate(date, [pattern], [bundle])

### pattern

```js
// en-US
'<%= M %>/<%= D %>/<%= YY %>'
```

- `YY`: long year (4 digits)
- `Y`: short year (2 digits)
- `MM`: long month (Jenuary, February, ...)
- `M`: short month ('01', '02', ...)
- `D`: short day ('01', '02', ...)
- `h`: short hours ('01', '02', ...)
- 'm': short minutes ('01', '02', ...)


### bundle

```js
// en-US
{
  months: {
    '01': 'Jenuary',
    '02': 'Febrary',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  }
}
```

**Example**

```js
var date = new Date(1973, 10, 1);
formatDate(date); // => '11/01/1973'
formatDate(date, '<%= D %>/<%= M %>/<%= YY %>'); // => '01/11/1973'
formatDate(date, 'short', {'short': '<%= D %>/<%= M %>/<%= YY %>'}); // => '01/11/1973'
formatDate(date, '<%= D %>, <%= MM %> <%= YY %>'); // => '01, November 1973'
```
