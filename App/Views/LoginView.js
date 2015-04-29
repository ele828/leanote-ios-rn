'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity
} = React;

// some Basic properties
var Base = require("../Common/Base");
var Indicator = require("../Components/Indicator");

var LoginView = React.createClass({
  _doLogin: function() {
    this.setState({inputDone: true});
    console.log(this.state.email)
    console.log(this.state.password)
  },

  _doReg: function() {
    this.props.navigator.push({ id: 'register' });
  },

  getInitialState: function() {
    return {
      email: '',
      password: '',
      inputDone: false
    }
  },
  render: function() {
    var spinner = this.state.inputDone ?
      ( <Indicator/> ) :
      ( <View/>);

    return (
      <View style={styles.container}>
        <Image source={require('image!lealogo')} style={styles.logo}/>
        <View style={styles.form}>
            <TextInput
              style={styles.inputs}
              placeholder="请输入邮箱"
              keyboardType="email-address"
              clearButtonMode="while-editing"
              returnKeyType="next"
              onChangeText={(email) => this.setState({email: email})}
              onEndEditing={()=>{
                this.refs["pwInput"].focus();
              }}
            />
            <View style={styles.line}></View>
            <TextInput
              ref="pwInput"
              style={styles.inputs}
              password="true"
              placeholder="请输入密码"
              clearButtonMode="while-editing"
              returnKeyType="done"
              onChangeText={(pw) => this.setState({password: pw})}
              onEndEditing={this._doLogin}
            />
            <View style={styles.line}></View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity activeOpacity="0.8" onPress={this._doLogin}>
                <View style={styles.Login}>
                  <Text style={styles.LoginText}>登  录</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity="0.8" onPress={this._doReg}>
              <View style={styles.Reg}>
                  <Text style={styles.RegText}>创建leanote账户</Text>
              </View>
              </TouchableOpacity>
            </View>
        </View>
          {spinner}
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    marginTop: 80
  },
  form: {
    marginTop: 30
  },
  inputs: {
    marginTop: 30,
    height: 40,
    width: Base.width/1.3,
    padding: 10
  },
  line: {
    height:0.5,
    backgroundColor: '#ccc',
  },
  buttonGroup: {
    marginTop: 30,
  },
  Login: {
    alignItems: 'center',
    width: Base.width/1.3,
    height: 40,
    backgroundColor: '#019b0d',
  },
  LoginText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff'
  },
  Reg: {
    marginTop: 50,
    alignSelf: 'center',
  },
  RegText: {
    color: '#ababab'
  }
});

module.exports = LoginView;
