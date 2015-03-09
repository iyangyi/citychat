var express = require('express');
var router = express.Router();
var path = require('path');
var mongocurd = require('./mongodb.js');
var status = require('./status');
var curd = new mongocurd('user');
var common = require('./common');

/**
 * 首页
 */
router.get('/', function(req, res) {
	res.json({hello: "word"});
});

/**
 * 注册接口
 */
router.get('/register', function(req, res) {
	//deviceNo
	var deviceNo = req.param('deviceNo');
	if (!deviceNo || deviceNo == undefined || deviceNo == 'null' || deviceNo == null  || deviceNo == 'undefined') {
		status.fail.message = "deviceNo is null";
		return res.json(status.fail);
	}

	//查找下用户是否存在
	var where = {deviceNo:deviceNo}
	//过滤字段
	var field = {
		_yy_id:0,
		_photos:0,
		_avatar:0,
		rong_token:0,
		imei:0,
		deviceNo:0,
		deviceManufacturer:0,
		appVersion:0,
		deviceType:0,
		netConnectionType:0,
		channelId:0,
		_create_time:0
	};
	curd.findOne(where, field, function(data){
		if(!data.items || data.items == undefined || !data.status) {
			//新增用户
			insert_new_user();
		} else {
			res.json(data);
		}
	})
	//新增用户
	var insert_new_user = function() {
		var time = new Date();
		var user = {
			imei: req.param('imei') || '',
			deviceNo: req.param('deviceNo') || '',
			deviceManufacturer: req.param('deviceManufacturer') || '',
			appVersion : req.param('appVersion') || '',
			deviceType: req.param('deviceType') || '',
			netConnectionType: req.param('netConnectionType') || '',
			channelId: req.param('channelId') || '',
			user_type: 1, //真实用户
			vip: 0, //vip
			_create_time: time,
		};
		curd.add(user, function(data){
			res.json(data);
	 	});
	}
});

/**
 * 获取用户信息
 */
router.get('/info', function(req, res) {
	var id = req.query.id;
	if (!id || id == undefined || id == 'null' || id == null  || id == 'undefined') {
		status.fail.message = "id is null";
		return res.json(status.fail);
	}
	//过滤字段
	var field = {
		_yy_id:0,
		_photos:0,
		_avatar:0,
		rong_token:0,
		imei:0,
		deviceNo:0,
		deviceManufacturer:0,
		appVersion:0,
		deviceType:0,
		netConnectionType:0,
		channelId:0,
		_create_time:0
	};
	curd.findById(id, field, function(data){
		return res.json(data);
 	});
});

/**
 * 修改用户基本信息
 */
router.get('/update', function(req, res) {
	var id = req.param('id');
	if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
		status.fail.message = "id is null";
		return res.json(status.fail);
	}
	var query = {
		is_accept_sex : parseInt(req.param('is_accept_sex')) || (parseInt(req.param('is_accept_sex')) == 0 ? 0: undefined),
		house : req.param('house'),
		native_province : req.param('native_province'),
		native_city : req.param('native_city'),
		is_want_child :  parseInt(req.param('is_want_child')) || (parseInt(req.param('is_want_child')) == 0 ? 0: undefined),
		province : req.param('province'),
		city: req.param('city'),
		area: req.param('area'),
		living_city : req.param('living_city'),
		education : req.param('education'),
		love_object : req.param('love_object'),
		attractive_part : req.param('attractive_part'),
		is_accept_long_distance : parseInt(req.param('is_accept_long_distance')) || (parseInt(req.param('is_accept_long_distance')) == 0 ? 0: undefined),
		hobby : req.param('hobby'),
		body : req.param('body'),
		salary : req.param('salary'),
		photos : req.param('photos') ? (req.param('photos')).split(',') : undefined,
		job : req.param('job'),
		words : req.param('words'),
		height : parseInt(req.param('height')) || (parseInt(req.param('height')) == 0 ? 0: undefined),
		qq : req.param('qq'),
		name : req.param('name'),
		gender : parseInt(req.param('gender')) || (parseInt(req.param('gender')) == 0 ? 0: undefined),
		age : parseInt(req.param('age')) || (parseInt(req.param('age')) == 0 ? 0: undefined),
		married : req.param('married'),
		avatar : req.param('avatar'),
		is_agree_live_with_patent : parseInt(req.param('is_agree_live_with_patent')) || (parseInt(req.param('is_agree_live_with_patent')) == 0 ? 0: undefined),
		birthday: req.param('birthday'),
		weight: parseInt(req.param('weight')) || (parseInt(req.param('weight')) == 0 ? 0: undefined),
		family: req.param('family'),
		vip: parseInt(req.param('vip')) || (parseInt(req.param('vip')) == 0 ? 0: undefined),
	};
	for (var p in query ){
		if (query[p] == undefined || query[p] == '-1') {
			delete query[p];
		}
	}

	if (!query) {
		return res.json(status.fail);
	}
	//设置排序
	if (parseInt(req.param('sortorder'))) {
		query['sortorder'] = parseInt(req.param('sortorder'));
	} else {
		query['sortorder'] = 888888;
	}
	curd.updateById(id, query, function(data){
 		//跟新rong_token
 		if (data.status) {
 			var taskQueue = new mongocurd('taskQueue');
			info = {type:"rong.get_user_token",args:{id:id}};
			taskQueue.add(info, function(data){
			});
 		}
		res.json(data);
	});
});

