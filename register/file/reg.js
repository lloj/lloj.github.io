var vc;
var vcCheckStatus;
var checkphone = /^1[23456789]\d{9}$/;
var checkCodeStatus=-3;
var isSend=0;
// 表单验证
function check2(form) {
	var name = $('input[name="name"]').val().length;
	var phone = $('input[name="phone"]').val();
	var company = $('input[name="company"]').val().length;
	var code = $('input[name="code"]').val();
	var checkmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

	if (name <= 0) {
		tips("请输入用户名", '')
		$('input[name="name"]').focus();
		return false;
	}
	if (company <= 0) {
		tips("请输入密码", '')
		$('input[name="company"]').focus();
		return false;
	}
	if (phone.length <= 0) {
		tips("请输入手机号", '')
		$('input[name="phone"]').focus();
		return false;
	}
	if (checkphone.test(phone) == false) {
		tips("手机格式不正确", '')
		$('input[name="phone"]').focus();
		return false;
	}

	// console.log(a);
	// if(!a){
	// tips("验证码输入错误", '')
	// $('input[name="code"]').focus();
	// return false;
	// }

	return true;
}


function submit1(){
	if(check2()){
		var name = $('input[name="name"]').val();
		var phone = $('input[name="phone"]').val();
		var company = $('input[name="company"]').val();
		var code = $('input[name="code"]').val();
		var requesturl = $('input[name="requesturl"]').val();
		var firstURL = $('input[name="firstURL"]').val();
		var sourceURL=$('input[name="sourceURL"]').val();
		$.ajax({
			type : "post",
			url : './../leads/addLeads1',
			contentType : "application/json;charset=utf-8",
			data : JSON.stringify({
				phone : phone,
				name : name,
				company:company,
				code : code,
				requesturl : requesturl,
				firstURL : firstURL,
				sourceURL :sourceURL
			}),
			dataType : "json",
			success : function(message) {
				console.log(message);
				if (message == 0) {
					window.location.href ="./../leads/success.html";
				}else{
					window.location.href ="./../leads/fail.html";
				}
			}

		});
	}
}

// 验证码
var countdown = 60;
function getcode() {
	// 判断手机号，图形验证，都ok发送短信
	var phone = $('input[name="phone"]').val();
	if (phone.length <= 0) {
		tips1("请输入手机号码", "")
		$('input[name="phone"]').focus();
		return;
	}
	;
	if (checkphone.test(phone) == false) {
		tips1("手机格式不正确", "")
		$('input[name="phone"]').focus();
		return;
	}
	;
	if (vcCheckStatus) {
		 sendCode(phone);
	} else {
		tips("图形验证不正确", '')
		return;
	}

	var obj = $(".btn-getcode");
	settime(obj);
}

function sendCode(phone) {
	var type = 'IMAGE_LOGIN';
	$.ajax({
		type : "post",
		url : './../sms/sendCode',
		contentType : "application/json;charset=utf-8",
		data : JSON.stringify({
			phone : phone,
			type : type
		}),
		dataType : "json",
		success : function(message) {
			console.log(message);
			if (message == -2) {
				tips1("验证码申请超限，请通过热线电话咨询！", "")
			}
			if(message==-4){
				tips1("发送过于频繁，请超过1分钟后再次尝试！", "")
			}
			isSend=1;
		}

	});
}

function checkCode() {
	var code = $('input[name="code"]').val();
	var phone = $('input[name="phone"]').val();
	if (code.length == 6) {
		$.ajax({
			type : "post",
			url : './../sms/checkVerifyCode',
			contentType : "application/json;charset=utf-8",
			async : true,
			data : JSON.stringify({
				phone : phone,
				code : code
			}),
			dataType : "json",
			success : function(message) {
				console.log(message);
				checkCodeStatus = message;
			}

		});
	}
}

function resetVerify(){
	if(isSend==1){
		checkCodeStatus = -2;
		tips1("请重新进行滑块验证", "")
	}
};


function settime(obj) { // 发送验证码倒计时
	if (countdown == 0) {
		countdown = 60;
		obj.html("获取验证码")
		// 刷新图形验证码
		vc.refresh();
		vcCheckStatus = false;
		isSend=0;
		checkCodeStatus=-3;
		return;
	} else {
		obj.html("重新获取(" + countdown + ")").attr("disabled", "disabled")
		countdown--;
	}
	setTimeout(function() {
		settime(obj)
	}, 1000)
}

/* 提示消息 */
function tips(title, url) {
	$(".tipsBox>span").html(title)
	$(".tipsBox").fadeIn();
	setTimeout(function() {
		$(".tipsBox").fadeOut();// 渐出
	}, 2000);
	if (url != "") {// URL跳转
		setTimeout(function() {
			window.location.href = url
		}, 2500);
	}
}

function tips1(title) {
	$(".tipsBox>span").html(title)
	$(".tipsBox").fadeIn();
	setTimeout(function() {
		$(".tipsBox").fadeOut();// 渐出
	}, 2000);
}

$(function() {
	vc = $('#verifyCodeId').slideVerify({
		ready : function() {
			vcCheckStatus = false;
		},
		success : function() {
			$('#vcodeButton').removeAttr("disabled");
			vcCheckStatus = true;
		},
		error : function() {
			// alert('验证失败！');
		}

	})
});