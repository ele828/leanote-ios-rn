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

var Api = require("../Common/Api");
var Base = require("../Common/Base");
var Tools = require("../Common/Tools");
var Fetcher = require("../Common/Fetcher");
var Storage = require("../Common/Storage");

var Icon = require("react-native-icons");
var Spinner = require("../Components/Spinner");

var Router = require('react-native-router');
var NoteCell = require('../Components/NoteCell');

module.exports = React.createClass({

  nextPage: function() {
    this.props.toRoute({
      name: "A new screen",
      component: HelloPage
    });
  },

  componentDidMount: function() {
    //Fetcher.getSyncNoteBooks();
    // 从本地获取笔记
    this._loadNotesFromStorage();
    // 从网络更新笔记
    this._fetchSyncNotes();
  },

  getInitialState: function() {
    return {
      notes: [],
      notesLoaded: false,
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

  render: function() {
    var Notes = this.state.notes.map((note) => {
      return <NoteCell note={note} goToTweet={this.goToTweet} />;
    })
    return (
      <View style={styles.wrap}>
        <ScrollView style={styles.container}>
          {Notes}
        </ScrollView>
        <TouchableOpacity activeOpacity="0.7" onPress={()=>{
          Fetcher.getSyncNotes()
            .then(()=>{
              this._loadNotesFromStorage();
            })
        }
        }>
          <View style={styles.plus}>
            <Icon
              name='fontawesome|plus'
              size={18}
              color='#fff'
              style={styles.plusIcon}
            />
          </View>
        </TouchableOpacity>

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
