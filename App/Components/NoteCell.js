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
var Icon = require("react-native-icons");
var Tools = require('../Common/Tools');

var Tweet = React.createClass({

  goToNote: function() {
    this.props.goToNote(this.props.note);
  },

  render() {
    var {
      note
    } = this.props;
    return (
      <TouchableHighlight underlayColor="#eee" onPress={this.goToNote}>
        <View style={styles.container}>
          <Text
            style={styles.noteText}
            numberOfLines={1}
            >{note["Title"]}</Text>
            <View style={styles.info}>
              <Icon
                name='fontawesome|book'
                size={13}
                color='#ccc'
                style={styles.bookIcon}
              />
              <Text style={styles.noteBook}>{note["NotebookTitle"]}</Text>
              <Icon
                name='fontawesome|clock-o'
                size={13}
                color='#ccc'
                style={styles.clockIcon}
              />
              <Text style={styles.updateTime}>{Tools.formatDate(note["UpdatedTime"])}</Text>
            </View>
        </View>
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#DAE6F0',
    paddingTop: 4,
    paddingBottom: 10,
  },
  noteText: {
    paddingTop: 5,
    paddingLeft: 20,
    paddingRight: 15,
    alignSelf: 'center',
    alignItems: 'center',
    width: Base.width,
    fontSize: 14,
  },
  updateTime: {
    marginTop: 3,
    color: '#838383',
    fontSize: 12,
  },
  noteBook: {
    marginTop: 4,
    color: '#838383',
    fontSize: 12,
  },
  info: {
    marginTop: 8,
    marginLeft: 15,
    flexDirection: 'row',
  },
  bookIcon: {
    width: 20,
    height:20,
  },
  clockIcon: {
    width: 20,
    height:20,
  }
});


module.exports = Tweet;
