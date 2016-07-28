<?php
/* @var $this yii\web\View */
use yii\helpers\Url;
$this->title = '绑手机 拿福利';
?>
<div class="wrapper">
    <header>
        <div class="list">
            <div class="ub item ub-ac">
                <div class="text ub-f1">
                    <div class="title">更便捷</div>
                    <div class="words">使用手机登录，免去忘记用户名的烦恼</div>
                </div>
                <div class="img">
                    <img src="/ioo-reward-bind/images/wap/i1.png" alt="">
                </div>
            </div>
            <div class="ub item ub-ac">
                <div class="text ub-f1">
                    <div class="title">更安全</div>
                    <div class="words">使用手机号，可以快速找回密码</div>
                </div>
                <div class="img">
                    <img src="/ioo-reward-bind/images/wap/i2.png" alt="">
                </div>
            </div>
            <div class="ub item ub-ac">
                <div class="text ub-f1">
                    <div class="title">更好玩</div>
                    <div class="words">绑定后可参与 [小红花兑换奖品]</div>
                </div>
                <div class="img">
                    <img src="/ioo-reward-bind/images/wap/i3.png" alt="">
                </div>
            </div>
        </div>
    </header>
    <div class="content">
        <?php if($data['is_login']):?>
            <h1>恭喜！您拥有参与资格</h1>
            <form action="">
                <div class="row ub ub-ac">
                    <div class="ub-f1"><input class="" type="tel" placeholder="请输入手机号" id="phone"></div>
                    <div class=""><input class="" type="button"  value="获取验证码" id="getMsg"/></div>
                </div>
                <div class="row">
                    <input type="tel" placeholder="请输入短信验证码" id="msgCode">
                </div>
                <div class="btn m2" id="btnSubmit">提交绑定</div>
            </form>
        <?php else:?>
            <div class="btn m1" onclick="window.location.href = '<?=Url::to(['/user/login','referrer'=>Url::to(['/user/reward-bind'],true)],true)?>'">
                马上登录，参与绑定
            </div>
        <?php endif;?>

        <div class="tips-success" style="display: none">
            <img src="/ioo-reward-bind/images/wap/ok.png" alt="">
            <div class="title">恭喜！您已绑定</div>
            <div class="btn b1 m2">返回操作</div>
        </div>

        <ul class="list clearfix">
            <li>2016年7月前注册的<em>未绑定</em>的受邀老用户</li>
            <li>符合条件用户首次在该页面绑定手机，系统自动赠送<em>5朵</em>小红花</li>
            <li>若当前手机不是您自己的，换绑我们将送你<em>2朵</em>诚意小红花</li>
            <li>该小红花可用于兑换、拍卖专场、抵价专场等活动</li>
            <li>符合条件的受邀用户仅可获取一次绑定奖励</li>
            <li>本次活动的最终解释权归惠州西子湖畔网络有限公司</li>
        </ul>
    </div>
</div>
<script>
    $(function () {
        //提交
        $('#btnSubmit').on('click',function () {
            if(!obj.reg.phone.test($('#phone').val())){
                obj.tips('手机号码格式不正确');
                $('#phone').focus();
                return false;
            }
            if(obj.reg.space.test($('#msgCode').val())){
                obj.tips('请输入验证码');
                $('#msgCode').focus().val('');
                return false;
            }
        });
        
        //获取验证码
        var bBtn = true;
        $('#getMsg').on('click',function () {
            if(!obj.reg.phone.test($('#phone').val())){
                obj.tips('手机号码格式不正确');
                $('#phone').focus();
                return false;
            };
            var sec = 60;
            var oldVal = $('#getMsg').val();
            if(bBtn){
                bBtn = false;
                $('#getMsg').addClass('disabled');
                var timer = setInterval(function () {
                    sec--;
                    if(sec<0){
                        bBtn = true;
                        $('#getMsg').removeClass('disabled');
                        clearInterval(timer);
                        $('#getMsg').val(oldVal);
                    }else{
                        $('#getMsg').val(sec+'s');
                    }


                },1000)
            }
        })

    })
</script>