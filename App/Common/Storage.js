/**
 * 本地储存操作封装
 *
 */
'use strict'

var React = require('react-native');
var {
  AsyncStorage
} = React;

exports.getAllNotes = function() {
  return new Promise((resolve, reject)=>{
    AsyncStorage.getItem('Note:all')
      .then((notes)=>{
        resolve(notes);
      })
      .catch(()=>{
        reject("getallnotes-error");
      });
  });
}

exports.getAllNoteBooks = function() {
  return new Promise((resolve, reject)=>{
    AsyncStorage.getItem('Notebook:all')
      .then((notebooks)=>{
        resolve(notebooks);
      })
      .catch(()=>{
        reject("getallnotebooks-error");
      });
  });
}
