<?php
/* @var $this yii\web\View */

$this->title = '绑手机 拿福利';
use \yii\helpers\Url;
?>
<div class="header-full">
		<div class="header wrapper">
			<img src="/ioo-reward-bind/images/banner.png" alt="">
		</div>
	</div>
	<div class="wrapper">
		<div class="list">
			<ul class="clearfix">
				<li>
					<img src="/ioo-reward-bind/images/item-a.png" alt="">
					<p class="title title-a">更便捷</p>
					<p class="text">使用手机登录，免去忘记用户名的烦恼</p>
				</li>
				<li>
					<img src="/ioo-reward-bind/images/item-b.png" alt="">
					<p class="title title-b">更安全</p>
					<p class="text">使用手机号，可以快速找回密码</p>
				</li>
				<li>
					<img src="/ioo-reward-bind/images/item-c.png" alt="">
					<p class="title title-c">更好玩</p>
					<p class="text">绑定后可参与[小红花兑换奖品]</p>
				</li>
			</ul>
		</div>
	</div>
	<div class="content-area wrapper">
		<?php if($data['is_login']):?>
			<div class="form">
				<form action="">
					<img src="" alt="" id="base64Img">
					<h1>恭喜！您拥有参与资格</h1>
					<div class="row">
						<div class="verify" id="tips-phone">请输入正确的手机格式</div>
						<span>手机号：</span><input id="phone" type="text" placeholder="请输入您的手机号"><input id="send-code" type="button" value="发送验证码"/>
					</div>
					<div class="row">
						<div class="verify" id="tips-code">请输入验证码</div>
						<span>验证码：</span><input id="code" type="text">
					</div>
					<div class="row" style="margin-bottom:0">
						<div class="submit-btn active" id="btn-bind">
							绑定
						</div>
					</div>
				</form>
			</div>
		<?php else:?>
			<div class="btn-big" onclick="window.location.href = '<?=Url::to(['/user/login','referrer'=>Url::to(['/user/reward-bind'],true)],true)?>'">
				马上登录，参与绑定
			</div>
		<?php endif;?>

		<div class="tips" style="display: none;">
			<img src="/ioo-reward-bind/images/ok.png" >
			<div class="title">恭喜！您已绑定</div>
			<a href="###">返回操作</a>
		</div>
	</div>
	<div class="wrapper">
		<ul class="list-info clearfix">
			<li>2016年7月前注册的<span>未绑定</span>的受邀老用户</li>
			<li>符合条件用户首次在该页面绑定手机，系统自动赠送<span>5朵</span>小红花</li>
			<li>若当前手机不是您自己的，换绑我们将送你<span>2朵</span>诚意小红花</li>
			<li>该小红花可用于兑换、拍卖专场、抵价专场等活动</li>
			<li>符合条件的受邀用户仅可获取一次绑定奖励</li>
			<li>本次活动的最终解释权归惠州西子湖畔网络有限公司</li>
		</ul>
	</div>
<div class="footer">
      <?=$this->render('@view/layouts/footer') ?>
</div>

