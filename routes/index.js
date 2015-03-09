var express = require('express');
var router = express.Router();
var mongocurd = require('./mongodb.js');
var status = require('./status');
var curd = new mongocurd('user');

router.get('/', function(req, res) {
 	res.json({hello: "word"});
});

router.get('/girls', function(req, res) {
	var where = {};
	//性别
	where['gender'] = parseInt(req.query.gender) || 0;
	//城市
	var province = req.query.province || '';
	if (province) {
		where['province'] = province;
	}
	var city = req.query.city || '';
	if (city) {
		where['city'] = city;
	}
	//年龄
	var age =  req.query.age || '';
	if (age) {
		var age_limit = age.split("-");
		where['age'] = {$gte:parseInt(age_limit[0]),$lte:parseInt(age_limit[1])};
	}
	//身高
	var height =  req.query.height || '';
	if (height) {
		var height_limit = height.split("-");
		where['height'] = {$gte:parseInt(height_limit[0]),$lte:parseInt(height_limit[1])};
	}
	//学历
	var education = req.query.education || '';
	if (education) {
		where['education'] = education;
	}
	//收入
	var salary = req.query.salary || '';
	if (salary) {
		where['salary'] = salary;
	}
	//籍贯
	var native_province = req.query.native_province || '';
	if (native_province) {
		where['native_province'] = native_province;
	}
	var native_city = req.query.native_city || '';
	if (native_city) {
		where['native_city'] = native_city;
	}
	//住房情况
	var house = req.query.house || '';
	if (house) {
		where['house'] = house;
	}
	//体重
	var weight = req.query.weight || '';
	if (weight) {
		var weight_limit = weight.split("-");
		where['weight'] = {$gte:parseInt(weight_limit[0]),$lte:parseInt(weight_limit[1])};
	}
	//能否接受异地恋
	var is_accept_long_distance = req.query.is_accept_long_distance || '';
	if (is_accept_long_distance) {
		where['is_accept_long_distance'] = parseInt(req.query.is_accept_long_distance);
	}
	//性行为
	var is_accept_sex = req.query.is_accept_sex || '';
	if (is_accept_sex) {
		where['is_accept_sex'] = parseInt(req.query.is_accept_sex);
	}
	//家庭情况
	var family = req.query.family || '';
	if (family) {
		where['family'] = family;
	}
	console.log(where);
	//分页
	var page = req.query.page || 1;
	var limit = 20, sort = {sortorder:-1}, skip = (page-1)*limit;
	//需要的字段
	var field = {
		avatar:1,
		age:1,
		height:1,
		education:1,
		words:1,
		salary:1,
		photos:1,
		_id:1,
		name:1,
		attractive_part:1,
		gender:1,
		vip:1
	};
	curd.find(where,field,sort,skip,limit,function(data){
		// for (i in data['items']) {
		// 	console.log(data['items'][i]['photos']);
		// 	if (data['items'][i]['avatar'] && data['items'][i]['avatar'] != undefined) {
		// 		data['items'][i]['avatar'] = data['items'][i]['avatar'].replace(/citychat.qiniudn.com/g,'7sblh5.com1.z0.glb.clouddn.com');
		// 	}
		// 	if (data['items'][i]['photos'] && data['items'][i]['photos'] != undefined) {
		// 		var temp_photos = data['items'][i]['photos'].join(",");
		// 		temp_photos = temp_photos.replace(/citychat.qiniudn.com/g,'7sblh5.com1.z0.glb.clouddn.com');
		// 		data['items'][i]['photos'] = temp_photos.split(',');
		// 	}
		// }
		res.json(data);
	});
});


module.exports = router;
