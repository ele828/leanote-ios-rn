/**
 * 网络操作封装
 *
 */

'use strict'

var React = require('react-native');
var {
  AsyncStorage
} = React;

var Api = require("./Api");
var Tools = require("./Tools");
var Storage = require("./Storage");

// 获取用户token
function getToken() {
  return new Promise((resolve, reject) => {
    if(global.TOKEN !== undefined) {
      resolve(global.TOKEN);
      return;
    }
    AsyncStorage.getItem("User:token")
      .then((token) => {
        // 写入全局变量
        global.TOKEN = token;
        resolve(TOKEN);
      })
      .catch(() => {
          reject();
      });
  })
}

// 获取增量笔记本并同步到本地储存中
function getSyncNoteBooks() {
  return new Promise((resolve, reject)=>{
    console.log("notebooks fetcher");
    var notebooks = [];

    AsyncStorage.getItem("Notebook:usn")
      .then((usn)=>{
        //第一次访问
        if(usn === null) {
          usn = 0;
        }

        getToken()
          .then(()=>{
            // 获取所有笔记本
            var params = "?token=" + TOKEN + "&afterUsn=" + usn + "&maxEntry=" + 1000;
            var syncNotebooksAddr = encodeURI(Api.SyncNotebooks + params);

            fetch(syncNotebooksAddr, {method:"GET"})
              .then((response) => response.json())
              // 获取增量更新列表
              .then((res) => {
                var nums = res.length;
                // 没有需要更新的内容
                if(nums === 0) {
                    console.log("笔记本不需要更新");
                    resolve("[]");
                }

                var nbToBeDelete = [];
                for(var i = 0; i < nums; i++) {
                  if(!res[i]["IsDeleted"]) {
                    var date = Tools.dateModifier(res[i]["UpdatedTime"]);
                    var formatedDate = Tools.formatDate(date);
                    res[i]["UpdatedTime"] = formatedDate;
                    notebooks.push(res[i]);
                  } else {
                    nbToBeDelete.push(res[i]);
                  }
                }

                notebooks = notebooks.reverse();
                var newUsn = res[i-1]["Usn"].toString();
                // 获取原先所有的数据
                AsyncStorage.getItem("Notebook:all")
                  .then((oldNotebooks) => {
                    var newNotebooksArr = [];
                    if(oldNotebooks !== null) {
                      var oldNotebooksArr = JSON.parse(oldNotebooks);
                      // 替换旧的笔记数据
                      for(var i = 0; i < notebooks.length; i++) {
                        for(var j = 0; j < oldNotebooksArr.length; j++) {
                          if(notebooks[i]["NotebookId"] == oldNotebooksArr[j]["NotebookId"]) {
                            oldNotebooksArr.splice(j, 1);
                            break;
                          }
                        }
                      }
                      // 清除本地已被删除的笔记本
                      for(var i = 0; i < nbToBeDelete.length; i++) {
                        for(var j = 0; j < oldNotebooksArr.length; j++) {
                          if(nbToBeDelete[i]["NotebookId"] == oldNotebooksArr[j]["NotebookId"]) {
                            oldNotebooksArr.splice(j, 1);
                            break;
                          }
                        }
                      }
                      newNotebooksArr = notebooks.concat(oldNotebooksArr);
                    } else {
                      newNotebooksArr = notebooks;
                    }
                    return newNotebooksArr;
                  }).then((newNotebooksArr)=>{
                      var newNotebooks = JSON.stringify(newNotebooksArr);
                      // 储存到本地数据库中
                      AsyncStorage.setItem("Notebook:all", newNotebooks)
                        .then(()=>{
                          // 更新本地Usn
                          AsyncStorage.setItem("Notebook:usn", newUsn);
                          resolve(newNotebooks);
                        });
                  })
              }).catch(()=>{
                reject("network-error");
              })

          }); /* getToken */

    }) /* AsyncStorage */


  });
}


