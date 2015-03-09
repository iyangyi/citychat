$(function(){
    
    //ajax
    var get_city_from_province = function(province, city, selected_city){
        $.get('/admin/get_city',{province:province}, function(data){
            if (data) {
                city.empty();
                city.append("<option value='-1'>不限</option>"); 
                $.each(data, function(){
                    if (this == selected_city) {
                        var selected = ' selected ';
                    } 
                    city.append("<option value='"+this+"'"+ selected + ">"+this+"</option>");   
                });  
            }
        })
    }

    //居住地
    var province = $("select[name='province']");
    var selected_city = $("input[name='selected_city']").val();
    var city = $("select[name='city']");
    get_city_from_province(province.val(), city, selected_city);

    //籍贯
    var native_province = $("select[name='native_province']");
    var selected_n_city = $("input[name='selected_n_city']").val();
    var native_city = $("select[name='native_city']");
    get_city_from_province(native_province.val(), native_city, selected_n_city);

    //居住地change
    province.change(function(){
        var p = $(this).children('option:selected').val();
        get_city_from_province(p, city);
    })
    //籍贯change
    native_province.change(function(){
        var n_p = $(this).children('option:selected').val();
        get_city_from_province(n_p, native_city);
    })

    //列表删除用户
    $(document).on("click", '.user-delete', function(){
        confirm('确认删除这个用户嘛?') && ajax_delete($(this).attr('data-id'), 1);
    });

    //详情页删除用户
    $(document).on("click", '.user-detail-delete', function(){
        confirm('确认删除这个用户嘛?') && ajax_delete($(this).attr('data-id'), 2);
    });

    //修改资料
    $('.user-detail-update').click(function(){
        var form = $("#user-detail-page");
        ajax_update(form);
    });

    //修改时间
    var reg_times = new Date($("#reg_times").html());
    var time = reg_times.getFullYear() + '-' + (reg_times.getMonth() + 1) + '-' + reg_times.getDate() 
    + ' ' + reg_times.getHours() + ':' + reg_times.getMinutes() + ':' + reg_times.getSeconds();
    $("#reg_times").html(time);

    //修改排序优先级
    $(document).on("click", '.set_sortorder', function(){
        ajax_set_top_level($(this).attr('data-id'));
    });
})

loadmore = true;
$(window).scroll(function(){  
    var range = 10;   
    var srollPos = $(window).scrollTop();
    var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);
    if(($(document).height()-range) <= totalheight && loadmore) {
        loadMore();
    }
}); 

var loadMore = function(){
    var param = $("input[name='next_page']");
    var user_list = $("#user_list");
    $.get('/admin','ajax=1&' + param.val(), function(data){
        if (data.nologin) {
            alert('请先登陆');
            window.location.href='/admin/login';
        }
        if (data.count && data.list.join(",")) {
            param.val(data.param);
            $.each(data.list, function(){
                var html = '';
                if(!this.name) this['name'] = 'NULL';
                if(!this.words) this['words'] = '无头像';
                if(!this.avatar) this['avatar'] = 'http://citychat1.qiniudn.com/citychat-default-null.jpg';
                var photos = '';
                if (this.photos && this.photos.join(",")){
                    $.each(this.photos, function(key,value){
                        if (key<=5) {
                            photos += '<a href="'+this+'" target="_blank"> <img src="'+this+'" height="45px" width="35"></a>';
                        }
                    })
                } else {
                    photos = '<img src="http://citychat1.qiniudn.com/citychat-default-null.jpg" height="45px">';
                }
                if(!this.height) this.height=0;
                if(!this.age) this.age=0;
                if(!this.education) this.education='NULL';
                this.top_button = '';
                if(!this.vip) this.top_button = '<div class="btn-group"><button type="button" data-id="'+this._id+'" class="btn btn-success set_sortorder">颜值高，顶上去 ↑ </button></div>';
                html+= '<div class="col-lg-3" id="'+this._id+'""><h3>'+this.name+'</h3><p class="text-danger"><a href="/admin/detail?id='+this._id+'" target="_blank"><img src="'+this.avatar+'" title="'+this.words+'" height="220px" class="img-circle"></a></p><p>'+this.age+'岁 | '+this.height+'cm | '+this.education+'</p><p>'+photos+'</p><div class="btn-group delete_action"> <button data-id="'+this._id+'" class="btn btn-danger user-delete">删除用户</button></div>'+ this.top_button + '</div>';
                user_list.append(html);   
            }); 
        } else {
            loadmore = false;
        }
        
    })
}

var ajax_delete = function(id, type){
    $.get('/admin/delete_user',{id:id}, function(data){
        if (data.nologin) {
            alert('请先登陆');
            window.location.href='/admin/login';
        }
        if (data.status) {
            if (type == 1) {
                $("#" + id).remove();
            } else {
                alert('删除成功,本页面将关闭');
                window.close();
            }
        } else {
            alert('删除失败!请重试');
        }
    })
}

var ajax_update = function(form) {
    $.get('/user/update',form.serialize(), function(data){
        if (data.status) {
            alert('修改成功!');
        } else {
            alert('修改失败 : '+ data.message);
        }
    })
}

var ajax_set_top_level = function(id) {
    var sortorder = Math.floor(Math.random() * 10000 + 80000);
    $.get('/admin/set_sortorder',{id:id, sortorder:sortorder}, function(data){
        if (data.status) {
            alert('设置成功!');
        } else {
            alert('修改失败 : '+ data.message);
        }
    })
}