/**
 * vip 充值
 */
router.get('/vip', function(req, res) {
	var id = req.param('id');
	if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
		status.fail.message = "id is null";
		return res.json(status.fail);
	}
	var query = {};
	query['vip'] = 1;
	//sortorder默认999999
	query['sortorder'] = 999999;
	curd.updateById(id, query, function(data){
		res.json(data);
	});
})

/**
 * 获取token
 */
router.get('/token', function(req, res) {
	//id
	var id = req.param('id');
	if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
		status.fail.message = "id is null";
		return res.json(status.fail);
	}
	//deviceNo
	var deviceNo = req.param('deviceNo');
	if (!deviceNo || deviceNo == undefined || deviceNo == 'null' || deviceNo == null || deviceNo == 'undefined') {
		status.fail.message = "deviceNo is null";
		return res.json(status.fail);
	}
	//字段
 	var field = {
 		_id:0,
 		deviceNo:1,
		rong_token:1
	}
	curd.findById(id, field, function(data){
		if(!data.items || data.items == undefined || !data.status 
			|| data.items['deviceNo'] != deviceNo || !data.items['rong_token']) {
			status.fail.message = "deviceNo and id not match";
			res.json(status.fail);
		} else {
			delete data.items['deviceNo'];
			return res.json(data);
		}
 	});
})

/**
 * 对话聊天
 */
router.get('/chat', function(req, res) {
	var from_id = req.param('from_id');
	if (!from_id || from_id == undefined || from_id == 'null' || from_id == null || from_id == 'undefined') {
		status.fail.message = "from_id is null";
		return res.json(status.fail);
	}
	var to_id = req.param('to_id');
	if (!to_id || to_id == undefined || to_id == 'null' || to_id == null || to_id == 'undefined') {
		status.fail.message = "to_id is null";
		return res.json(status.fail);
	}
	var msg = req.param('msg');
	if (!msg || msg == undefined) {
		status.fail.message = "msg is null";
		return res.json(status.fail);
	}
	var reply = req.param('reply');
	var taskQueue = new mongocurd('taskQueue');
	if (reply == 1) {
		var type = "rong.auto_reply_message";
	} else {
		var type = "rong.send_text_message";
	}
	var info = {type:type,args:{from_id:from_id,to_id:to_id,msg:msg}};
	taskQueue.add(info, function(data){
		res.json(data);
	});
})

/**
 * 获取qiniu 的uptoken
 */
router.get('/get_qiniu_uptoken', function(req, res) {
	//校验
	//id
	var id = req.param('id');
	if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
		status.fail.message = "id is null";
		return res.json(status.fail);
	}
	//deviceNo
	var deviceNo = req.param('deviceNo');
	if (!deviceNo || deviceNo == undefined || deviceNo == 'null' || deviceNo == null || deviceNo == 'undefined') {
		status.fail.message = "deviceNo is null";
		return res.json(status.fail);
	}
	//字段
 	var field = {
 		_id:0,
 		deviceNo:1
	};
	curd.findById(id, field, function(data){
		if(!data.items || data.items == undefined || !data.status 
			|| data.items['deviceNo'] != deviceNo) {
			status.fail.message = "deviceNo and id not match";
			res.json(status.fail);
		} else {
			res.json(common.get_qiuniu_uptoken());
		}
 	});
})

/**
 * 删除图片
 */
router.get('/delete_photo', function(req, res) {
	//校验
	//id
	var id = req.param('id');
	if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
		status.fail.message = "id is null";
		return res.json(status.fail);
	}
	//deviceNo
	var deviceNo = req.param('deviceNo');
	if (!deviceNo || deviceNo == undefined || deviceNo == 'null' || deviceNo == null || deviceNo == 'undefined') {
		status.fail.message = "deviceNo is null";
		return res.json(status.fail);
	}
	//photos
	var photo = req.param('photo');
	if (!photo || photo == undefined || photo == 'null' || photo == null || photo == 'undefined') {
		status.fail.message = "photo is null";
		return res.json(status.fail);
	}

	//过滤字段
	var field = {
		photos:1,
		deviceNo:1
	};
	//find
	curd.findById(id, field, function(data){
		if(!data.items || data.items == undefined || !data.status 
			|| data.items['deviceNo'] != deviceNo) {
			status.fail.message = "deviceNo and id not match";
			res.json(status.fail);
		} else {
			var photos = data['items']['photos'];
			var new_photos = new Array();
			for (var i in photos){
				if (photos[i] != photo && photos[i] != null) {
					new_photos.push(photos[i]);
				}
			}
			var query = {
				'photos': new_photos
			};
			//更新photos
			curd.updateById(id, query, function(data){
		 		if (data.status) {
					common.delete_qiniu_photo(photo, function(info){
						res.json(info);
					});
		 		}
			})
		}
	})
})

module.exports = router;
