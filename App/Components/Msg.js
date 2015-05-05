'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} = React;

var TimerMixin = require('react-timer-mixin');
var tweenState = require("react-tween-state");

var Base = require("../Common/Base");
var Icon = require("react-native-icons");

module.exports = React.createClass({
  mixins: [tweenState.Mixin, TimerMixin],
  getInitialState: function() {
    return {
      removed: true
    }
  },
  componentDidMount: function() {
    if(this.state.removed) {
      this.tweenState('top', {
        easing: tweenState.easingTypes.linear,
        duration: 300,
        beginValue: -25,
        endValue: 0
      });
      this.setTimeout(()=>{
        this.tweenState('top', {
          easing: tweenState.easingTypes.linear,
          duration: 600,
          beginValue: 0,
          endValue: -25
        });
        this.setState({removed: true});
      },800);
      this.setState({removed: false});
    }
  },
  render() {
    return (
      <View style={{
                  position: 'absolute',
                  top: this.getTweeningValue('top'),
                  width: Base.width,
                  height: 25, backgroundColor: '#08c917',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0.9,
      }}>
      <Text style={{color: '#fff', fontSize:12}}>{this.props.msg}</Text>
      </View>
    );
  }
});
