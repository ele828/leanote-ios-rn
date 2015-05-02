# react-native-html-webview

Display (possibly untrusted) HTML using a UIWebView in React Native.

Uses an HTML Sanitizer to remove only let through a whitelist of tags
and attributes (so it removes all javascript). Also supports
automatically adjusting the height of the webview to contain the
contents you give it.

Written by Thomas Parslow
([almostobsolete.net](http://almostobsolete.net) and
[tomparslow.co.uk](http://tomparslow.co.uk)) as part of Active Inbox
([activeinboxhq.com](http://activeinboxhq.com/)).

A couple of similar projects are
[HTMLText](https://github.com/siuying/react-native-htmltext) and
[HTMLView](https://github.com/jsdf/react-native-htmlview) both of
which render a subset of HTML as React Native views. This project
takes a slightly different approach of using a UIWebView giving a full
HTML renderer, but that means it has to rely on an HTML sanitizer to
clean up untrusted HTML.

## Installation

Install using npm with `npm install --save react-native-html-webview`

You then need to add the Objective C part to your XCode project. Drag
`AIBHTMLWebView.xcodeproj` from the
`node_modules/react-native-html-webview` folder into your XCode
projec. Click on the your project in XCode, goto `Build Phases` then
`Link Binary With Libraries` and add `libAIBHTMLWebView.a`.

NOTE: Make sure you don't have the `AIBHTMLWebView` project open seperately in XCode otherwise it won't work.

## Usage

```javascript
var HTMLWebView = require('react-native-html-webview');

var testView = React.createClass({
  render: function() {
    return (
      <View>
        <HTMLWebView
            style={{width: 300}}
            html={this.state.htmlContents}
            makeSafe={true}
            autoHeight={true}
            onLink={this.onLink}/>
      </View>
    );
  },
  onLink: function (href) {
    // Link was clicked!
  }
});
```

## Properties

- **html** : The html content to display as a string
- **makeSafe** (default: true) : Run the HTML through an HTML
    sanitizer ([safe-html](http://github.com/almost/safe-html)) before
    inserting it to remove script tags and similar unsafe things. Pass
    in `true` to use the default options for safe-html, pass in
    `false` to turn it off, or pass in an object to set config options
    for safe-html.
- **autoHeight** (default: false) : Automatically adjust the height of
    the webview to fit the contents (also turns off scrolling).
- **onLink** : Pass in a function to be called when the user clicks a
    link, the function will be given the href.

## Security Warning

This relies on HTML sanitization to protect you from executing
JavaScript included in untrusted HTML. It's using my
[safe-html](https://www.npmjs.com/package/safe-html) library which
works based on a whitelist of allowed tags but it's still possbile
someone could find a way round it.

If an attacker *did* find a way round the sanitizer they'd still only
be running JavaScript inside a WebView. So they wouldn't automatically
get access to the rest of your app, but they would be able to load
other stuff into the webview and possibly other stuff that you may not
want.

## Feedback Welcome!

Feedback, questions, suggestions and most of all Pull Requests are
very welcome. This is an early version and I want to figure out the
best way to continue it.

I'm also available for freelance work!

I'm [@almostobsolete](http://twitter.com/almostobsolete) on Twitter my
email is [tom@almostobsolete.net](mailto:tom@almostobsolete.net) and
you can find me on the web at
[tomparslow.co.uk](http://tomparslow.co.uk) and
[almostobsolete.net](http://almostobsolete.net)
