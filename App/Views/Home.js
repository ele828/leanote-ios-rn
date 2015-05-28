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
  TouchableOpacity,
  TouchableHighlight,
  ScrollView
} = React;

var Api = require("../Common/Api");
var Base = require("../Common/Base");
var Spinner = require("../Components/Spinner");

var Router = require('react-native-router');
var AlLNoteList = require('./AllNoteList.js');
var About = require('./About');

var BackButton = require("../Components/BackButton");
var SideBarButton = require("../Components/SideBarButton");
var RefreshButton = require("../Components/RefreshButton");
var CloseButton = require("../Components/CloseButton");

var SideMenu = require('react-native-side-menu');
var Icon = require("react-native-icons");

// 动画组件
var tweenState = require("react-tween-state");

// 侧滑菜单组件
var Menu = require("../Components/SideMenu");

module.exports = React.createClass({
  mixins: [tweenState.Mixin],

  firstRoute: {
    name: '所有笔记',
    data: {update: false, goNoteBooks: false, atHome: true, go: false},
    component: AlLNoteList,
    leftCorner: SideBarButton,
    rightCorner: RefreshButton
  },

  componentDidMount: function() {
    if(this.getTweeningValue('top') > 0) {
      this.tweenState('top', {
        easing: tweenState.easingTypes.easeOutElastic,
        duration: 800,
        beginValue: Base.height,
        endValue: Base.height
      });
    }
  },
  
  getInitialState: function() {
    return {
      update: false,
      menuOpened: false,
      aboutOpened: false
    };
  },

  // 处理从导航视图触发的动作
  _handleAction: function(evt) {
    switch(evt.action) {
      case 'refresh':
        this._refreshNotes();
        break;
      case 'sidebar':
        this._siderbar();
        break;
      case 'showAbout':
        this._showAbout();
        break;
      case 'hideAbout':
        this._hideAbout();
        break;
    }
  },

  // 弹出关于窗口
  _showAbout: function() {
    if( !this.state.aboutOpened ) {
      this.tweenState('top', {
        easing: tweenState.easingTypes.easeOutElastic,
        duration: 800,
        beginValue: Base.height,
        endValue: 0
      });
      this.setState({aboutOpened: true});
    }
  },

  // 关闭关于窗口
  _hideAbout: function() {
    if(this.state.aboutOpened) {
      this.tweenState('top', {
        easing: tweenState.easingTypes.easeInOutElastic,
        duration: 800,
        beginValue: 0,
        endValue: Base.height
      });
      this.setState({aboutOpened: false});
    }
  },

  _siderbar: function() {
    this.refs["sideMenu"].openMenu();
  },

  _refreshNotes: function() {
    console.log('refresh');
    this.setState({update: true});
    this.firstRoute.data.update = true;
  },

  render: function() {
    return (
      <SideMenu menu={<Menu />} nav={this.props.navigator} customAction={this._handleAction} ref="sideMenu">
      <View style={styles.container}>
        <View style={styles.container}>
          <Router ref="router"
            firstRoute={this.firstRoute}
            headerStyle={styles.header}
            backButtonComponent={BackButton}
            customAction={this._handleAction}
          />
        </View>
          <View
            style={{
              position: 'absolute',
              top: this.getTweeningValue('top'),
              left:0,
              width: Base.width,
              height: Base.height,
            }}
          >
            <About closeAbout={this._hideAbout} sideBar={this._siderbar}/>
          </View>
        </View>
      </SideMenu>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#0379d5'
  },
  menuItem: {
    marginLeft: -10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    height: 45,
    width: Base.width* 2 / 4,
  },
  menuHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Base.width * 2,
    height: 64,
    backgroundColor: '#0379d5',
  },
  menu: {
   flex: 1,
   position: 'absolute',
   top: -20,
   left: -20,
   width: Base.width * 2,
   height: Base.height + 100,
   backgroundColor: '#fff',
   padding: 20
 },
 ico: {
   position: 'absolute',
   left: 30,
   width: 40,
   height: 40,
 },
 itemText: {
   marginTop: 12,
   justifyContent: 'center',
   marginLeft: 15,
 }
});
