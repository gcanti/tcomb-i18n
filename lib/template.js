'use strict';

function template(src, options) {
  options = options || template.jsp;
  var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' +
    'with(obj||{}){__p.push(\'' +
    src.replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(options.interpolate, function(_, code) {
          return "'," + code.replace(/\\'/g, "'") + ",'";
      })
      .replace(options.evaluate || null, function(_, code) {
          return "');" + code.replace(/\\'/g, "'")
              .replace(/[\r\n\t]/g, ' ') + "__p.push('";
      })
      .replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t') + "');}return __p.join('');";
  return new Function('obj', tmpl);
}

template.jsp = {
  evaluate    : /<%([\s\S]+?)%>/g,
  interpolate : /<%=([\s\S]+?)%>/g
};

template.mustache = {
  evaluate    : /{{([\s\S]+?)}}/g,
  interpolate : /{{=([\s\S]+?)}}/g
};

module.exports = template;