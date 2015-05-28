/**
 * sqlite common DAO
 * 改自 desktop-app
 * https://github.com/leanote/desktop-app/blob/sqlite/src/node_modules/db/db_sqlite.js
 */
'use strict';

var SQLite = require('react-native-sqlite');

/*
var SQLite = require('react-native-sqlite');
var database = SQLite.open("chinook3.sqlite");
database.executeSQL("insert into Playlist(PlaylistId, Name) values(?, ?)", ['201', 'haha'], function(ok) {
  // 永远不会执行的
  console.log('插入成功!?');
  console.log(arguments);
}, function(error) {
  if(error) {
    console.log('插入失败');
    console.log(arguments);
  } else {
    console.log('插入成功!');
    console.log(arguments);
  }
});

database.executeSQL("update  Playlist set Name = ? where PlaylistId = ?", ['haha>>III', '2011'], 
  function(ok) {
  // 永远不会执行的
  console.log('更新成功!?');
  console.log(arguments);
}, function(error) {
  if(error) {
    console.log('更新失败');
    console.log(arguments);
  } else {
    console.log('更新成功!');
    console.log(arguments);
  }
});

database.executeSQL(
  "select * from Playlist"
[],
(row) => {
  // console.log('数据');
  console.log(row);
},
(error) => {
  if (error) {
    console.error('错误!');
    console.error(error);
  } else {
    console.log('done!!!');
  }
});
*/

var db = SQLite.open("leanote.sqlite");

function goNowToDate(goNow) {
  if(!goNow) {
    return new Date();
  }
  // new Date();
  if(typeof goNow == 'object') {
    return date;
  }
  var str = goNow.substr(0, 10) + " " + goNow.substr(11, 8);
  str = str.replace(/-/g, '/'); // 2015/05/03 12:12:33
  try {
    return new Date(str);
  } catch(e) {
    return new Date();
  }
}

// 数据操作基类
function BaseDb(dbname) {
  this.dbname = dbname;
}

// 插入
// db.notes.insert({NoteId: "life"}, function(err, data){})
BaseDb.prototype.insert = function(data, callback) {
  var me = this;
  var fields = [];
  var values = [];
  var valuesToken = [];

  // console.log('insert data...........');
  // console.log(JSON.stringify(data));

  for(var field in data) {
    var value = data[field];

    value = me.fixValue(field, value);

    fields.push(field);
    values.push(value);
    valuesToken.push('?');
  }
  var sql = 'INSERT INTO ' + me.dbname + ' (' + fields.join(',') +') VALUES (' + valuesToken.join(',') + ')';
  db.executeSQL(sql, values, function() {
  }, function afterCb(err) {
    callback(err, data);
  });
};

// key in ("life", "xx");
BaseDb.prototype._in = function(key, arr) {
  var me = this;
  if(!arr) {
    return '1=1';
  }
  for(var i = 0; i < arr; i++) {
    arr[i] = '"' + arr[i] + '"';
  }
  return key + ' in ' + '(' + arr.join(',') + ')';
};

