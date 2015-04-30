'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Navigator,
  View,
  Text,
} = React;

var LoginView = require('./App/Views/LoginView.js');
var RegView   = require('./App/Views/RegView.js')

var leanote = React.createClass({
  render: function() {
    return (
      <View style={styles.container}>
          <LoginView/>
      </View>
    );
  }
});

var leanote = React.createClass({
  renderScene: function(route, nav) {
      switch (route.id) {
        case 'main':
          return <View><Text>main</Text></View>;
        case 'register':
          return <RegView navigator={nav}/>
        case 'jumping':
          return <Vv navigator={nav}/>
        default:
          return (
            <LoginView navigator={nav}/>
          );
      }

  },
  render: function() {
    return (
      <Navigator
        style={{backgroundColor: '#fff'}}
        initialRoute={{ id: "1" }}
        renderScene={this.renderScene}
        configureScene={(route) => {
            if (route.sceneConfig) {
                return route.sceneConfig;
            }
            return Navigator.SceneConfigs.FloatFromRight
          }
        }
      />
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('leanote', () => leanote);
