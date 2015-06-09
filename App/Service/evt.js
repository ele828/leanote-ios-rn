// var fs = require('fs');
// var User = require('user');

// 为什么不存在?
// var dataBasePath = require('nw.gui').App.dataPath; //  + '/data';
/*
// 判断是否存在, 不存在则创建dir
if(!fs.existsSync(dataBasePath)) {
	fs.mkdirSync(dataBasePath);
}
*/
// dataBasePath = '';

var Evt = {
	defaultUrl: 'http://leanote.com',

	leanoteUrl: 'http://leanote.com',
	// leanoteUrl: 'http://localhost:9000',

	setHost: function(host) {
		if(!host) {
			this.leanoteUrl = this.defaultUrl;
		} else {
			this.leanoteUrl = host;
		}
	},

	getHost: function() {
		return this.leanoteUrl;
	},

	port: 8912,
	localUrl: 'http://127.0.0.1:8912',
	dataBasePath: '',

	getImageLocalUrl: function(fileId) {
		return this.localUrl + '/api/file/getImage?fileId=' + fileId;
	},
	getAttachLocalUrl: function(fileId) {
		return this.localUrl + '/api/file/getAttach?fileId=' + fileId;
	},
	getAllAttachLocalUrl: function(noteId) {
		return this.localUrl + '/api/file/getAllAttachs?noteId=' + noteId;
	},
	getProjectBasePath: function() {
		var dirname = __dirname;
		// /app/node_modules
		return dirname.replace('/node_modules', '').replace('\\node_modules', ''); // windows情况
	},
	// 项目绝对地址
	getBasePath: function() {
		var me = this;
		// return dataBasePath; // process.cwd();
		// return process.cwd();
		return me.dataBasePath;
	},
	getAbsolutePath: function(relative) {
		var me = this;
		return me.getBasePath() + '/' + relative;
	},
	setDataBasePath: function(dataBasePath) {
		var me = this;
		// console.log('...........')
		// console.error(dataBasePath);
		me.dataBasePath = dataBasePath;

		return;
		try {
			fs.mkdirSync(dataBasePath);
		}
		catch(e) {};
	}
};
module.exports = Evt;