// todo
// query = {$in: [], Tags: {$in: [title]}};
BaseDb.prototype._where = function(query) {
  var me = this;
  // 返回字符串
  var where = [];
  for(var field in query) {
    var value = query[field];
    if(typeof value == 'boolean') {
      value = value ? 1 : 0;
      where.push(field + '="' + value + '" ');
    }
    else if(typeof value == 'string') {
      where.push(field + '="' + value + '" ');
    }
    // 如果是日期 
    else if(value instanceof Date) {
      value = Date.getTime();
    } 
    // 对象类型
    else {
      if(field == 'Tags' && value['$in'] && value['$in'].length > 0) {
        where.push(field + ' "LIKE %' + value['$in'][0] + '%" ');
      }
      // $gt ? 搜索
      // 1) [{Title: reg}, {Content: reg}
      // 2) [{FileId: {$in: fileIds}}, {ServerFileId: {$in: fileIds}}]
      // 3) [{LocalIsDelete : { $exists : false }}, {LocalIsDelete: false}]
      else if(field == '$or') {
        // console.log(value[0]);
        var or1 = value[0];
        var or2 = value[1];

        if(or1['Title']) {
          var key = or1.Title.toString().replace(/\//g, '');
          where.push(' (Title LIKE "%' + key + '%" OR Content LIKE "%' + key + '%"' + ') ');
        }
        else if(or1['FileId']) {
          var fileIds = or1['FileId']['$in'];
          var serverFileIds = or2['ServerFileId']['$in'];

          var orWhere = ' (' +  me._in('FileId', fileIds) + ' OR ' + me._in('ServerFileId', serverFileIds) + ') ';
          where.push(orWhere);
        }
        else if(or1['LocalIsDelete']) {
          where.push(' LocalIsDelete="0" ');
        }
      }
    }
  }
  return where.join(' AND ');
};

// 修复值为bool, Tags, Date, json
BaseDb.prototype.fixValue = function(key, value) {
  // bool
  if(typeof value == 'boolean') {
    value = value ? 1 : 0;
  }
  else if(typeof value == 'object') {
    // Tgas
    if(key == 'Tags' && value) {
      value = value.join(',');
    }
    // 日期, 转成数字
    else if(value instanceof Date) {
      value = value.getTime();
    }
    // json
    else {
      value = JSON.stringify(value);
    }
  }

  if(key == 'UpdatedTime'
    || key == 'CreatedTime'
    || key == 'PublicTime'
    || key == 'LastSyncTime') {

    if(typeof value != 'number') {
      value = goNowToDate(value);
      try {
        value = value.getTime(); 
      } catch(e) {
        value = 0;
      }
    }
  }

  return value;
},

// update set
BaseDb.prototype._set = function(data) {
  var me = this;
  // data = data['$set'];
  // 返回字符串
  var sets = [];
  var values = [];
  for(var i in data) {
    var value = data[i];

    value = me.fixValue(i, value);

    values.push(value);

    sets.push(i + '=?');
  }
  return {sets: sets.join(','), values: values};
};

// 更新
// db.notes.update({NoteId: "life"}, {"Title": "xx"}, function(err, effectedNum) {})
BaseDb.prototype.update = function(query, set, option, callback) {
  var me = this;

  var where = me._where(query);
  var setsAndValues = me._set(set);

  var sql = 'UPDATE ' + me.dbname + ' ';
  if(set) {
    sql += ' SET ' + setsAndValues.sets;
  }
  if(where) {
    sql += ' WHERE ' + where;
  }

  if(typeof option == 'function') {
    callback = option;
  }

  db.executeSQL(sql, setsAndValues.values, function() {
  }, function afterCb(err) {
    callback && callback(err, err ? 0 : 1);
  });
};

/*
Notes.remove({_id: note._id}, function(err, n) {
  if(err) { 
    callback && callback(false);
  } else {
    Notebook.reCountNotebookNumberNotes(note.NotebookId);
    callback && callback(true);
  }
});
*/
BaseDb.prototype.remove = function(query, callback) {
  var me = this;
  var sql = 'delete from ' + me.dbname;
  var where = this._where(query);
  if(where){ 
    sql += ' where ' + where;
  }
  db.executeSQL(sql, [], function() {
  }, function afterCb(err) {
    callback && callback(err, err ? 0 : 1);
  });
};

/*
Notes.find(query).sort({'UpdatedTime': -1}).exec(function(err, notes) {
    if(err) {
      log(err);
      return callback && callback(false);
    }
    return callback && callback(notes);
  });
 */

BaseDb.prototype.fixTime = function(row) {
  if(!row) {
    return row;
  }
  row.CreatedTime && (row.CreatedTime = new Date(Math.floor(row.CreatedTime)));
  row.UpdatedTime && (row.UpdatedTime = new Date(Math.floor(row.UpdatedTime)));
  row.PublicTime && (row.PublicTime = new Date(Math.floor(row.PublicTime)));
  return row;
};

BaseDb.prototype.fixRow = function(row) {
  return row;
};

BaseDb.prototype.fixRows = function(rows) {
  if(!rows) {
    return rows;
  }
  for(var i = 0; i < rows.length; ++i) {
    if(rows[i]) {
      this.fixTime(rows[i]);
      rows[i] = this.fixRow(rows[i]);
    }
  }
  return rows;
};
BaseDb.prototype._find = (function() {
  var me;

  // var me = this;
  function F(upper, query, afterCallback, rowCallback) {
    me = upper;
    this.dbname = upper.dbname;
    this.query = query;
    this.rowCallback = rowCallback;
    this.afterCallback = afterCallback;
    if(afterCallback) {
      this.exec(afterCallback, rowCallback);
    }
  }
  // limit 15 offset 20 跳过20条记录选出15条记录
  F.prototype.limit = function(limit, offset) {
    this.limitQ = limit;
    this.offset = offset;
    return this;
  }
  F.prototype.sort = function(sort) {
    this.sortQ = sort;
    return this;
  }
  F.prototype.exec = function(afterCallback, rowCallback) {
    var where = me._where(this.query);

    // select * from dbname where xxxx order by title desc, createdTime asc

    var sql = 'select * from ' + this.dbname;
    if (where) { 
      sql += ' where ' + where;
    }

    if(this.sortQ) {
      var sortArr = [];
      for(var i in this.sortQ) {
        var sortType = this.sortQ[i] < 0 ? 'DESC' : 'ASC';
        sortArr.push(i + ' ' + sortType + ' ');
      }

      var sortStr = sortArr.join(', ');
      if(sortStr) {
        sql += ' order by ' + sortStr;
      }
    }

    if(this.limitQ) {
      sql += ' limit ' + this.limitQ;
    }
    if(this.offset) {
      sql +=' offset ' + this.offset;
    }

    console.log(sql);
    var rows = [];
    db.executeSQL(sql, [], function rowCb(row) {
      rowCallback && rowCallback(row);
      rows.push(row);
      // console.log('???');
    }, function afterCb(err) {
      // console.log('aftercb...' + afterCallback);
      if(!err) {
        rows = me.fixRows(rows);
      }
      afterCallback && afterCallback(err, rows);
    });
  }
  return F;
})();

// 查找
BaseDb.prototype.find = function(query, afterCallback, rowCallback) {
  var me = this;
  return new this._find(this, query, afterCallback, rowCallback);
};

// 一条数据
BaseDb.prototype.findOne = function(query, callback) {
  var me = this;
  var q = new this._find(this, query);
  q.limit(1).exec(
  function(err, rows) {
    if(!err && rows) {
      // var rows = me.fixRows(rows);
      console.log(rows + '>>>>>>>>>>>>>>>>>');
      callback && callback(err, rows[0]);
    }
    else {
      callback && callback(err, null);
    }
  }, function() {});
};

// ok
BaseDb.prototype.count = function(query, callback) {
  var me = this;
  var sql = 'select count(*) as count from ' + me.dbname;
  var where = this._where(query);
  if(where) {
    sql += ' where ' + where;
  }

  var rows = [];
  db.executeSQL(sql, [], function rowCb(row) {
    rows.push(row);
  }, function afterCb(err) {
    if(err) {
      callback(err);
    } else {
      callback(err, rows[0]['count']);
    }
  });
};

// 子类继承之

function Notebooks() {}
Notebooks.prototype = new BaseDb('notebooks');

function Notes() {}
Notes.prototype = new BaseDb('notes');
Notes.prototype.fixRow = function(row) {
  if(!row) {
    return;
  }
  if(row.Tags && typeof Tags == 'string') {
    row.Tags = row.Tags.split(',');
  }
  try {
    row.Attachs && (row.Attachs = JSON.parse(row.Attachs));
  } catch(e) {
    row.Attachs = null;
  }
  return row;
};

function Tags() {}
Tags.prototype = new BaseDb('tags');

function Users() {}
Users.prototype = new BaseDb('users');
Users.fixRow = function(row) {
  var State = row['State'];
  if(!State) {
    return row;
  }
  row.State = JSON.parse(State);
  return row;
};

function Attachs() {}
Attachs.prototype = new BaseDb('attachs');

function Images() {}
Images.prototype = new BaseDb('images');

function NoteHistories() {}
NoteHistories.prototype = new BaseDb('noteHistories');
NoteHistories.fixRow = function(row) {
  var Histories = row['Histories'];
  if(!Histories) {
    return row;
  }
  row.Histories = JSON.parse(Histories);
  return row;
}
function G() {}
G.prototype = new BaseDb('g');

var exports = {
  notebooks: new Notebooks(),
  notes: new Notes(),
  tags: new Tags(),
  users: new Users(),
  attachs: new Attachs(),
  images: new Images(),
  noteHistories: new NoteHistories(),
  g: new G()
};

// 一些测试方法
/*
exports.notes.insert({NoteId: 'xxx3', 'title': "你好吗?", 'NotebookId': 'life', Tags: ['red', '你好'], CreatedTime: new Date()}, function(err, data){ 
  console.log(err);
});

notes.update({NoteId: 'xxx3'}, {$set: {title: "你知道的", Tags: [], CreatedTime: new Date()}}, function(err) {
  console.log(err);
});
notes.remove({NoteId: 'xxx3'}, function(err, rows) {
  console.log("??");
  console.log(err);
  console.log(rows);
});
exports.notes.find({'$or': [{Title: new RegExp("你")}]}).sort({Title: -1}).exec(function(err, rows) {
  console.log(err);
  console.log(rows);
});
*/

module.exports = exports;
