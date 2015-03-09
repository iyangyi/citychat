module.exports = {
    
    /**
     * 删除qiniu的图片
     */
    delete_qiniu_photo: function(photo, callback){
        var qiniu = require('qiniu');
        var path = require('path');
        var url = require('url');
        var status = require('./status');
        //config
        qiniu.conf.ACCESS_KEY = status.qiniu_config.ACCESS_KEY;
        qiniu.conf.SECRET_KEY = status.qiniu_config.SECRET_KEY;
        //delete
        var client = new qiniu.rs.Client();
        var qiniu_key = path.basename(photo);
        var bucket = url.parse(photo).hostname.split('.')[0];
        client.remove(bucket, qiniu_key, function(err, ret) {
            if (!err) {
                var data = {
                    status: status.success.status,
                    message: status.success.message,
                };
            } else {
                var data = {
                    status: status.fail.status,
                    message: err.error
                };
            }
            return callback(data);
        })
    }, 

    get_qiuniu_uptoken: function() {
        var qiniu = require('qiniu');
        var status = require('./status');
        //config
        qiniu.conf.ACCESS_KEY = status.qiniu_config.ACCESS_KEY;
        qiniu.conf.SECRET_KEY = status.qiniu_config.SECRET_KEY;
        var putPolicy = new qiniu.rs.PutPolicy('citychat1');
        var data = {
            status: status.success.status,
            message: status.success.message,
            items: {uptoken:putPolicy.token()}
        };
        return data;
    }
}