safe-html
=========
 [![NPM](https://nodei.co/npm/safe-html.png?downloads&downloadRank)](https://nodei.co/npm/safe-html/)

Santitize HTML using a whitelist of allowed elements and attributes. Parses the HTML using [parse5](https://www.npmjs.com/package/parse5) which uses the [HTML5 parsing algorithm](http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html) (meaning it should parse documents the same way your browser does).


```javascript
var santitized = safeHtml("<div onclick=\"javascript:alert('Oh no!')>Hello <script>alert('Whoops!')</script>World</div>");
// santitized is now "<div>Hello World</div>";
```

Written by Thomas Parslow
([almostobsolete.net](http://almostobsolete.net) and
[tomparslow.co.uk](http://tomparslow.co.uk)) as part of Active Inbox
([activeinboxhq.com](http://activeinboxhq.com/)).

[![Build Status](https://travis-ci.org/almost/safe-html.svg)](https://travis-ci.org/almost/safe-html)

You might want to also check out [sanitize-html](https://www.npmjs.com/package/sanitize-html) which has more features and has been around longer.

Install
-------

```bash
npm install --save safe-html
```

Example
-------

```javascript
var safeHtml = require('safe-html');
var config = {
  allowedTags: ["div", "span", "b", "i", "a"],
  allowedAttributes: {
    'class': {
      allTags: true
    },
    'href': {
      allowedTags: ["a"],
      filter: function (value) {
        // Only let through http urls
        return !/^https?:/i.exec(value);
      }
    }
  }
};
var santitized = safeHtml("...potentially bad html...")
```

Security Warning
----------------

WARNING: SECURITY IS HARD

I am not perfect and I make mistakes, *you* are not perfect and you make mistakes. If you're using this in a secuirity critical thing then be cautious and think very carefully about what you're doing.

Contributing
------------

Fixed or improved stuff? Great! Send me a pull request [through GitHub](http://github.com/almost/safe-html) or get in touch on Twitter [@almostobsolete](https://twitter.com/almostobsolete) or email at [tom@almostobsolete.net](mailto:tom@almostobsolete.net)