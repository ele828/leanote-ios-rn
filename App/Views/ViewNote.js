'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text
} = React;

var Base = require("../Common/Base");
var Icon = require("react-native-icons");
var Fetcher = require("../Common/Fetcher");
var HTMLWebView = require('react-native-html-webview');
// var Markdown = require('react-native-markdown');
var Tools = require('../Common/Tools');

var NoteService = require('../Service/note');

module.exports = React.createClass({
  getInitialState() {
      return {
        isMarkdown: false,
        content: '',
      }
  },

  componentDidMount() {
    var me = this;
    this.setState({isMarkdown : this.props.data.note["IsMarkdown"]});

    NoteService.getNoteContent(this.props.data.note["NoteId"], function(note) {
      if (!note) {
        return;
      }
      var content = note.Content;
      if(!me.state.isMarkdown) {
        var html = `
          <!DOCTYPE html>
          <html>
          <title>Leanote html</title>
          <head>
          <link href="libs/css/bootstrap.css" rel="stylesheet">
          <link href="libs/css/style.css" rel="stylesheet">
          <body>
          <div class="each-post">` + content +
          `</div>
          <script src="libs/jquery-1.9.0.min.js"></script>
          <link href="libs/google-code-prettify/prettify.css" type="text/css" rel="stylesheet"/>
          <script src="libs/google-code-prettify/prettify.js"></script>
          <script>
            $("pre").addClass("prettyprint"); // linenums
            prettyPrint();
          </script>
          </body>
          </html>
          `;
        me.setState({content: html});
      }
      else {
        var html = `
          <!DOCTYPE html>
          <html>
          <title>Leanote Markdown to Html Demo</title>
          <head>
          <link href="libs/css/bootstrap.css" rel="stylesheet">
          <link href="libs/css/style.css" rel="stylesheet">
          </head>

          <body>
          <div class="each-post">
          <h1 class="title">Welcome to Leanote!</h1>
          <div id="content" class="md-content"></div>

          <textarea id="md">` + content +
          ` </textarea>
            </div>

          <script src="libs/jquery-1.9.0.min.js"></script>
          <link href="libs/google-code-prettify/prettify.css" type="text/css" rel="stylesheet"/>
          <script src="libs/google-code-prettify/prettify.js"></script>
          <!-- markdown 开始 -->
          <script src="libs/markdown-to-html.js"></script>
          <script>
          markdownToHtml(document.getElementById('md').value,
            document.getElementById('content'),
            function(html) {
              $("pre").addClass("prettyprint"); // linenums
              prettyPrint();
          });
          </script>
          <!-- markdown 结束 -->
          </body>

          </html>`;
        me.setState({content: html});
      }
  });

    /*
    Fetcher.getNoteContent(this.props.data.note["NoteId"])
      .then((content) => {
        if(!this.state.isMarkdown) {

          var html = `<!DOCTYPE html>
                      <html>
                      <title>Leanote html</title>
                      <head>
                      <link href="libs/css/bootstrap.css" rel="stylesheet">
                      <link href="libs/css/style.css" rel="stylesheet">
                      <body>
                      <div class="each-post">` + content +
                      `</div>
                      <script src="libs/jquery-1.9.0.min.js"></script>
                      <link href="libs/google-code-prettify/prettify.css" type="text/css" rel="stylesheet"/>
                      <script src="libs/google-code-prettify/prettify.js"></script>
                      <script>
                        $("pre").addClass("prettyprint"); // linenums
                        prettyPrint();
                      </script>
                      </body>
                      </html>
                      `;
          this.setState({content: html});
        } else {
          var html = `<!DOCTYPE html>
                      <html>
                      <title>Leanote Markdown to Html Demo</title>
                      <head>
                      <link href="libs/css/bootstrap.css" rel="stylesheet">
                      <link href="libs/css/style.css" rel="stylesheet">
                      </head>

                      <body>
                      <div class="each-post">
                      <h1 class="title">Welcome to Leanote!</h1>
                      <div id="content" class="md-content"></div>

                      <textarea id="md">` + content +
                      ` </textarea>
                        </div>

                      <script src="libs/jquery-1.9.0.min.js"></script>
                      <link href="libs/google-code-prettify/prettify.css" type="text/css" rel="stylesheet"/>
                      <script src="libs/google-code-prettify/prettify.js"></script>
                      <!-- markdown 开始 -->
                      <script src="libs/markdown-to-html.js"></script>
                      <script>
                      markdownToHtml(document.getElementById('md').value,
                        document.getElementById('content'),
                        function(html) {
                          $("pre").addClass("prettyprint"); // linenums
                          prettyPrint();
                      });
                      </script>
                      <!-- markdown 结束 -->
                      </body>

                      </html>`;
          this.setState({content: html});
        }
      });
    */
  },

  render() {
    var contentView = (
      <HTMLWebView
        style={{marginLeft:-20, width: Base.width+30}}
        html={this.state.content}
        makeSafe={false}
        autoHeight={true}
        onLink={{}}/>
    );
    return (
      <View style={styles.container}>
        <View style={styles.contentView}>
          <ScrollView style={{position:'absolute', top: 0, height: Base.height-60, width: Base.width}}>
            <View style={styles.header}>
                <Text style={styles.title}
                  numberOfLines={1}
                >
                  {this.props.data.note["Title"]}
                </Text>
               
                <View style={styles.noteInfo}>
                  <Icon
                    name='fontawesome|book'
                    size={13}
                    color='#ccc'
                    style={styles.bookIcon}
                  />

                  <Text style={styles.notebook}>
                    {this.props.data.note["NotebookTitle"] + " "}
                  </Text>

                  <Icon
                    name='fontawesome|clock-o'
                    size={13}
                    color='#ccc'
                    style={styles.clockIcon}
                  />

                  <Text style={styles.updatedTime}>
                    {Tools.formatDate(this.props.data.note["UpdatedTime"])}
                  </Text>
                  
                </View>

                <View style={styles.line}></View>
            </View>

            {contentView}

          </ScrollView>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  header: {
      alignItems: 'center',
  },
  container: {
    flex: 1,
    height: Base.height-50,
    backgroundColor: '#fff',
  },
  contentView: {
    flex: 1,
    width: Base.width - 10,
    alignSelf: 'center',
    height: Base.height-50,
    alignItems: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    alignSelf: 'center',
  },
  line: {
    marginTop: 7,
    backgroundColor: '#eee',
    height: 1,
    width: Base.width,
  },
  info: {
    marginTop: 7,
    fontSize: 12,
    color: '#a6a6a6',
  },
  bookIcon: {
    width: 20,
    height:20,
  },
  clockIcon: {
    width: 20,
    height:20,
  },

  updatedTime: {
    marginTop: 3,
    color: '#838383',
    fontSize: 12,
  },
  notebook: {
    marginTop: 4,
    color: '#838383',
    fontSize: 12,
  },
  noteInfo: {
    marginTop: 8,
    marginLeft: 15,
    flexDirection: 'row',
  },

});
