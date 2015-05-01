/**
 * Api接口
 *
 */

'use strict';

var BASE_ADDRESS = 'http://www.leanote.com/api';

module.exports = {
  
  // 登录
  Login: BASE_ADDRESS + '/auth/login',

  //注册
  Register: BASE_ADDRESS + '/auth/register',

  // 获取增量同步的所有笔记本
  SyncNotebooks: BASE_ADDRESS + '/notebook/getSyncNotebooks',

  // 获取增量同步的所有笔记
  SyncNotes: BASE_ADDRESS + '/note/getSyncNotes',

}
