var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var mongocurd = require('./mongodb.js');
var status = require('./status');
var provinces = require('./provinces.js').provinces;
var curd = new mongocurd('user');
var querystring=require("querystring");
var common = require('./common');
/**
 * 后台
 */
router.get('/', function(req, res) {
    //check login
    if (!req.session.login) {
        if (req.query.ajax) {
            return res.json({nologin:1});
        } else {
            return res.redirect('/admin/login');
        }
    }

    var where = {};
    //性别
    var gender = req.query.gender || '';
    if (gender && gender !='-1') {
        where['gender'] = parseInt(req.query.gender);
    }
    //城市
    var province = req.query.province || '';
    if (province && province !='-1') {
        where['province'] = province;
    }
    var city = req.query.city || '';
    if (city && city !='-1') {
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
    if (education && education !='-1') {
        where['education'] = education;
    }
    //收入
    var salary = req.query.salary || '';
    if (salary && salary !='-1') {
        where['salary'] = salary;
    }
    //籍贯
    var native_province = req.query.native_province || '';
    if (native_province && native_province !='-1') {
        where['native_province'] = native_province;
    }
    var native_city = req.query.native_city || '';
    if (native_city && native_city !='-1') {
        where['native_city'] = native_city;
    }
    //住房情况
    var house = req.query.house || '';
    if (house && house !='-1') {
        where['house'] = house;
    }
    //体重
    var weight = req.query.weight || '';
    if (weight && weight !='-1') {
        var weight_limit = weight.split("-");
        where['weight'] = {$gte:parseInt(weight_limit[0]),$lte:parseInt(weight_limit[1])};
    }
    //能否接受异地恋
    var is_accept_long_distance = req.query.is_accept_long_distance || '';
    if (is_accept_long_distance && is_accept_long_distance !='-1') {
        where['is_accept_long_distance'] = parseInt(req.query.is_accept_long_distance);
    }
    //性行为
    var is_accept_sex = req.query.is_accept_sex || '';
    if (is_accept_sex && is_accept_sex !='-1') {
        where['is_accept_sex'] = parseInt(req.query.is_accept_sex);
    }
    //家庭情况
    var family = req.query.family || '';
    if (family && family !='-1') {
        where['family'] = family;
    }
    //vip
    var vip = req.query.vip || '';
    if (vip && vip !='-1') {
        where['vip'] = parseInt(vip);
    }
    //用户
    var user_type = req.query.user_type || '';
    if (user_type && user_type !='-1') {
        where['user_type'] = parseInt(user_type);
    }
    //id
    var _id = req.query._id || '';
    if (_id && _id !='-1') {
        where['_id'] = new ObjectID(_id);
    }
    //name
    var name = req.query.name || '';
    if (name && name !='-1') {
        where['name'] = new RegExp(name);
    }
    //平台
    var channelId = req.query.channelId || '';
    if (channelId && channelId !='-1') {
        where['channelId'] = channelId;
    }

    //排序
    var sort_by = req.query.sort
    if (sort_by && sort_by == 1) {
        sort = {sortorder:-1}; 
    } else if (sort_by && sort_by == 2) {
        sort = {_create_time:-1};
    } else {
        sort = {sortorder:-1};
    }

    //分页
    var page = parseInt(req.query.page) || 1;
    var limit = 32, skip = (page-1)*limit;
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
    // console.log(req.query);
    // console.log(where);

    //page
    req.query.page= page + 1;

    //ajax
    var ajax =  req.query.ajax;

    curd.count(where,function(info){
        curd.find(where,field,sort,skip,limit,function(data){
            if (ajax) {
                delete req.query.ajax;
                res.json({count: info['items'], list: data['items'], param: querystring.stringify(req.query)});
            } else {
                res.render('admin', {title: '审核后台 beta', count: info['items'],
                list: data['items'], provinces: provinces, query:req.query, param: querystring.stringify(req.query)});
            }
        });
    })
});

/**
 * 省市联动
 */
router.get('/get_city', function(req, res) {
    var province = req.query.province || -1;
    var city = new Array();
    if (province == '-1') {
        res.json(city);
    } else {
        for(i in provinces) {
            if (provinces[i].name == province) {
                for (j in provinces[i].cities) {
                    city.push(provinces[i]['cities'][j].name);
                }
            }
        }
        res.json(city);
    }
})

/**
 * 删除用户
 */
router.get('/delete_user', function(req, res) {
    
    //check login
    if (!req.session.login) {
        return res.json({nologin:1});
    }

    var id = req.query.id || '';
    if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
        status.fail.message = "id is null";
        return res.json(status.fail);
    }
    
    curd.findById(id,{},function(info){
        //删除qiniu图片
        if (info.status && info.items) {
            if (info.status && info.items) {
                if (info.items.avatar != undefined || info.items.avatar != null) {
                    common.delete_qiniu_photo(info.items.avatar,function(result){});
                }
                if ((info.items.photos != undefined || info.items.photos != null) && info.items.photos.join(",")) {
                    for (var p in info.items.photos){
                        common.delete_qiniu_photo(info.items.photos[p],function(result2){});
                    }
                }
            }
            //删除用户
            curd.removeById(id,function(data){
                res.json(status.success);
            });
        } else {
            res.json(info);
        }
    });
})

/**
 * 登陆
 */
router.get('/login', function(req, res) {
    req.session.login = 0;
    res.render('login', {title: '登陆页面', query:req.query}); 
})

/**
 * 详情
 */
router.get('/detail', function(req, res) {
    //check login
    if (!req.session.login) {
        return res.redirect('/admin/login');
    }
    var id = req.query.id || '';
    if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
        status.fail.message = "id is null";
        return res.json(status.fail);
    }
    //过滤字段
    var field = {
        _yy_id:0,
        _photos:0,
        _avatar:0
    };
    curd.findById(id, field, function(data){
        if (data.status && data['items']) {
            res.render('detail', {title: '用户详情页', provinces: provinces, query: data['items']});
        } else {
            status.fail.message = "查询失败或用户不存在";
            res.json(status.fail);
        }
    })
})

/**
 * 登陆验证
 */
router.post('/post_login', function(req, res) {
    var name = req.param('name');
    var password = req.param('password');
    if ((name === "admin") && (password === "admin")) {
       req.session.login = 1;
       return res.redirect('/admin');
    } else {
       return res.redirect('/admin/login?error=1');
    }
})


/**
 * 设置sortorder排序
 */
router.get('/set_sortorder', function(req, res) {

    if (!req.session.login) {
        return res.redirect('/admin/login');
    }
    var id = req.param('id');
    if (!id || id == undefined || id == 'null' || id == null || id == 'undefined') {
        status.fail.message = "id is null";
        return res.json(status.fail);
    }
    var query = {};
    query['sortorder'] = parseInt(req.param('sortorder'));

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
})

module.exports = router;
