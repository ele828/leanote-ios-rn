/**
 * App基本操作的封装
 *
 */

'use strict';

var React = require('react-native');
var {
  AlertIOS
} = React;

var width = require('Dimensions').get('window').width,
    height = require('Dimensions').get('window').height;

module.exports = {
  width: width,
  height: height,
  showMsg: function(title, msg) {
    AlertIOS.alert(title, msg)
  }
}
