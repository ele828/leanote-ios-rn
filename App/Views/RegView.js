/**
 * App注册界面
 *
 */

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
var Api = require("../Common/Api");
var Base = require("../Common/Base");
var Spinner = require("../Components/Spinner");

module.exports = React.createClass({
  _doLogin: function() {
    this.props.navigator.pop();
  },

  _doReg: function() {
    console.log(this.state.email);
    console.log(this.state.password);

    this.setState({startReg: true});

    var email = this.state.email;
    var pwd   = this.state.password;
    var data  = "?email=" + email + "&pwd=" + pwd;
    var RegAddr = encodeURI(Api.Register + data);

    // 合法性检查
    if(email === "" || pwd === "") {
      this.setState({startReg: false});
      Base.showMsg("注册失败", "请输入登录信息！");
      return;
    } else if(email.indexOf("@") < 0) {
      this.setState({startReg: false});
      Base.showMsg("注册失败", "请输入正确的邮箱地址！");
      return;
    }

    // 发起注册请求
    fetch(RegAddr, {method:"POST"})
      .then((response) => response.json())

      // 处理注册逻辑
      .then((res)=>{
        // 注册失败
        if(res["Ok"] === false) {
          if(res["Msg"] == "errorEmail") {
            this.setState({startReg: false});
            Base.showMsg("注册失败", "请输入合法的邮箱地址！");
            return;
          }

          if(res["Msg"] == "errorPassword") {
            this.setState({startReg: false});
            Base.showMsg("注册失败", "密码格式不正确！");
            return;
          }

          if(res["Msg"].indexOf("userHasBeenRegistered") != -1) {
            this.setState({startReg: false});
            Base.showMsg("注册失败", "该邮箱已被注册！");
            return;
          }

        }

        // 注册成功
        if(res["Ok"] === true) {
          this.setState({startReg: false});
          Base.showMsg("注册成功", "恭喜您，账户创建成功！");
          this.props.navigator.pop();
          return;
        }

      })
      .catch((err)=>{
        this.setState({startReg: false});
        Base.showMsg("注册失败", "网络错误！");
        return;
      })
      .done();
  },

  getInitialState: function() {
    return {
      email: '',
      password: '',
      startReg: false
    }
  },
  render: function() {
    var spinner = this.state.startReg ?
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
              <TouchableOpacity activeOpacity="0.8" onPress={this._doReg}>
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
