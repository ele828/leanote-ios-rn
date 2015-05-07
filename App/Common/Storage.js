/**
 * 本地储存操作封装
 *
 */
'use strict'

var React = require('react-native');
var {
  AsyncStorage
} = React;

function getAllNotes() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('Note:all')
      .then((notes)=>{
        resolve(notes);
      })
      .catch(()=>{
        reject("getallnotes-error");
      });
  });
}

function getAllNoteBooks() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('Notebook:all')
      .then((notebooks)=>{
        resolve(notebooks);
      })
      .catch(()=>{
        reject("getallnotebooks-error");
      });
  });
}

function getNotesByNotebookId(notebookId) {
  return new Promise((resolve, reject) => {
    // 获取所有的笔记本
    AsyncStorage.getItem('Note:all')
        .then((notes) => {
          var ns = JSON.parse(notes);
          var noteList = ns.filter((note) => {
            if(note["NotebookId"] === notebookId) {
               return note;
            }
          });
          resolve(noteList);
        });
  });
}

exports.getAllNoteBooks      = getAllNoteBooks;
exports.getAllNotes          = getAllNotes;
exports.getNotesByNotebookId = getNotesByNotebookId;
