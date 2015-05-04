'use strict';

var React = require('react-native');

var {
  StyleSheet,
  TouchableOpacity,
  View,
} = React;

var Icon = require("react-native-icons");
var tweenState = require("react-tween-state");
var TimerMixin = require('react-timer-mixin');

module.exports = React.createClass({
  mixins: [tweenState.Mixin, TimerMixin],
  getInitialState: function() {
    return {
      val: 0
    }
  },
  render() {
    // console.log(this.getTweeningValue('rotation'));
    return (
      <TouchableOpacity activeOpacity="0.7" onPress={()=>{
        this.tweenState('rotation', {
          easing: tweenState.easingTypes.easeOutElastic,
          duration: 100,
          beginValue: 0,
          endValue: 0.3
        });

        this.setTimeout(()=>{
          this.tweenState('rotation', {
            easing: tweenState.easingTypes.easeOutElastic,
            duration: 100,
            beginValue: 0,
            endValue: 0
          });
        },101);

        this.props.closeAbout();
      }}>
          <Icon
            name='fontawesome|close'
            size={17}
            color='#fff'
            style={{
              backgroundColor: 'transparent',
              width: 50,
              height: 50,
              rotation: this.getTweeningValue('rotation'),
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
