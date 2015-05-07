/**
 * App登录界面
 *
 */

'use strict';

var React = require('react-native');
var {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicatorIOS
} = React;

var TimerMixin = require('react-timer-mixin');
var tweenState = require("react-tween-state");

var Api = require("../Common/Api");
var Base = require("../Common/Base");
var Tools = require("../Common/Tools");
var Fetcher = require("../Common/Fetcher");
var Storage = require("../Common/Storage");

var Icon = require("react-native-icons");
var Spinner = require("../Components/Spinner");
var Msg = require("../Components/Msg");

var Router = require('react-native-router');
var NoteCell = require('../Components/NoteCell');

var ViewNote = require("./ViewNote");
var AddNoteButton = require("../Components/AddNoteButton");
var AllNotebooks = require("./AllNotebooks");

var SideBarButton = require("../Components/SideBarButton");
var RefreshButton = require("../Components/RefreshButton");

var props = null;
var AllNoteList = React.createClass({
  mixins: [tweenState.Mixin, TimerMixin],
  statics: {
    goToNote: function() {
      props.toRoute({
        name: "我的笔记",
        component: ViewNote,
      });
    },

    goToNoteList: function() {
      props.toTop();
    },

    goNoteBooks: function() {
      props.toRoute({
        name: "笔记本",
        component: AllNotebooks,
        leftCorner: SideBarButton,
        rightCorner: RefreshButton
      });
    }
  },

  componentDidMount: function() {
    // 从本地获取笔记
    this._loadNotesFromStorage();
    // 从网络更新笔记
    this._fetchSyncNotes();
    props = this.props;

    this.refreshed = true;

    // 弹出添加笔记小圆点
    this.setTimeout(() => {
      this.tweenState('top', {
        easing: tweenState.easingTypes.easeOutElastic,
        duration: 800,
        beginValue: Base.height - 50,
        endValue: Base.height - 140
      });
    }, 1000);
  },

  getInitialState: function() {
    return {
      notes: [],
      notesLoaded: false,
      fetchingNotes: false,
      refreshing: false
    }
  },

  _loadNotesFromStorage: function() {
    Storage.getAllNotes()
      .then((notes)=>{
        return JSON.parse(notes);
      })
      .then((notes)=>{
        // console.log(notes);
        this.setState( {  notes : notes });
        this.setState({notesLoaded: true});
      });
  },

  _fetchSyncNotes: function() {
    Fetcher.getSyncNotes()
      .then(()=>{
        this._loadNotesFromStorage();
        // 取消Indicator提示
        this.refreshed = true;
      })
  },

  // 打开笔记详情页
  goToNote: function(note) {
      //this.props.data.atHome = false;
      this.props.toRoute({
        name: "我的笔记",
        component: ViewNote,
        data: {note: note},
        rightCorner: AddNoteButton
      });
  },

  goNoteBooks: function() {
    //this.props.data.atHome = false;
    this.props.toRoute({
      name: "我的笔记本",
      component: ViewNote,
    });
  },

  gotoNewNote: function() {
    this.tweenState('top', {
      easing: tweenState.easingTypes.easeInElastic,
      duration: 500,
      beginValue: Base.height - 140,
      endValue: Base.height - 50
    });
  },

  msg: <View></View>,
  render: function() {
    var refreshIndicator = <View></View>;
    // 增量更新监听
    if(this.props.data.update === true) {
      this.refreshed = false;
      this.state.fetchingNotes = true;
      this._fetchSyncNotes();
      this.props.data.update = false;
      this.setTimeout(()=>{
        this.setState({fetchingNotes: false});
      },1400);
    }

    if(!this.refreshed) {
      this.refreshed = false;
      refreshIndicator = (
        <ActivityIndicatorIOS
          style={{marginTop: 30, marginBottom:10}}
          size="small"
        />);
    }

    if(this.state.fetchingNotes === true) {
      this.msg = <Msg msg="更新笔记中..."/>;
    } else {
      this.msg = <View></View>;
    }
    var Notes = <View></View>;

    if(this.state.notes.length !== 0) {
      Notes = this.state.notes.map((note) => {
        return <NoteCell note={note} goToNote={this.goToNote} />;
      });
    }

    return (
      <View style={styles.wrap}>
        <ScrollView style={styles.container} ref="notesList"
           scrollsToTop={true}
           onScroll={(e)=>{
              if (e.nativeEvent.contentOffset.y < -1) {
                this.props.data.update=true;
                this.refreshed = false;
                this.setState({refreshing: true});
              }
           }}
        >
          {refreshIndicator}
          {Notes}
        </ScrollView>
          <TouchableOpacity activeOpacity="0.7" onPress={this.gotoNewNote}>
            <View style={[styles.plus,{top: this.getTweeningValue('top')}]}>
              <Icon
                name='fontawesome|plus'
                size={18}
                color='#fff'
                style={styles.plusIcon}
              />
            </View>
          </TouchableOpacity>
        {this.msg}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  wrap: {
    width: Base.width,
    height: Base.height-60,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  plus: {
    position: 'absolute',
    top: Base.height - 130,
    right: 30,
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: '#08c917',
  },
  plusIcon: {
    width: 35,
    height: 35,
    borderRadius: 17,
  },

  header: {
    backgroundColor: '#0379d5'
  }
});

module.exports = AllNoteList;
