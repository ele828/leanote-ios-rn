'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
} = React;

var Icon = require("react-native-icons");

module.exports = React.createClass({
  render() {
    return (
      <TouchableOpacity activeOpacity="0.7" onPress={()=>{
        if(this.props.sideBar) {
          this.props.sideBar();
        } else {
          this.props.customAction({action: 'sidebar'});
        }
      }}>
          <Icon
            name='fontawesome|bars'
            size={17}
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
