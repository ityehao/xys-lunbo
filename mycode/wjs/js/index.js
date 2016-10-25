$(function() {
    /*
     * 1：获取屏幕宽度
     * 2：发送ajax 请求
     * 3: 解析数据，判断屏幕是移动的，还是pc 的
     * 4：根据不同的屏幕 进行数据解析，
     * 5: 把解析的数据组装成标签，  template
     * 6：把组装好的标签放在页面对应的区域位置
     *
     * background-size：
     * cover，始终填满盒子的整个区域，超出的隐藏隐藏掉
     * contain 始终在盒子里面显示整张图片，但是可能填充不了盒子。
     * */
    //初始化的任务
    banner();

     /*
     * 初始化页面的提示的插件.
     * */
    $('[data-toggle="tooltip"]').tooltip()

    //获取到所有的li 的宽度相加，给nav-tabs-product设置宽度
    initWitdh();
});
function banner(){

    var mydata;

    //获取数据。
    var getData=function(callback){

        //添加条件判断。
        if(mydata){
          callback && callback(mydata);

            return false;
        }
        $.ajax({
            url:"js/index.json",
            type:"GET",
            success:function(data){
                mydata=data;
                callback && callback(data);
            }
        })
    };
    /*
     *  渲染数据
     * */
    var render=function(){
        /*
         * 获取屏幕的宽度，根据屏幕的宽度来显示数据
         * */
        var width=$(window).width();

        //当前设备是否是移动设备，
        var  isMobile=false;

        //如果这个设备的宽度小于768，我们就认为移动设备
        if(width<768){
            isMobile=true;
        }

        //我要去获取数据，ajax 去获取数据，获取数据从服务端，我现在必须使用到wamp，
        //wamp 用他的主要是因为它能够解析php，把php 转换成静态资源
        //webstorm 是由内置服务器，它这个内置的服务器上面可以防止一个json 的文件
        //我先把服务器端数据准备好，大部分情况你是去调用服务器端接口，就是给服务端发送一个
        //请求，服务端返回数据给你，服务端php，javaee，你只需要知道别人返回什么数据给你，每个代表什么
        //你需要跟后台程序员进行沟通。
        //解析数据
        getData(function(data){
            //我需要解析数据
            //第一种做法：我使用js 把data 的数据解析，解析之后封装成html 标签，写到页面上面去。
            //借助模板  template-native.js
            /*
             * 1:导入js
             * 2：创建模板
             * 3：准备数据
             * 4：将模板与数据进行绑定 template方法进行绑定
             * 5：返回的是一个html
             * 6：我将这个html 写到页面上面。
             * */
            //tempate-native.js 这个下面的方法 ，讲数据与模板绑定
            //第二个，我需要传入数据，传入的数据必须是一个对象。。
            var obj={
                list:data,
                isMobile:isMobile
            }
            //返回的是模板里面的内容
            //template
            var html=template("templateId",obj);
            //它能够自动轮播，那是因为这个bootstrap.js 文件的代码起到了作用
            //bootstrap.js 能起到作用，我们必须按照bootstrap 指定的规则，指定的样式来。
            $(".carousel-inner").html(html);
        });
    };

    /*我们这样的一个事件，窗口的大小发生改变的时候触发*/
    $(window).on("resize",function(){
        render();
    })
    render();


    /*
    * 写手势操作
    * */
    /*
    * jd 的时候轮播图原生js
    * jQuery  来做这个轮播图
    *
    * 触屏的有几个事件
    *       touchstart
    *       touchmove
    *       touchend
    *       之前做轮播图的时候是怎么样的去判断向左向右话，记录开始的 位置
    *       移动的位置
    */

    var startX=0;
    var moveX=0;
    var distinceX=0;
    var isMove=false;


    /*
    * event
    * */
    $(".carousel-inner").on("touchstart",function(e){

           startX=e.originalEvent.touches[0].clientX;

    });
    $(".carousel-inner").on("touchmove",function(e){
        isMove=true;
        moveX=e.originalEvent.touches[0].clientX;
        distinceX=moveX-startX;

    });
    $(".carousel-inner").on("touchend",function(e){

           //判断是否移动了，是否需要手势
           if(isMove && Math.abs(distinceX)>50){

                 //向左，向右的问题
                 if(distinceX>0){
                     //上一张  我们目前使用的bootstrap 提供的轮播图，它里面有没有给我提供一些方法.
                     /*
                     * carousel  扩展了jQuery
                     *
                     * */
                     $('.carousel').carousel("prev");
                 }else{
                     //下一张..
                     $('.carousel').carousel("next");
                 }
           }
    });
}


function initWitdh(){
        var $tabsproduct=$(".nav-tabs-product");

        var $lis=$tabsproduct.find("li");
        var width=0;

        $lis.each(function(index,dom){
                //获取到的是每一个li
              /* console.log($(dom).width());*/
               width+=$(dom).width();
        });

        /*
        *    我现在获取页面上面所有的li 的宽度，相加设置到ul 上面去，ul
        *    ul 480px ul 有一个底部边框，底部边框的宽度是随着这边宽度的变化而变化.
        * */

        //获取屏幕的宽度，当屏幕的宽度小于768px才去设置.

       var width=$(window).width();

        if(width<768){
            $tabsproduct.css({"width":width+"px"});
         }



}