<script language="JavaScript">
	$(function () {

		var reg = {
			phone: /0?(13|14|15|17|18)[0-9]{9}/,
			space:/^\s*$/
		};
		var bBtn = true;
		var bBtn2 = true;
		var bBtn3 = true;
		var need_vcode = true;
		//提交
		$('#btn-bind').on('click',function () {
			if(!reg.phone.test($('#phone').val())){
				if(bBtn){
					bBtn = false;
					$('#tips-phone').show()
					setTimeout(function(){
						$('#tips-phone').hide();
						bBtn = true;
					},3000);
					$('#phone').focus();
				}
				return false;
			};

			if(reg.space.test($('#code').val())){
				if(bBtn2){
					bBtn2 = false;
					$('#tips-code').show()
					setTimeout(function(){
						$('#tips-code').hide();
						bBtn2 = true;
					},3000);
					$('#code').focus().val('');
				}
				return false;
			};
		})

		//更换验证码图片
		$('#base64Img').on('click',function () {
			send_vcode();
		})
		//发送验证码
		$('#send-code').on('click',function () {
			if(!reg.phone.test($('#phone').val())){

				if(bBtn){
					bBtn = false;
					$('#tips-phone').show()
					setTimeout(function(){
						$('#tips-phone').hide();
						bBtn = true;
					},3000);
					$('#phone').focus();
				}
				return false;
			};
			//请求验证码
			$.ajax({
						type: "post",
						dataType: "json",
						url: "<?=Url::to('/api/member/login-check');?>",
						data: {
							username: $('#phone').val(),
							u: $("#__jsInput").val()
						},
						success: function (data) {
							if (data.code == 200) {
								if(need_vcode){
									send_vcode();
								}else{
									send_code();
								}
							}else{
								//TODO:提示系统错误
							}
						}
					}
			);
			var sec = 60;
			var oldVal = $('#send-code').val();
			if(bBtn3){
				bBtn3 = false;

				var timer = setInterval(function () {
					sec--;
					if(sec<0){
						bBtn3 = true;
						clearInterval(timer);
						$('#send-code').val(oldVal);
					}else{
						$('#send-code').val(sec+'s 后重发');
					}

				},1000)
			}
		})
//////////////////////////////////////////////////////////////////////////////////////

		/*var need_vcode = true;
		$('#send-code').click(function(){
			var oNumber = /^0?1[3|4|5|7|8][0-9]\d{8}$/;
			if (!oNumber.test($('#phone').val())) {
				//TODO:手机号码格式错误
				return false;
			}

			$.ajax({
					type: "post",
					dataType: "json",
					url: "<?=Url::to('/api/member/login-check');?>",
					data: {
						username: $('#phone').val(),
						u: $("#__jsInput").val()
					},
					success: function (data) {
						if (data.code == 200) {
							if(need_vcode){
								send_vcode();
							}else{
								send_code();
							}
						}else{
							//TODO:提示系统错误
						}
					}
				}
			);
		});*/

		//弹出验证码
		function send_vcode(){
			$.getJSON('/api/safety/captcha',function(dt){
				//TODO:dt.img就是验证码的base64
				$('#base64Img').attr('src',dt.img);
			});
		}

		//验证弹出验证码
		function check_vcode(){
			//TODO: 弹出的验证码
			$.getJSON("<?=Url::to(['/api/safety/captcha-check'])?>",{code:'这里是验证码'},function(dt){
				if(dt.code == 200){
					need_vcode = false;
					send_code();
				}else{
					//TODO:失败重新获取重试
				}
			})
		}

		//发验证码步骤
		function send_code(){
			$.ajax({
				type: "post",
				dataType: "json",
				url: "<?=Url::to('/api/member/check-phone');?>",
				data: {
					type: "validate",
					phone: $('#phone').val()
				},
				success: function (res) {
					if (res.code == 200) {
						//TODO:提示已发送，然后倒计时
						return false;
					} else {
						//TODO: res.err是错误来的。提示下
						return false;
					}
				},
				error: function () {
					console.log('发送验证码错误');
				}
			});
		}

		//绑定逻辑
		function bind_phone(){
			$.ajax({
				type: "post",
				dataType: "json",
				url: "<?=Url::to('/api/member/check-code');?>",
				data: {
					phone: $('#phone').val(),
					code: $('#code').val()
				},
				success: function (res) {
					if (res.code == 200) {
						//直接提交
						$.ajax({
							type: "post",
							dataType: "json",
							url: "<?=Url::to('/api/member/bind-phone');?>",
							data: {
								code: $('#code').val(),
								is_reward:1
							},
							success: function (res) {
								if (res.code == 10004) {
									window.location.href = window.location.href
								} else if (res.code == 10020) {
									var arr = [];
									for (var i in res.data) {
										arr.push(res.data[i])
									}
									//TODO: arr[0]是错误信息
								} else if (res.code == 200) {
									//TODO:显示绑定成功
								} else {
									//TODO: 显示res.err里面的错误
								}
							}
						})
					} else {
						//TODO: 显示res.err里面的错误
					}
				}
			})
		}
	})
</script>