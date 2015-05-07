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

var NoteCell = require('../Components/NoteCell');

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

  goToNote(){
    
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
