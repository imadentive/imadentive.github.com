/**
 * Created by Administrator on 2016/6/12.
 */
define(['jquery','swiper'],function () {
    return obj = {
        mySwiper:function () {
            new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                paginationClickable: true
            })
        },

        myScroll:function (id) {
            require(['iscroll'],function () {
                ge.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
                new iScroll(id,{hScrollbar:false, vScrollbar:false});
            })

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
                $('.text-nav-list').slideToggle('fast',function () {
                })
            })
        },
        foreMore:function () {
            $('.for-more').on('click',function () {
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
                    +		'<div class="ui-dialog-ft">'
                    +			'<button class="ui-dialog-btn ui-dialog-confirm">'+ opts.confirmText +'</button>'
                    +			'<button class="ui-dialog-btn ui-dialog-cancel">'+ opts.cancelText +'</button>'
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
                    console.log(page)
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
                            console.log(msg)
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
                                if(msg[i].card_type==1){
                                    if(msg[i].type==1){//消费券 quan1
                                        var  tmpStr = ''
                                            +'<div class="item ub '+the_state_item+'" data-href="welfaredetail?id='+msg[i].id+'">'
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
                                            +'            <div class="price">￥<span>358</span></div>'
                                            +'            <div class="btn-detail">查看详情</div>'
                                            +'        </div>'
                                            +'    </div>'
                                            +'</div>';
                                    }else{//福利券 quan3
                                        var  tmpStr = ''
                                            +'<div class="item ub  '+the_state_item+'" data-href="welfaredetail?id='+msg[i].id+'">'
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
                                            +'            <div class="price">￥<span>358</span></div>'
                                            +'            <div class="btn-detail">查看详情</div>'
                                            +'        </div>'
                                            +'    </div>'
                                            +'</div>';
                                    }
                                }else{//消费包 quan2
                                    var  tmpStr = ''
                                        +'<div class="item ub  '+the_state_item+'" data-href="welfaredetail?id='+msg[i].id+'">'
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
                                        +'            <div class="price">￥<span>358</span></div>'
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
            $(window).scroll(function(event) {

                if ($(window).height() + $(window).scrollTop() + 10 > $(document).height()&&!isLoading) {
                    console.log(page)
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
                            console.log(msg)
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

                                var tmpStr = ''
                                    +'<div class="look-other-item aui-border-b">'
                                    +'    <a href="'+msg[i].url+'">'
                                    +'        <img src="'+msg[i].cover_img+'" alt="">'
                                    +'        <div class="text">'
                                    +'            <div class="title">'+msg[i].title+'</div>'
                                    +'            <div class="old-price"><s> ¥ '+msg[i].original_price+' </s></div>'
                                    +'            <div class="price"><span class="em">¥ '+msg[i].price+'</span> <span class="look">去看看</span></div>'
                                    +'        </div>'
                                    +'    </a>'
                                    +'</div>';

                                itemStr += tmpStr;
                            }

                            $('.look-other').append(itemStr);
                            page++;
                            isLoading = false;
                        }
                    });
                };

            });
        },//loadMore
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
                //console.log(data);
                if(data.code == 0){
                    obj.tips(data.msg);
                    location.href='/wap/user/welfaredetail?success=1&id='+data.id;
                }else{
                    obj.tips(data.msg);
                }
            })
        },//领券
        myXizimui:function () {

        }

    }
});