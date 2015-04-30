/**
 * App登录界面
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
  TouchableOpacity
} = React;


var Api = require("../Common/Api");
var Base = require("../Common/Base");
var Spinner = require("../Components/Spinner");

var LoginView = React.createClass({

  _doLogin: function() {
    this.setState({startLogin: true});

    // 构造登录数据
    var email = this.state.email;
    var pwd   = this.state.password;
    var data  = "?email=" + email + "&pwd=" + pwd;
    var LoginAddr = encodeURI(Api.Login + data);

    // 合法性检查
    if(email === "" || pwd === "") {
      this.setState({startLogin: false});
      Base.showMsg("登录失败", "请输入登录信息！");
      return;
    } else if(email.indexOf("@") < 0) {
      this.setState({startLogin: false});
      Base.showMsg("登录失败", "请输入正确的邮箱地址！");
      return;
    }

    fetch(LoginAddr, {method:"GET"})
      .then((response) => response.json())
      .then((res)=>{

        // 用户名或密码错误
        if(res["Ok"] === false) {
          console.error("用户名或密码错误!");
          this.setState({startLogin: false});
          Base.showMsg("登录失败", "用户名或密码错误!");
          return;
        }

        // 登录成功
        if(res["Ok"] === true){
          var token  = res["Token"],
              userId = res["UserId"],
              email  = res["Email"];

          // 储存用户信息以及Token
          AsyncStorage.setItem("User:token", token)
            .catch((err)=>{
              this.setState({startLogin: false});
              Base.showMsg("系统错误", "登录失败，请重试！");
            });

          AsyncStorage.setItem("User:id", userId)
            .catch((err)=>{
              this.setState({startLogin: false});
              Base.showMsg("系统错误", "登录失败，请重试！");
            });

          AsyncStorage.setItem("User:email", email)
            .catch((err)=>{
              this.setState({startLogin: false});
              Base.showMsg("系统错误", "登录失败，请重试！");
            });

          // 跳转到主界面
          this.setState({startLogin: false});
          this.props.navigator.replace({ id: 'home' });
          return;
        }

      })
      // 网络或其他异常处理
      .catch((err) => {
        console.log(err);
      })
      .done();
  },

  _doReg: function() {
    this.props.navigator.push({ id: 'register' });
  },

  componentDidMount: function() {
    // 判断用户是否已经登录
    // AsyncStorage.clear();
    AsyncStorage.getItem("User:token")
      .then((token)=>{
        if(token !== null) {
          this.setState({logined: true});
          this.props.navigator.replace({ id: 'home' });
        } else {
          this.setState({logined: false});
        }
      })
      .catch((err)=>{
        this.setState({logined: false});
      });
  },

  getInitialState: function() {
    return {
      email: '',
      password: '',
      startLogin: false,
      logined: true
    }
  },

  render: function() {
    var spinner = this.state.startLogin ?
      ( <Spinner/> ) :
      ( <View/>);

    var loginView = this.state.logined?
                    (<View></View>)
                    :(<View style={styles.container}>
                          <Image source={require('image!lealogo_blue')} style={styles.logo}/>
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
                                    <Text style={styles.LoginText}>登   录</Text>
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
                    )
    return loginView;
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
    backgroundColor: '#0379d5',
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
