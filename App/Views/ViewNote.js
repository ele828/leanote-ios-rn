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
var Markdown = require('react-native-markdown');

module.exports = React.createClass({

  getInitialState: function() {
      return {
        isMarkdown: false,
        content: '',
      }
  },

  componentDidMount: function() {
    this.setState({isMarkdown : this.props.data.note["IsMarkdown"]});
    Fetcher.getNoteContent(this.props.data.note["NoteId"])
      .then((content) => {
        console.log(content);
        this.setState({content: content});
      });
  },
  render() {
    var contentView = this.state.isMarkdown
                      ? (
                        <Markdown>
                          {this.state.content}
                        </Markdown>
                      )
                      : (
                        <HTMLWebView
                          style={{width: Base.width-10}}
                          html={this.state.content}
                          makeSafe={true}
                          autoHeight={true}
                          onLink={{}}/>
                      )
    return (
        <View style={styles.container}>
          <View style={styles.contentView}>
            <Text style={styles.title}
              numberOfLines={1}
            >
              {this.props.data.note["Title"]}
            </Text>
            <Text style={styles.info}>
              笔记本：{this.props.data.note["NotebookTitle"]+"    "}
              时间：{this.props.data.note["UpdatedTime"]}
            </Text>
            <View style={styles.line}></View>
            <ScrollView style={{height: Base.height-100, width: Base.width-10}}>
              {contentView}
            </ScrollView>
          </View>
        </View>
    )
  }
});

var styles = StyleSheet.create({
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
  }

});
