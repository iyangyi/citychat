var status = require('./status'),
	db = require('mongoskin').db('mongodb://name:pwd@localhost:27017/citychat',{native_parser:true});
var CURD = function(collection){
	this.collection = collection;
	db.bind(this.collection);
};

CURD.prototype = {
    
    /*
    * des: 插入一条记录
    * @query: JSON数据
    * @callback：回调 sueccess or fail
    *
    * */
    add: function(query, callback){
        db[this.collection].insert(query, function(err, item){
            if(err) {
                return callback(status.fail);
            }
            var obj = {
                status: status.success.status,
                message: status.success.message,
                items: {_id:item[0]['_id']}
            };
            return callback(obj);
        });
    },

    /*
    * @des：读取所有的记录
    * @query：JSON查询条件
    * @field：需要哪些字段
    * @sort：排序
    * @skip:跳过多少个
    * @sort_desc
    * @limit：一页多少个
    * @callback：回调，返回符合要求的记录或者失败信息
    *
    * */
    find: function(query,field,sort,skip,limit,callback){
        db[this.collection].find(query,field).sort(sort).skip(skip).limit(limit).toArray(function(err, items){
            if(err){
                return callback(status.fail);
            }
            var obj = {
                status: status.success.status,
                message: status.success.message,
                items: items
            };
			return callback(obj);
        });
    },

    /*
    * @des：读取一条记录
    * @id：_id
    * @field：需要哪些字段
    * @callback：回调，返回符合要求的记录或者失败信息
    *
    * */
    findById: function(id, field, callback){
        db[this.collection].findById(id, field, function(err, items){
            if(err){
                return callback(status.fail);
            }
            var obj = {
                status: status.success.status,
                message: status.success.message,
                items: items
            };
            return callback(obj);
        });
    },

    /*
    * @des：读取一条记录
    * @id：_id
    * @updatequery: 更新
    * @callback：回调，返回符合要求的记录或者失败信息
    *
    * */
    updateById: function(id, updatequery, callback){
        var set = {$set: updatequery};
        db[this.collection].updateById(id, set, function(err){
            if(err){
                return callback(status.fail);
            }else{
                return callback(status.success);
            }
        });
    },

    /*
    * @des：读取一条记录
    * @id：_id
    * @callback：回调，返回符合要求的记录或者失败信息
    *
    * */
    removeById: function(id, callback){
        db[this.collection].removeById(id, function(err){
            if(err){
                return callback(status.fail);
            }else{
                return callback(status.success);
            }
        });
    },

    /*
    * @des：读取一条记录
    * @query：JSON查询条件
    * @field：需要哪些字段
    * @callback：回调，返回符合要求的记录或者失败信息
    *
    * */
    findOne: function(query, field, callback){
        db[this.collection].findOne(query, field, function(err, items) {
            if(err){
                return callback(status.fail);
            }
            var obj = {
                status: status.success.status,
                message: status.success.message,
                items: items
            };
            return callback(obj);
        });
    },

    /*
    * @des：更新一条记录
    * @query：查询条件，Mongo查询的JSON字面量
    * @updateModel：需要更新的JSON格式的模型
    * @callback：返回成功或者失败信息
    *
    * */
    update: function(query, updateModel, callback){
        var set = {$set: updateModel};
        db[this.collection].update(query, set, function(err){
            if(err){
                return callback(status.fail);
            }else{
                return callback(status.success);
            }
        });
    },

    /*
    * @des：删除一条记录
    * @query：查询条件，Mongo查询的JSON字面量
    * @callback：返回失败或者成功的信息
    *
    * */
	delete: function(query, callback){
		db[this.collection].remove(query, function(err){
			if(err){
				return callback(status.fail);
			}else{
				return callback(status.success);
			}
		});
	},

    /*
    * @des：计算总数
    * @query：查询条件，Mongo查询的JSON字面量
    * @callback：返回失败或者成功的信息
    *
    * */
    count: function(query, callback){
        db[this.collection].count(query, function(err, items) {
            if(err){
                return callback(status.fail);
            }
            var obj = {
                status: status.success.status,
                message: status.success.message,
                items: items
            };
            return callback(obj);
        });
    },
    
    /**
	 * 关闭数据库
	 * @return nil
	 */
    closeDB: function(){
        db.close();
    }
};
module.exports = CURD;