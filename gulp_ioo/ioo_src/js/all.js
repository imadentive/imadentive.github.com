/**
 * Created by Administrator on 2016/6/20.
 */
var obj = {
    mySwiper:function () {
        new Swiper('.swiper-container', {
            pagination: '.swiper-pagination',
            paginationClickable: true
        })
    },

    myScroll:function (id) {
        return new IScroll(id, { scrollX: true, scrollY: true, mouseWheel: false,click: true,
            eventPassthrough:true,bounceTime:600,deceleration:0.01

        });//i5
       // // document.getElementById(id).addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
       //  var obj = document.getElementById(id);
       // //console.log(obj)//null
       //  if (obj==null) {
       //      //不存在，错误处理
       //
       //  }else{
       //      //存在，正常处理
       //      // new iScroll(id,{hScrollbar:false, vScrollbar:false}); //iscrool4
       //      // console.log('iscroll')
       //  }

    },
    getWidth:function (which,obj,val) {
        var width = val;
        $(which).each(function(index,ele) {
            //console.log($(ele).outerWidth(true))
            width = width + $(ele).outerWidth(true);

        });
        //console.log(width)
        $(obj).width(width);
    },
    openNav:function () {
        $('#close-nav').on('click',function () {
            $('body').removeClass('navshow');
        });

        $('#open-nav').on('click',function () {
            $('body').addClass('navshow');
        });
    },

    dropDown:function () {
        $('#down').on('click',function () {
            $(this).find('.down').toggleClass('up');
            $('.text-nav-list').slideToggle('fast',function () {
            })
        })
    },
    foreMore:function () {
        $('.for-more').on('click',function () {
            $(this).find('.i-more').toggleClass('i-more-up');
            $(this).prev().find('.other-item-list').slideToggle('fast',function () {
            })
        })
    },

    dialog:function (opts) {
        var Dialog = function(opts){
            var defaults = {
                title: "弹出框",
                className: "",
                content: "内容",
                confirmText: "确定",
                cancelText: "关闭",
                confirm: null,
                cancel: null
            }
            opts = $.extend(defaults, opts);
            var id = new Date().getTime();
            var tpl = ''
                +'<div class="ui-dialog '+ opts.className +'" id="dialog-'+ id +'">'
                +	'<div class="ui-dialog-main">'
                +		'<div class="ui-dialog-hd">'+ opts.title +'</div>'
                +		'<div class="ui-dialog-bd">'+ opts.content +'</div>'
                +		'<div class="ui-dialog-ft aui-border-t">'
                +			'<button class="ui-dialog-btn ui-dialog-confirm">'+ opts.confirmText +'</button>'
                +			'<button class="ui-dialog-btn ui-dialog-cancel aui-border-l">'+ opts.cancelText +'</button>'
                +		'</div>'
                +	'</div>'
                +'</div>';
            $("body").append(tpl);
            this.opts = opts;
            this.dialog = $("#dialog-" + id);
            return this._init();
        }

        Dialog.prototype = {
            _init: function(){
                var _this = this;

                if(!this.opts.confirm && !this.opts.cancel){
                    this.dialog.find(".ui-dialog-cancel").remove();
                    this.opts.confirm = function(){};
                }else{
                    if(!this.opts.confirm){
                        this.dialog.find(".ui-dialog-confirm").remove();
                        this.opts.confirm = function(){};
                    }
                    if(!this.opts.cancel){
                        this.dialog.find(".ui-dialog-cancel").remove();
                        this.opts.cancel = function(){};
                    }
                }

                this.dialog.find(".ui-dialog-btn").on('click', function(e){
                    if($(this).hasClass("ui-dialog-confirm")){
                        if($.isFunction(_this.opts.confirm) && _this.opts.confirm() !== false){
                            _this.hide();
                        }
                    }
                    if($(this).hasClass("ui-dialog-cancel")){
                        if($.isFunction(_this.opts.cancel) && _this.opts.cancel() !== false){
                            _this.hide();
                        }
                    }
                    e.stopPropagation();
                });
                return this;
            },
            // 打开弹窗
            show: function(){
                this.dialog.addClass("ui-dialog-show");
                return this;
            },
            // 关闭弹窗
            hide: function(){
                this.dialog.removeClass("ui-dialog-show");
                return this;
            },
            // 设置标题
            title: function(title){
                this.dialog.find(".ui-dialog-hd").html(title);
                return this;
            },
            // 设置内容
            content: function(content){
                this.dialog.find(".ui-dialog-bd").html(content);
                return this;
            }
        }

        return new Dialog(opts);
    },
    tips:function (msg){
        var timer = null;
        var tpl = '<div class="ui-tips"><span></span></div>';
        var tip = $(".ui-tips span");
        var body = $("body");

        if(tip.length === 0){
            $("body").append(tpl);
            tip = $(".ui-tips span");
        }

        if(body.hasClass("ui-tips-show")){
            clearTimeout(timer);
        }

        tip.text(msg);

        if(body.hasClass("ui-tips-show")){
            clearTimeout(timer);
        }else{
            body.addClass("ui-tips-show");
        }

        autoHide();

        function autoHide(){
            timer = setTimeout(function(){
                body.removeClass("ui-tips-show");
            }, 2000);
        }
    },
    loadMore:function (url,state) {
        var page = 2;
        var isLoading = false;
        $(window).scroll(function(event) {
            if ($(window).height() + $(window).scrollTop() + 10 > $(document).height() && !isLoading) {
                // console.log(page)
                isLoading = true;
                $('.ui-loading').show();
                $('.load-more').hide();
                $.ajax({
                    type: "get",
                    dataType: "json",
                    data: {
                        page: page
                    },
                    url: url,
                    success: function(msg) {
                        // console.log(msg)
                        if (msg.length < 1) {

                            $('.load-more').html('没有更多了');
                            $('.load-more').show();
                            $('.ui-loading').hide();
                            $(window).off('scroll');
                            return;
                        }


                        $('.load-more').show();
                        $('.ui-loading').hide();

                        var itemStr = '';

                        for (var i = 0; i < msg.length; i++) {
                            var the_state_item = state > 1 ? 'quan-grey':'';
                            var the_state_used = state ==2 ? 'used':'';
                            if(msg[i].type==1){
                                if(msg[i].card_type==1){//消费券 quan1  onclick="javascript:location.href='welfaredetail?id='+msg[i].id+'">'
                                    var  tmpStr = ''
                                        +'<div class="item ub '+the_state_item+'" onclick="javascript:location.href=\'welfaredetail?id='+msg[i].id+'\'">'
                                        +'    <div class="quan-over '+the_state_used+' my-icon"></div>'
                                        +'    <div class="quan-header quan1 my-icon ub ub-ac ub-pc">'
                                        +'        &ensp;消 <br>'
                                        +'        &ensp;费 <br>'
                                        +'        &ensp;券'
                                        +'    </div>'
                                        +'    <div class="quan-left  my-icon">'
                                        +'        <div class="quan-left-box">'
                                        +'            <div class="name">'+msg[i].title+'</div>'
                                        +'            <div class="date">'+msg[i].start_at+' 至 '+msg[i].end_at+'</div>'
                                        +'            <div class="scale">'+msg[i].short_desc+'</div>'
                                        +'        </div>'
                                        +'    </div>'
                                        +'    <div class="quan-right my-icon">'
                                        +'        <div class="quan-right-box quan1 '+the_state_item+'">'
                                        +'            <div class="price"><i>￥</i><span>358</span></div>'
                                        +'            <div class="btn-detail">查看详情</div>'
                                        +'        </div>'
                                        +'    </div>'
                                        +'</div>';
                                }else{//福利券 quan3
                                    var  tmpStr = ''
                                        +'<div class="item ub  '+the_state_item+'" onclick="javascript:location.href=\'welfaredetail?id='+msg[i].id+'\'">'
                                        +'    <div class="quan-over '+the_state_used+' my-icon"></div>'
                                        +'    <div class="quan-header quan3 my-icon ub ub-ac ub-pc">'
                                        +'        &ensp;福 <br>'
                                        +'        &ensp;利 <br>'
                                        +'        &ensp;包'
                                        +'    </div>'
                                        +'    <div class="quan-left quan-fu my-icon">'
                                        +'        <div class="quan-left-box">'
                                        +'            <div class="name">'+msg[i].title+'</div>'
                                        +'            <div class="date">'+msg[i].start_at+' 至 '+msg[i].end_at+'</div>'
                                        +'            <div class="scale">'+msg[i].short_desc+'</div>'
                                        +'        </div>'
                                        +'    </div>'
                                        +'    <div class="quan-right my-icon">'
                                        +'        <div class="quan-right-box quan3 '+the_state_item+'">'
                                        +'            <div class="price"><i>￥</i><span>358</span></div>'
                                        +'            <div class="btn-detail">查看详情</div>'
                                        +'        </div>'
                                        +'    </div>'
                                        +'</div>';
                                }
                            }else{//消费包 quan2
                                var  tmpStr = ''
                                    +'<div class="item ub  '+the_state_item+'" onclick="javascript:location.href=\'welfaredetail?id='+msg[i].id+'\'">'
                                    +'    <div class="quan-over '+the_state_used+' my-icon"></div>'
                                    +'    <div class="quan-header quan2 my-icon ub ub-ac ub-pc">'
                                    +'        &ensp;消 <br>'
                                    +'        &ensp;费 <br>'
                                    +'        &ensp;包'
                                    +'    </div>'
                                    +'    <div class="quan-left quan-bao my-icon">'
                                    +'        <div class="quan-left-box">'
                                    +'            <div class="name">'+msg[i].title+'</div>'
                                    +'            <div class="date">'+msg[i].start_at+' 至 '+msg[i].end_at+'</div>'
                                    +'            <div class="scale">'+msg[i].short_desc+'</div>'
                                    +'        </div>'
                                    +'    </div>'
                                    +'    <div class="quan-right my-icon">'
                                    +'        <div class="quan-right-box quan2 '+the_state_item+'">'
                                    +'            <div class="price"><i>￥</i><span>358</span></div>'
                                    +'            <div class="btn-detail">查看详情</div>'
                                    +'        </div>'
                                    +'    </div>'
                                    +'</div>';
                            }

                            itemStr += tmpStr;
                        }

                        $('#welfare-list').append(itemStr);
                        page++;
                        isLoading = false;
                    }
                });
            };

        });
    },//loadMore
    loadMoreGoods:function (url) {
        var page = 2;
        var isLoading = false;
        var arr_scroll_top = [];

        $(window).on('scroll.loadMoreGoods',function () {
            //向下滚动的时候
            if ($(window).height() + $(window).scrollTop() + 10 > $(document).height()&&!isLoading) {
                // console.log(page)
                isLoading = true;
                $('.ui-loading').show();
                $('.load-more').hide();
                $.ajax({
                    type: "get",
                    dataType: "json",
                    data: {
                        page: page
                    },
                    url: url,
                    success: function(msg) {
                        //console.log(msg.data)
                        if (msg.data.length < 1) {
                            $('.load-more').html('没有更多了');
                            $('.load-more').show();
                            $('.ui-loading').hide();
                            // $(window).off('scroll');
                            return;
                        }


                        $('.load-more').show();
                        $('.ui-loading').hide();

                        var itemStr = '';

                        for (var i = 0; i < msg.data.length; i++) {
                            var prepayStr = msg.data[i].is_prepay?"<em>预付</em>":"";
                            var tmpStr = ''
                                +'<div class="look-other-item aui-border-b">'
                                +'    <a href="'+msg.data[i].url+'">'
                                +'        <img src="'+msg.data[i].cover_img+'" alt="">'
                                +'        <div class="text">'
                                +'            <div class="title">'+msg.data[i].title+'</div>'
                                +'            <div class="old-price"><s> ¥ '+msg.data[i].original_price+' </s></div>'
                                +'            <div class="price"><span class="em">¥ '+msg.data[i].price+'</span>'+prepayStr+'<span class="look">去看看</span></div>'
                                +'        </div>'
                                +'    </a>'
                                +'</div>';

                            itemStr += tmpStr;
                        }

                        $('.look-other').append(itemStr);

                        //记录滚动条记录
                        arr_scroll_top.push($(window).scrollTop());
                        console.log(arr_scroll_top)
                        $('#page-num').html(page);
                        $('#page-total').html(msg.pageCount);
                        page++;
                        isLoading = false;
                    }
                });
            };

            //向上滚动到时候
            if(arr_scroll_top.length){
                for (var i = arr_scroll_top.length - 1; i >= 0; i--) {
                    if ($(window).scrollTop()<arr_scroll_top[i]){
                        $('#page-num').html(i+1);
                    }
                    if ($(window).height() + $(window).scrollTop() + 10 > $(document).height()){
                        $('#page-num').html(arr_scroll_top.length+1);
                    }
                }
            }

        })
    },//loadMore
    load_category:function (url) {
        $(window).off('scroll.loadMoreGoods');
        $('.goods-list').removeClass('pt110');
        // console.log(url);
        var page = 1;
        var isLoading = false;
        // console.log(page)
        isLoading = true;
        $('.ui-loading-top').show();
        $('.load-more').hide();
        $.ajax({
            type: "get",
            dataType: "json",
            data: {
                page: page
            },
            url: url,
            success: function(msg) {
                // console.log('length:',msg.data.length)
                $('.look-other').html('');//清空当前分类下的数据，重新填写
                if (msg.data.length < 1) {
                    $('.load-more').hide();
                    $('.no-result').show();
                    $('.ui-loading-top').hide();

                    // $('.load-more').html('没有更多了');
                    // $('.load-more').show();
                    // $('.ui-loading').hide();
                    // $(window).off('scroll');
                    return;
                }

                $('.no-result').hide()
                $('.load-more').show();
                $('.ui-loading-top').hide();

                var itemStr = '';

                for (var i = 0; i < msg.data.length; i++) {
                    var prepayStr = msg.data[i].is_prepay?"<em>预付</em>":"";
                    var tmpStr = ''
                        +'<div class="look-other-item aui-border-b">'
                        +'    <a href="'+msg.data[i].url+'">'
                        +'        <img src="'+msg.data[i].cover_img+'" alt="">'
                        +'        <div class="text">'
                        +'            <div class="title">'+msg.data[i].title+'</div>'
                        +'            <div class="old-price"><s> ¥ '+msg.data[i].original_price+' </s></div>'
                        +'            <div class="price"><span class="em">¥ '+msg.data[i].price+'</span>'+prepayStr+'<span class="look">去看看</span></div>'
                        +'        </div>'
                        +'    </a>'
                        +'</div>';

                    itemStr += tmpStr;
                }

                $('.load-more').hide();
                $('.look-other').append(itemStr);
                page++;
                isLoading = false;
            }
        });
    },
    ////////////
    validateWelfare:function (url,wid) {
        $.post(url,{id:wid}, function(data) {
            //console.log(data);
            if(data.code == 0){
                obj.tips(data.msg);
                location.reload();
            }else{
                obj.tips(data.msg);
            }

        });
    },//////////
    getWelfare:function (url,wid) {
        $.post(url,{id:wid},function (data) {
            // console.log(data);
            obj.tips(data.msg);
            setTimeout(function(){
                if(data.code == 0){
                    location.href='/wap/user/welfaredetail?success=1&id='+data.id;
                }else if(data.code == -6){
                    location.href=data.url;
                }else {}
            },300);
        })
    },//领券

    fixedNav:function () {
        var dis =  $('#fix-nav').position().top;
        var timer = null;
        //var hei =  $('.text-nav').outerHeight(true);
        // console.log(hei)
        function check () {
            if ( $(window).scrollTop() > dis ){
                $('#fix-nav').addClass('fixedNav');
                $('.goods-list').addClass('pt110');
                //$('.goods-list').css({'padding-top':hei});
            }else{
                $('#fix-nav').removeClass('fixedNav');
                $('.goods-list').removeClass('pt110');
                // $('.goods-list').css({'padding-top':0});
            }
        };

        if(obj.isMobile.iOS()){
            $(window).on('touchstart touchmove mousewheel touchcancel gesturestart gestureend gesturechange orientationchange',function () {
                check();
            });

            $(window).on('touchend',function () {
                setTimeout(check,30);
            });
        }

        $(window).on('scroll.fixedNav',function () {
            check();
        })


    },
    
    toTop:function () {
        $(window).scroll(function(event){
            if($(window).scrollTop()>1000){
                $('.go-to-top').show();
            }else{
                $('.go-to-top').hide();
            }
        })
        $('.icon-toTop').click(function () {
            $('body').animate({scrollTop: '0px'}, 500);
        })
        
    },

    goTop:function (acceleration, time) {
        acceleration = acceleration || 0.1;
        time = time || 16;
        var x1 = 0;
        var y1 = 0;
        var x2 = 0;
        var y2 = 0;
        var x3 = 0;
        var y3 = 0;
        if (document.documentElement) {
            x1 = document.documentElement.scrollLeft || 0;
            y1 = document.documentElement.scrollTop || 0;
        }
        if (document.body) {
            x2 = document.body.scrollLeft || 0;
            y2 = document.body.scrollTop || 0;
        }
        var x3 = window.scrollX || 0;
        var y3 = window.scrollY || 0;
        // 滚动条到页面顶部的水平距离
        var x = Math.max(x1, Math.max(x2, x3));
        // 滚动条到页面顶部的垂直距离
        var y = Math.max(y1, Math.max(y2, y3));
        // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
        var speed = 1 + acceleration;
        window.scrollTo(Math.floor(x / speed), Math.floor(y / speed));
        // 如果距离不为零, 继续调用迭代本函数
        if (x > 0 || y > 0) {
            var invokeFunction = "goTop(" + acceleration + ", " + time + ")";
            window.setTimeout(invokeFunction, time);
        }
    },

    // js版
    isMobile : {
        Android: function() {
            return /Android/i.test(navigator.userAgent);
        },
        BlackBerry: function() {
            return /BlackBerry/i.test(navigator.userAgent);
        },
        iOS: function() {
            return /iPhone|iPad|iPod/i.test(navigator.userAgent);
        },
        Windows: function() {
            return /IEMobile/i.test(navigator.userAgent);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
        }
    },

}