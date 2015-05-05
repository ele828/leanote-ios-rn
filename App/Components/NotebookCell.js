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

var NotebookCell = React.createClass({

  goToNoteList: function() {
    this.props.goToNoteList(this.props.notebook);
  },

  render: function() {
    var {
      notebook
    } = this.props;
    return (
      <TouchableHighlight underlayColor="#eee" onPress={this.goToNoteList}>
        <View style={styles.container}>
          <View style={styles.left}>
            <Text
              style={styles.noteText}
              numberOfLines={1}>{notebook["Title"]}
            </Text>
              <View style={styles.info}>
                <Icon
                  name='fontawesome|clock-o'
                  size={13}
                  color='#ccc'
                  style={styles.clockIcon}
                />
                <Text style={styles.updateTime}>2015-05-06</Text>
              </View>
          </View>
          <View style={styles.right}>
            <Icon
              name='fontawesome|chevron-right'
              size={15}
              color='#ccc'
              style={styles.clockIcon}
            />
          </View>
        </View>
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
  left: {},
  right: {
    flex: 1,
    marginTop: 16,
    left: -15,
  },
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#DAE6F0',
    paddingTop: 6,
    paddingBottom: 10,
  },
  noteText: {
    paddingTop: 6,
    paddingLeft: 17,
    paddingRight: 15,
    alignSelf: 'center',
    alignItems: 'center',
    width: Base.width-20,
    fontSize: 14,
  },
  updateTime: {
    marginTop: 3,
    color: '#838383',
    fontSize: 12,
  },
  info: {
    marginTop: 8,
    marginLeft: 12,
    flexDirection: 'row',
  },
  clockIcon: {
    width: 20,
    height:20,
  }
});


module.exports = NotebookCell;
