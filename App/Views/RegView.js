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
var Spinner = require("../Components/Spinner");

module.exports = React.createClass({
  _doLogin: function() {
    this.props.navigator.pop();
  },

  _doReg: function() {
    //this.props.navigator.push({ id: 'register' });
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
      ( <Spinner/> ) :
      ( <View/>);

    return (
      <View style={styles.container}>
      <Image source={require('image!lealogo_blue')} style={styles.logo}/>
        <View style={styles.form}>
            <TextInput
              style={styles.inputs}
              placeholder="输入邮箱地址"
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
              placeholder="输入登录密码"
              clearButtonMode="while-editing"
              returnKeyType="done"
              onChangeText={(pw) => this.setState({password: pw})}
              onEndEditing={this._doReg}
            />
            <View style={styles.line}></View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity activeOpacity="0.8" onPress={this._doLogin}>
                <View style={styles.Reg}>
                  <Text style={styles.RegText}>创  建  账  户</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity="0.8" onPress={this._doLogin}>
              <View style={styles.Login}>
                  <Text style={styles.LoginText}>返回登录</Text>
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
    marginTop: 50,
    alignSelf: 'center',
  },
  LoginText: {
    color: '#ababab'
  },
  Reg: {
    alignItems: 'center',
    width: Base.width/1.3,
    height: 40,
    backgroundColor: '#0379d5',
  },
  RegText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff'
  }
});
