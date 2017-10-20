//1.点击视图反转
function trun(ele) {
    var cls = ele.className;
    var n = ele.id.split("_")[1];
    if(!/photo_center/.test(cls)){
        return rsort(n);
    }

    if(/photo_front/.test(cls)){
        cls = cls.replace(/photo_front/,'photo_back');
        g('#nav_' + n).className += ' i_back';
    }else {
        cls = cls.replace(/photo_back/,'photo_front');
        g('#nav_' + n).className = g('#nav_' + n).className.replace(/\s*i_back\s*/,' ');
    }
    return ele.className = cls;
}
//2.改写视图为模板字符串(通用函数)
function g(selector) {
    var method = selector.substr(0,1) == '.' ? 'getElementsByClassName' : 'getElementById';
    return document[method](selector.substr(1));
}
//3.输出所有的海报
var data = data;
function addPhotos() {
    var template = g('#wrap').innerHTML;
    var html = [];
    var nav = [];
    //替换data之后，输出每一个控制按钮
    for(var s in data){
        var _html = template
                  .replace('{{index}}',s)
                  .replace('{{img}}',data[s].img)
                  .replace("{{caption}}",data[s].caption)
                  .replace("{{desc}}",data[s].desc);
        html.push(_html);
       // var _nav = '<span id="nav_'+i+'" class="i" onclick="trun(g(\'#photo_'+s+'\'))"></span>'
        nav.push('<span id="nav_'+s+'" onclick="trun(g(\'#photo_' +
            s+'\'))" class="i">&nbsp;</span>');
        }
    html.push('<div class="nav">'+nav.join('')+'</div>')
    g('#wrap').innerHTML = html.join('');
    rsort(random([0,data.length]));
}
addPhotos();

//4.排序海报
function rsort(n) {
    var photo_center = g('#photo_' + n);

    var _photo = g('.photo');
    var photos = [];
    for( var i=0;i<_photo.length;i++){
        _photo[i].className = _photo[i].className.replace(/\s*photo_center\s*/,' ');
        _photo[i].className = _photo[i].className.replace(/\s*photo_back\s*/,' ');


        _photo[i].style.left = '';
        _photo[i].style.top = '';
        _photo[i].style['transform'] = 'rotate(0deg) scale(1)';
        photos.push(_photo[i]);
    }

    photo_center.className += ' photo_center';

    photo_center = photos.splice(n,1)[0]; //左右分区除位于中间的图片

    //把海报分为左右两个区

    var photos_left = photos.splice(0,Math.ceil(photos.length/2));
    var photos_right = photos;

    var ranges = range();
    for(var s in photos_left){
        var photo = photos_left[s];
        photo.style.left = random(ranges.left.x) + 'px';
        photo.style.top = random(ranges.left.y) + 'px';

        photo.style['transform'] = 'rotate(' + random([-150,150]) + 'deg) scale(.7)';
    }
    for(var s in photos_right){
        var photo = photos_right[s];
        photo.style.left = random(ranges.right.x) + 'px';
        photo.style.top = random(ranges.right.y) + 'px';
        photo.style['transform'] = 'rotate(' + random([-150,150]) + 'deg) scale(.7)';
    }
   //控制按钮处理
    var navs = g('.i');
    for(var i = 0;i < navs.length; i++){
        navs[i].className = navs[i].className.replace(/i_current/,' ');
        navs[i].className = navs[i].className.replace(/i_back/,' ');
    }
    g('#nav_' + n).className+=' i_current';
}
//6.计算左右分区的随机范围
// { left:{x:[min,max],y:[]}, right:{x:[min,max],y:[]}}
function range() {
    var range = {
        left:{
            x: [],
            y: []
        },
        right:{
            x: [],
            y: []
        }
    };
    var wrap ={
        w: g('#wrap').clientWidth,
        h: g('#wrap').clientHeight
    };
    var photo ={
        w: g('.photo')[0].clientWidth,
        h: g('.photo')[0].clientHeight
    };
    range.wrap = wrap;
    range.photo = photo;
    range.left.x = [0-photo.w,wrap.w/2-photo.w/2];
    range.left.y = [0-photo.h,wrap.h];
    range.right.x = [wrap.w/2+photo.w/2,wrap.w+photo.w];
    range.right.y = [0-photo.h,wrap.h];
    return range;
}
//5.随机生成值
function random(range) {
    var min = Math.min(range[0],range[1]);
    var max = Math.max(range[0],range[1]);
    var diff = max - min;
    var number = Math.ceil( (Math.random()*diff + min) );
    return number;
}