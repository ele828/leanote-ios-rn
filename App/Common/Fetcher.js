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

var TOKEN = "";

function getToken() {
  return new Promise((resolve, reject) => {
    if(TOKEN !== "") resolve();
    AsyncStorage.getItem("User:token")
      .then((token) => {
        TOKEN = token;
        resolve();
      })
      .catch(() => {
          reject();
      });
  })
}

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
          var data = "?token=" + TOKEN + "&afterUsn=" + usn + "&maxEntry=" + 1000;
          var syncNotebooksAddr = encodeURI(Api.SyncNotebooks + data);

          console.log(syncNotebooksAddr);
          // fetch(syncNotebooksAddr, {method:"GET"})
          //   .then((response) => response.json())
          //   // 获取增量更新列表
          //   .then((res) => {
          //
          //     var nums = res.length;
          //
          //     // 没有需要更新的内容
          //     if(nums == 0) {
          //         console.log("笔记本不需要更新");
          //         resolve();
          //     }
          //
          //     for(var i = 0; i < nums; i++) {
          //       if(!res[i]["IsDeleted"]) {
          //         var date = Tools.dateModifier(res[i]["UpdatedTime"]);
          //         var formatedDate = Tools.formatDate(date, true);
          //         res[i]["UpdatedTime"] = formatedDate;
          //         notes.push(res[i]);
          //       }
          //     }
          //     notes = notes.reverse();
          //     // 获取原先所有的数据
          //     AsyncStorage.getItem("Note:all")
          //       .then((oldNotes) => {
          //         var oldNotesArr = JSON.parse(oldNotes);
          //         var newNotesArr = notes.concat(oldNotesArr);
          //         var newNotes = JSON.stringify(newNotesArr);
          //         // 储存到本地数据库中
          //         AsyncStorage.setItem("Note:all", newNotes)
          //           .then(()=>{
          //             // console.log(notes[0]["Usn"]);
          //             var newUsn = notes[0]["Usn"].toString();
          //             // 更新本地Usn
          //             AsyncStorage.setItem("Note:usn", newUsn);
          //             resolve(newNotes);
          //           });
          //       });
          //
          //   })
          //   .catch(()=>{
          //     reject("network-error");
          //   })

        }); /* getToken */

    }) /* AsyncStorage */


  });
}

// 增量更新笔记本并同步到本地储存中
function getSyncNotes() {
  return new Promise((resolve, reject) => {
    console.log("books fetcher");
    var notes = [];
    AsyncStorage.getItem("Note:usn")
      .then((usn)=>{
        //第一次访问
        if(usn === null) {
          usn = 0;
        }

        console.log(usn);

        getToken()
          .then(()=>{
            // 获取所有笔记
            var data = "?token=" + TOKEN + "&afterUsn=" + usn + "&maxEntry=" + 1000;
            var syncNotesAddr = encodeURI(Api.SyncNotes + data);

            fetch(syncNotesAddr, {method:"GET"})
              .then((response) => response.json())
              // 获取增量更新列表
              .then((res) => {

                var nums = res.length;

                // 没有需要更新的内容
                if(nums == 0) {
                    console.log("笔记不需要更新");
                    resolve();
                }

                for(var i = 0; i < nums; i++) {
                  if(!res[i]["IsDeleted"]) {
                    var date = Tools.dateModifier(res[i]["UpdatedTime"]);
                    var formatedDate = Tools.formatDate(date, true);
                    res[i]["UpdatedTime"] = formatedDate;
                    notes.push(res[i]);
                  }
                }
                notes = notes.reverse();
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
                          }
                        }
                      }
                      newNotesArr = notes.concat(oldNotesArr);
                    } else {
                      newNotesArr = notes;
                    }

                    var newNotes = JSON.stringify(newNotesArr);
                    // 储存到本地数据库中
                    AsyncStorage.setItem("Note:all", newNotes)
                      .then(()=>{
                        // console.log(notes[0]["Usn"]);
                        var newUsn = notes[0]["Usn"].toString();
                        // 更新本地Usn
                        AsyncStorage.setItem("Note:usn", newUsn);
                        resolve(newNotes);
                      });
                  });

              })
              .catch(()=>{
                reject("network-error");
              })

          }); /* getToken */

    });

  });
}

exports.getSyncNotes     = getSyncNotes;
exports.getSyncNoteBooks = getSyncNoteBooks;
