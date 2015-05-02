var parse5 = require('parse5');
var _ = require('underscore');

function escapeHtml(s) {
  return s.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/\>/g, '&gt;').replace(/\"/g, '&quot;');
}

module.exports = function sanitize(html, config) {
  config = _.defaults({}, config, module.exports.DEFAULT_CONFIG);
  var allowedTags = _.indexBy(config.allowedTags, _.identity);
  var _fragments = [];
  var output = function (strings) {
    _fragments.push(strings.join(""));
  };
  var dropContents = 0;
  var parser = new parse5.SimpleApiParser({
    startTag: function(tagName, attrs, selfClosing /*, [location] */) {
      if (_.has(allowedTags, tagName)) {
        if (dropContents) {
          return;
        }
        output(["<",tagName]);
        _.each(attrs, function (a) {
          var name = a.name, value = a.value;
          if (_.has(config.allowedAttributes, name)) {
            var attributeInfo = config.allowedAttributes[name];
            if ((!attributeInfo.allowedTags && attributeInfo.allTags) ||
                (attributeInfo.allowedTags && _.contains(attributeInfo.allowedTags, tagName))) {
              if (!attributeInfo.filter || attributeInfo.filter(value)) {
                output([" ", name, '="', escapeHtml(value), '"']);
              }
            }
          }
        });
        output([">"]);
      } else if (_.contains(config.dropContents, tagName)) {
        dropContents++;
      }
    },

    endTag: function(tagName /*, [location] */) {
      if (_.has(allowedTags, tagName)) {
        output(["</", tagName, ">"]);
      } else if (_.contains(config.dropContents, tagName)) {
        dropContents--;
      }
    },

    text: function(text /*, [location] */) {
      if (!dropContents) {
        output([escapeHtml(text)]);
      }
    }
  });
  parser.parse(html);
  return _fragments.join('');
};

module.exports.DEFAULT_CONFIG = {
  allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol', 'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre' ],
  allowedAttributes: {
    'class': {
      allTags: true
    },
    href: {
      allowedTags: ["a"],
      filter: function (value) {
        // Only let through absolute http, mailto and tel urls by default
        return (/^(https?|mailto|tel):/i).exec(value);
      }
    }
  },
  // Drop contents of these tags if they're not in the allowed list
  // (the default is to drop the tag but keep the contents). Tags in
  // here that are also in allowedTags are ignored.
  dropContents: ["script", "style"]
};
