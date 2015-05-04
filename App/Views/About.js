/**
 * 关于页面
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
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} = React;

var SideBarButton = require("../Components/SideBarButton");
var CloseButton = require("../Components/CloseButton");

class About extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.sidebar}>
          <SideBarButton sideBar={this.props.sideBar}/>
          </View>
          <View style={styles.close}>
          <CloseButton closeAbout={this.props.closeAbout}/>
          </View>
        </View>
        <View style={styles.body}>
          <Image source={require('image!lealogo')} style={styles.logo}/>
          <Text>Leanote是一款云笔记应用</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {

  },
  logo: {
    marginBottom: 10,
  },
  body: {
    alignItems: 'center',
    marginTop: 50,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 0,
  },
  header: {
    paddingTop: 10,
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#0379d5',
  }
});

module.exports = About;
