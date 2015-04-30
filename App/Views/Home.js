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
  TouchableOpacity
} = React;


var Api = require("../Common/Api");
var Base = require("../Common/Base");
var Spinner = require("../Components/Spinner");

module.exports = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>

      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  }
});
