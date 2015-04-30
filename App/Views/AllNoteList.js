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
    this._fetchSyncNotes();
  },

  getInitialState: function() {
    return {
      notes: [],
      notesLoaded: false,
    }
  },

  _fetchSyncNotes: function() {

    AsyncStorage.getItem("User:token")
      .then((token)=>{
          var data = "?token=" + token + "&afterUsn=" + 0 + "&maxEntry=" + 100;
          var syncNotesAddr = encodeURI(Api.SyncNotes + data);
          fetch(syncNotesAddr, {method:"GET"})
            .then((response) => response.json())

            // 获取增量更新列表
            .then((res)=>{

              var nums = res.length;
              for(var i = 0; i < nums; i++) {
                if(!res[i]["IsDeleted"]) {
                  this.state.notes.push(res[i]);
                }
              }
              this.setState( {  notes : this.state.notes.reverse() });
              this.setState({notesLoaded: true});
              // console.log(this.state.notes);
            })
      })
      .catch((err)=>{

      });
  },

  render: function() {
    var Notes = this.state.notes.map((note) => {
      return <NoteCell note={note} goToTweet={this.goToTweet} />;
    })
    return (
      <ScrollView style={styles.container}>
        {Notes}
      </ScrollView>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#0379d5'
  }
});
