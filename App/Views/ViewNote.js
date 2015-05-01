'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} = React;

var Icon = require("react-native-icons");

module.exports = React.createClass({
  render() {
    return (
      <View><Text>123</Text></View>
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