// 增量更新笔记并同步到本地储存中
function getSyncNotes() {
  return new Promise((resolve, reject) => {
    console.log("books fetcher");
    var notes = [];
    var notebooks = [];

    AsyncStorage.getItem("Note:usn")
      .then((usn)=>{
        //第一次访问
        if(usn === null) {
          usn = 0;
        }

        getToken()
          .then(()=>{
            // 获取所有笔记
            var params = "?token=" + TOKEN + "&afterUsn=" + usn + "&maxEntry=" + 1000;
            var syncNotesAddr = encodeURI(Api.SyncNotes + params);

            fetch(syncNotesAddr, {method:"GET"})
              .then((response) => response.json())
              // 获取增量更新列表
              .then((res) => {
                var nums = res.length;
                // 没有需要更新的内容
                if(nums === 0) {
                    console.log("笔记不需要更新");
                    resolve();
                }
                // 更新笔记本
                var noteToBedelete = [];
                getSyncNoteBooks()
                  .then(()=>{
                    Storage.getAllNoteBooks()
                      .then((notebooks)=>{
                          for(var i = 0; i < nums; i++) {
                            console.log(res[i]);
                              if(!res[i]["IsDeleted"] && !res[i]["IsTrash"]) {
                                var date = Tools.dateModifier(res[i]["UpdatedTime"]);
                                var formatedDate = Tools.formatDate(date);
                                res[i]["UpdatedTime"] = formatedDate;

                                // 增加笔记本字段
                                var nbs = JSON.parse(notebooks);
                                if(nbs.length != 0) {
                                  nbs.forEach(function(notebook) {
                                    if(res[i]["NotebookId"] === notebook["NotebookId"]) {
                                      res[i]["NotebookTitle"] = notebook["Title"];
                                    }
                                  });
                                } else {
                                  res[i]["NotebookTitle"] = "默认分类";
                                }
                                notes.push(res[i]);
                              } else {
                                noteToBedelete.push(res[i]);
                              }
                            }

                            notes = notes.reverse();
                            var newUsn = res[i-1]["Usn"].toString();
                            // 获取原先所有的数据
                            AsyncStorage.getItem("Note:all")
                              .then((oldNotes) => {
                                var newNotesArr = [];
                                if(oldNotes !== null) {
                                  var oldNotesArr = JSON.parse(oldNotes);
                                  // 替换旧的笔记数据
                                  for(var i = 0; i < notes.length; i++) {
                                    for(var j = 0; j < oldNotesArr.length; j++) {
                                      if(notes[i]["NoteId"] == oldNotesArr[j]["NoteId"]) {
                                        oldNotesArr.splice(j, 1);
                                        break;
                                      }
                                    }
                                  }
                                  // 清除本地已被删除的笔记
                                  for(var i = 0; i < noteToBedelete.length; i++) {
                                    for(var j = 0; j < oldNotesArr.length; j++) {
                                      if(noteToBedelete[i]["NoteId"] == oldNotesArr[j]["NoteId"]) {
                                        oldNotesArr.splice(j, 1);
                                        break;
                                      }
                                    }
                                  }
                                  newNotesArr = notes.concat(oldNotesArr);
                                } else {
                                  newNotesArr = notes;
                                }
                                return newNotesArr;
                              }).then((newNotesArr)=>{
                                var newNotes = JSON.stringify(newNotesArr);
                                // 储存到本地数据库中
                                AsyncStorage.setItem("Note:all", newNotes)
                                  .then(()=>{
                                    // 更新本地Usn
                                    AsyncStorage.setItem("Note:usn", newUsn);
                                    console.log("笔记更新成功！");
                                    resolve(newNotes);
                                  });
                              })

                      }) // get all notebooks
                  }) // get sync note books

              })
              .catch(()=>{
                reject("network-error");
              })

          }); /* getToken */

    });

  });
}

// 获取笔记正文内容
function getNoteContent(noteId) {
  return new Promise((resolve, reject) => {
    console.log("fetch note content");
    getToken()
      .then((token)=>{
        // 获取所有笔记
        var params = "?token=" + token + "&noteId=" + noteId;
        var getNoteContentAddr = encodeURI(Api.NoteContent + params);
        fetch(getNoteContentAddr, {method:"GET"})
          .then((response) => response.json())
          .then((res) => {
            var content = res["Content"];
            resolve(content);
          })

      });
  });
}

exports.getSyncNotes     = getSyncNotes;
exports.getSyncNoteBooks = getSyncNoteBooks;
exports.getNoteContent   = getNoteContent;
