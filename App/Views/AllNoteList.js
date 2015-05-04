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
  ScrollView
} = React;

var TimerMixin = require('react-timer-mixin');

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

var props = null;
var isAthome = true;

var AllNoteList = React.createClass({
  mixins: [TimerMixin],

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

    isAtHomepage: function() {
      return props.index === 0;
    }
  },

  componentDidMount: function() {
    // 从本地获取笔记
    this._loadNotesFromStorage();
    // 从网络更新笔记
    this._fetchSyncNotes();
    props = this.props;
  },

  getInitialState: function() {
    console.log('state');
    return {
      notes: [],
      notesLoaded: false,
      fetchingNotes: false
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
      })
  },

  // 打开笔记详情页
  goToNote: function(note) {
      this.props.data.atHome = false;
      this.props.toRoute({
        name: "我的笔记",
        component: ViewNote,
        data: {note: note},
        rightCorner: AddNoteButton
      });
  },

  goNoteBooks: function() {
    this.props.data.atHome = false;
    this.props.toRoute({
      name: "我的笔记本",
      component: ViewNote,
    });
  },

  msg: <View></View>,
  render: function() {
    // 增量更新监听
    if(this.props.data.update === true) {
      this.state.fetchingNotes = true;
      this._fetchSyncNotes();
      this.props.data.update = false;
      this.setTimeout(()=>{
        this.setState({fetchingNotes: false});
      },2200);
    }

    if(this.props.data.goNoteBooks === true) {
      this.props.data.goNoteBooks = false;
      this.goNoteBooks();
      console.log("tetstste")
    }

    if(this.state.fetchingNotes === true) {
      this.msg = <Msg msg="更新笔记中..."/>;
    } else {
      this.msg = <View></View>;
    }
    var Notes = this.state.notes.map((note) => {
      return <NoteCell note={note} goToNote={this.goToNote} />;
    })

    global.test = 123;

    return (
      <View style={styles.wrap}>
        <ScrollView style={styles.container} ref="notesList">
          {Notes}
        </ScrollView>
          <TouchableOpacity activeOpacity="0.7" onPress={()=>{
            Fetcher.getSyncNotes()
              .then(()=>{
                this._loadNotesFromStorage();
              })
          }}>
            <View style={styles.plus}>
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
