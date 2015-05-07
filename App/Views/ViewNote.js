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

// 动画需要
var TimerMixin = require('react-timer-mixin');
var tweenState = require("react-tween-state");

module.exports = React.createClass({
  mixins: [tweenState.Mixin, TimerMixin],
  getInitialState() {
      return {
        isMarkdown: false,
        content: '',
      }
  },

  componentDidMount(){
    this.setState({isMarkdown : this.props.data.note["IsMarkdown"]});
    Fetcher.getNoteContent(this.props.data.note["NoteId"])
      .then((content) => {
        if(!this.state.isMarkdown) {
          var html = content + "<script src=\"test.js\"></script><script>alert(a)</script>";
          this.setState({content: html});
        } else {
          this.setState({content: content});
        }
      });

    this.setTimeout(()=>{
      this.tweenState('top', {
        easing: tweenState.easingTypes.easeInElastic,
        duration: 1000,
        beginValue: -100,
        endValue: 0
      });
    }, 10);
  },

  _lastPosition: 0,
  _headerFolded: false,
  _onScroll(e) {
    // if (e.nativeEvent.contentOffset.y < -1) {
    //   this.props.data.update=true;
    //   this.refreshed = false;
    //   this.setState({refreshing: true});
    // }
      var currentPostion = e.nativeEvent.contentOffset.y;
      console.log(currentPostion - this._lastPosition);
      if (currentPostion - this._lastPosition > 0 && !this._headerFolded) {
            this._lastPosition = currentPostion;
            if(!this._headerFolded) {
              this._headerFolded = true;
              this.tweenState('top', {
                easing: tweenState.easingTypes.linear,
                duration: 400,
                beginValue: 0,
                endValue: -80
              });
            }
        } else if (this._lastPosition - currentPostion > 0 || (this._headerFolded && currentPostion - this._lastPosition > 0)) {
            this._lastPosition = currentPostion;
            if(this._headerFolded) {
              this._headerFolded = false;
              this.tweenState('top', {
                easing: tweenState.easingTypes.linear,
                duration: 400,
                beginValue: -80,
                endValue: 0
              });
            }
        }
    // console.log(offsetY);
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
                          makeSafe={false}
                          autoHeight={true}
                          onLink={{}}/>
                      )
    return (
        <View style={styles.container}>
          <View style={styles.contentView}>
            <ScrollView style={{position:'absolute', top: 0, height: Base.height-100, width: Base.width}} onScroll={this._onScroll}>
              {contentView}
            </ScrollView>
            <View style={[styles.header, {position: 'absolute',top: this.getTweeningValue('top')}]}>
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
            </View>
          </View>
        </View>
    )
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
  }

});
