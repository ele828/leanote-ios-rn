'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
} = React;

var Icon = require("react-native-icons");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      val: 0
    }
  },
  render() {
    // console.log(this.getTweeningValue('rotation'));
    return (
      <TouchableOpacity activeOpacity="0.7" onPress={()=>{
        this.props.customAction({action: "hideAbout"});
      }}>
          <Icon
            name='fontawesome|close'
            size={17}
            color='#fff'
            style={{
              backgroundColor: 'transparent',
              width: 50,
              height: 50,
            }}
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

});
