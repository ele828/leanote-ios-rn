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

// 本地储存
var Storage = require("../Common/Storage");

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
  render() {
    var notes = this.state.notes.map((note) => {
        return <Text>{note["Title"]}</Text>
    });
        return (
          <View>
            {notes}
          </View>
        )
    }
});

module.exports= ChildNoteList;
