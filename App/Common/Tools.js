var moment = require('moment');

// 修正来自Golang的时间 (2015-01-20T11:13:41.34+08:00Z)
exports.dateModifier = function(date) {
  return date === "" || date === undefined
         ? ""
         : date.replace('T', ' ')
                .replace('+', ' ')
                .split(".")[0];
}

// 格式化时间
exports.formatDate = function (date, friendly) {
  // moment.locale("zh-cn"); // 使用中文
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD');
  }

};

exports.extend = function(obj1, obj2) {
  for(var i in obj2) {
    if(obj2.hasOwnProperty(i)) {
      obj1[i] = obj2[i];
    }
  }
};

exports.isValidUrl = function(url) {
  return /http(s*):\/\/.+/.test(url);
}