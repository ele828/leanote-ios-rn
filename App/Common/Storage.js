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
  return AsyncStorage.getItem('Note:all');
}

function getAllNoteBooks() {
  return AsyncStorage.getItem('Notebook:all');
}

function getNotesByNotebookId(notebookId) {
  // 获取所有的笔记本
  return AsyncStorage.getItem('Note:all')
    .then((notes) => {
      var ns = JSON.parse(notes);
      return ns.filter((note) => {
        if(note["NotebookId"] === notebookId) {
            return note;
        }
      });
    });
}

exports.getAllNotes = getAllNotes;
exports.getAllNoteBooks = getAllNoteBooks;
exports.getNotesByNotebookId = getNotesByNotebookId;
