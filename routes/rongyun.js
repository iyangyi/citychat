var request = require('request');
var crypto = require('crypto');
var status = require('./status.js');
var rongyun = {};
var serverapiurl = 'https://api.cn.rong.io'; 
var format = '.json';

/**
 * curl 
 * 
 * @param  string  url
 * @param  string  param
 * @param  Function callback 
 * @return 
 */
rongyun.curl = function(uri, param, callback)
{
    var url = serverapiurl + uri + format;
    request({
        method: 'POST', 
        url: url,
        headers: rongyun.sign(),
        formData: param
    }, function (error, response, body) {
        if (error) {
            var data = {
                status: status.fail.status,
                message: error
            };
            return callback(data);
        } else {
            var data = {
                status: status.success.status,
                message: status.success.message,
                items: JSON.parse(body)
            };
            return callback(data);
        }
    });
}

/**
 * 签名
 * 
 * @return object
 */
rongyun.sign = function() 
{
    var nonce = Math.floor(Math.random()*100000000).toString()
    var timeStamp = Date.parse(new Date()) /1000;
    //sha1
    var sign_str = status.rongyun_config.APP_SECRET + nonce + timeStamp;
    var sha1 = crypto.createHash('sha1');
    sha1.update(sign_str,'utf8');
    var sign = sha1.digest('hex');
    var http_heaer =  {
        'RC-App-Key': status.rongyun_config.APP_KEY,
        'RC-Nonce': nonce,
        'RC-Timestamp': timeStamp,
        'RC-Signature': sign
    };
    return http_heaer;
}

/**
 * 获取token
 * 
 * @param  string user_id 用户id
 * @param  string name 用户name
 * @param  string avatar 头像地址
 * @param  function 回调函数
 * @return token
 */
rongyun.getToken = function(userId, name, avatar, callback)
{
    rongyun.curl(
        '/user/getToken',
        {'userId' : userId, 'name' : name, 'portraitUri' : avatar}, 
        function(data){
            return callback(data);
        }
    );
}

/**
 * 刷新用户信息
 * @return {[type]} [description]
 */
rongyun.userRefresh = function(userId, name, avatar, callback)
{
    rongyun.curl(
        '/user/refresh',
        {'userId' : userId, 'name' : name, 'portraitUri' : avatar}, 
        function(data){
            return callback(data);
        }
    );
}

/**
 * 加入群组/创建群组
 * 
 * @param  string   userId 用户id
 * @param  string   groupId 群组id
 * @param  string   groupName 群组名字
 * @param  Function callback
 * @return Function
 */
rongyun.groupJoin = function(userId, groupId, groupName, callback)
{
    rongyun.curl(
        '/group/join',
        {'userId' : userId, 'groupId' : groupId, 'groupName' : groupName}, 
        function(data){
            return callback(data);
        }
    );
}


/**
 * 退出群组
 * 
 * @param  string   userId 用户id
 * @param  string   groupId 群组id
 * @param  string   groupName 群组名字
 * @param  Function callback
 * @return Function
 */
rongyun.groupQuit = function(userId, groupId, callback)
{
    rongyun.curl(
        '/group/quit',
        {'userId' : userId, 'groupId' : groupId}, 
        function(data){
            return callback(data);
        }
    );
}

module.exports = rongyun;