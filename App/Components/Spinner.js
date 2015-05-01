'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  ActivityIndicatorIOS
} = React;

var Base = require("../Common/Base");

module.exports = React.createClass({
  render: function() {
    return(
      <View style={styles.container}>
        <ActivityIndicatorIOS
          style={{top: this.props.top}}
          size="large"
        />
      </View>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    top:0,
    left:0,
    position: 'absolute',
    width: Base.width,
    height: Base.height,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
    opacity: 0.25
  }
});
