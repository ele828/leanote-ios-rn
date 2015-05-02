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

var BackButton = require("../Components/BackButton");
var SideBarButton = require("../Components/SideBarButton");
var RefreshButton = require("../Components/RefreshButton");

var SideMenu = require('react-native-side-menu');
var Icon = require("react-native-icons");

var TimerMixin = require('react-timer-mixin');

var Menu = React.createClass({
  mixins: [TimerMixin],
  render: function() {
    return (
      <View>
        <View style={styles.menuHeader}>
          <Text style={{
            color:'#fff',
            top: 30,
            left: Base.width* 2 / 8 - 28,
            fontSize: 15
          }}></Text>
        </View>
        <View style={{
          borderRightWidth: 1,
          borderRightColor: '#eee',
          position: 'absolute',
          top : 64,
          width: Base.width* 2 / 4,
          height: Base.height + 100,
        }}>

          <ScrollView style={{paddingTop:10}}>
            <TouchableHighlight underlayColor="#eee" onPress={()=>{
              AlLNoteList.goToNoteList();
              this.setTimeout(()=>{
                this.props.menuActions.close();
              }, 0);
            }}>
                <View style={styles.menuItem}>
                  <Icon
                    name='fontawesome|pencil-square'
                    size={20}
                    color='#0379d5'
                    style={styles.ico}
                  />
                  <Text style={styles.itemText}>笔记</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="#eee" onPress={()=>{
              AlLNoteList.goToNote();
              this.setTimeout(()=>{
                this.props.menuActions.close();
              }, 0);
            }}>
                <View style={styles.menuItem}>
                  <Icon
                    name='fontawesome|book'
                    size={20}
                    color='#08c917'
                    style={styles.ico}
                  />
                  <Text style={[styles.itemText, {marginLeft: 26}]}>笔记本</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="#eee" onPress={()=>{

            }}>
                <View style={styles.menuItem}>
                  <Icon
                    name='fontawesome|user'
                    size={20}
                    color='#e5004f'
                    style={styles.ico}
                  />
                  <Text style={styles.itemText}>账户</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="#eee" onPress={()=>{

            }}>
                <View style={styles.menuItem}>
                  <Icon
                    name='fontawesome|star'
                    size={20}
                    color='#00a0e9'
                    style={styles.ico}
                  />
                  <Text style={styles.itemText}>关于</Text>
                </View>
            </TouchableHighlight>

            <TouchableHighlight underlayColor="#eee" onPress={()=>{
              AsyncStorage.clear()
                .then(()=>{
                  this.props.nav.replace({ id: 'login' });
                });
            }}>
                <View style={styles.menuItem}>
                  <Icon
                    name='fontawesome|sign-out'
                    size={20}
                    color='#eb6100'
                    style={styles.ico}
                  />
                  <Text style={styles.itemText}>注销</Text>
                </View>
            </TouchableHighlight>

          </ScrollView>

        </View>
      </View>
    );
  }
});

module.exports = React.createClass({
  firstRoute: {
    name: '所有笔记',
    data: {update: false, goNoteBooks: false},
    component: AlLNoteList,
    leftCorner: SideBarButton,
    rightCorner: RefreshButton
  },
  getInitialState: function() {
    return {
      update: false,
      menuOpened: false
    }
  },
  _handleAction: function(evt) {

    switch(evt.action) {
      case 'refresh':
        this._refreshNotes();
        break;
      case 'sidebar':
        this._siderbar();
        break;
      case 'notebooks':
        this._gotoNoteBooks();
        break;

    }
  },
  _gotoNoteBooks: function() {

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
      <SideMenu menu={<Menu />} nav={this.props.navigator} ref="sideMenu">
        <View style={styles.container}>
          <Router ref="router"
            firstRoute={this.firstRoute}
            headerStyle={styles.header}
            backButtonComponent={BackButton}
            customAction={this._handleAction}
          />
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
