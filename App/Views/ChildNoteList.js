/**
 * 特定笔记本内的笔记列表视图
 *
 */
'use strict'

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

var Base = require("../Common/Base");

// 本地储存
var Storage = require("../Common/Storage");

var ViewNote = require("./ViewNote");
var NoteCell = require('../Components/NoteCell');
var AddNoteButton = require("../Components/AddNoteButton");

var ChildNoteList = React.createClass({
  componentDidMount() {
    Storage
      .getNotesByNotebookId(this.props.data.NotebookId)
        .then((noteList) => {
          this.setState({notes: noteList});
        });

  },
  getInitialState() {
    return {
      notes: []
    }
  },

  goToNote(note){
    this.props.toRoute({
      name: "我的笔记",
      component: ViewNote,
      data: {note: note},
      rightCorner: AddNoteButton
    });
  },

  render() {
      var notes = this.state.notes.map((note) => {
          return <NoteCell note={note} goToNote={this.goToNote} />;
      });
        return (
          <View style={s.container}>
            <ScrollView>
              {notes}
            </ScrollView>
          </View>
        )
    }
});

var s = StyleSheet.create({
  container: {
    height: Base.height-64,
    backgroundColor: '#fff'
  }
});

module.exports= ChildNoteList;
