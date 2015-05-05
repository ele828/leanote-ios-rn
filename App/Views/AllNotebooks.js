/**
 * 笔记本视图
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
var NotebookCell = require("../Components/NotebookCell");
var ChildNoteList = require("./ChildNoteList");

// 本地储存
var Storage = require("../Common/Storage");

var TimerMixin = require('react-timer-mixin');

var NotebooksView = React.createClass({
  mixins: [TimerMixin],
  getInitialState() {
    return {
      notebooks: []
    }
  },

  componentDidMount() {
    // 从本地加载笔记本数据
    // 启动应用时已经进行了网络同步
    Storage
      .getAllNoteBooks()
        .then((nbs) => {
          setTimeout(()=>{
            this.setState({notebooks: JSON.parse(nbs)});
          }, 0);
        });
  },

  goToNoteList(notebook) {
    this.props.toRoute({
      name: notebook["Title"],
      component: ChildNoteList,
      data: notebook
    });
  },

  render() {
    var notebooksList = <View></View>;
    if(this.state.notebooks.length !== 0) {
      notebooksList = this.state.notebooks.map((nb)=>{
        return (<NotebookCell notebook={nb} goToNoteList={this.goToNoteList}/>);
      });
    }

    return (
      <View style={styles.container}>
        <ScrollView>
          {notebooksList}
        </ScrollView>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    height: Base.height-64,
    backgroundColor: '#fff',
  }
});

module.exports = NotebooksView;
