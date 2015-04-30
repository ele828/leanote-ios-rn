'use strict';

var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  Image,
  View,
} = React;

var Base = require("../Common/Base");

var Tweet = React.createClass({

  goToTweet: function() {
    // this.props.goToTweet(this.props);
  },

  render() {
    var {
      note
    } = this.props;
    return (
      <TouchableHighlight underlayColor="transparent" onPress={this.goToTweet}>
        <View style={styles.tweetContainer}>
          <Text style={{alignItems: 'center', width: Base.width}}>{note["Title"]}</Text>
        </View>
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
  tweetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#DAE6F0',
    paddingTop: 4,
    paddingBottom: 10
  },
  avatar: {
    backgroundColor: 'gray',
    width: 50,
    height: 50,
    marginLeft: 10,
    borderRadius: 4
  },
  userContainer: {
    flexDirection: 'row'
  },
  username: {
    marginLeft: 4,
    fontSize: 13,
    color: '#8999a5',
    marginTop: 2
  },
  name: {
    fontWeight: '600',
    fontSize: 15
  },
  text: {
    marginTop: 5
  },
  rightContainer: {
    flex: 1,
    padding: 10
  }
});


module.exports = Tweet;
