'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Navigator,
  View,
  Text,
} = React;

var Home       = require('./App/Views/Home');
var Login      = require('./App/Views/Login');
var Register   = require('./App/Views/Register');

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
  getInitialState: function() {
    return {
      logined: false
    };
  },
  renderScene: function(route, nav) {
      switch (route.id) {
        case 'home':
          return <Home navigator={nav}/>;
        case 'login':
          return <Login navigator={nav}/>;
        case 'register':
          return <Register navigator={nav}/>
        case 'jumping':
          return <Vv navigator={nav}/>
        default:
          return (
            <Login navigator={nav}/>
          );
      }

  },
  render: function() {
    return (
      <Navigator
      style={{backgroundColor: '#fff'}}
      initialRoute={{ id: "login" }}
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
