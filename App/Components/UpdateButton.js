'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
} = React;

var Icon = require("react-native-icons");
var AlLNoteList = require('../Views/AllNoteList.js');

module.exports = React.createClass({
  render() {
    return (
      <TouchableOpacity activeOpacity="0.7" onPress={()=>{
        this.props.toRoute({
          name: "Tweet",
          component: AlLNoteList
        });
      }}>
          <Icon
            name='fontawesome|refresh'
            size={15}
            color='#fff'
            style={styles.refreshIcon}
          />
      </TouchableOpacity>
    )
  }
});

var styles = StyleSheet.create({
  updateButton: {
    width: 10,
    height: 17,
    marginLeft: 10,
    marginTop: 3,
    marginRight: 10
  },
  refreshIcon: {
    width: 50,
    height: 50,
  }
});
