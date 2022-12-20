
;(function($, window, document,undefined) {
    //定义Slide的构造函数
    var Slide = function(ele, opt) {
        this.$element = ele,
        this.defaults = {
        	mode : 'pop',	//弹出式pop，固定fixed
            explain : '向右滑动完成验证',
			imgUrl:'/scrm-api/component/verifyCode/',
	        actionName : ['getVerifyBaseImg?type=IMAGE_LOGIN', 'getVerifyNoniusImg?type=IMAGE_LOGIN'],
	        imgSize : {
	        	width: '300px',
	        	height: '150px',
	        },
	        blockSize : {
	        	width: '64px',
	        	height: '64px',
	        },
	        barSize : {
	        	width : '100%',
	        	height : '40px',
	        },
            ready : function(){},
        	success : function(){},
            error : function(){}
            
        },
        this.options = $.extend({}, this.defaults, opt)
    };
    
    
    //定义Slide的方法
    Slide.prototype = {
        
        init: function() {
        	var _this = this;
        	
        	//加载页面
        	this.loadDom();
        	this.options.ready();
        	
        	this.$element[0].onselectstart = document.body.ondrag = function(){ 
				return false; 
			};
        	
        	if(this.options.mode == 'pop')	{
        		this.$element.on('mouseover', function(e){
        			_this.showImg();
	        	});
	        	
	        	this.$element.on('mouseout', function(e){
	        		_this.hideImg();
	        	});
	        	
	        	
	        	this.htmlDoms.out_panel.on('mouseover', function(e){
	        		_this.showImg();
	        	});
	        	
	        	this.htmlDoms.out_panel.on('mouseout', function(e){
	        		_this.hideImg();
	        	});
        	}
        	
        	//按下
        	this.htmlDoms.move_block.on('touchstart', function(e) {
        		_this.start(e);
        	});
        	
        	this.htmlDoms.move_block.on('mousedown', function(e) {
        		_this.start(e);
        	});
        	
        	//拖动
            window.addEventListener("touchmove", function(e) {
            	_this.move(e);
            });
            window.addEventListener("mousemove", function(e) {
				
            	_this.move(e);
            });
            
            //鼠标松开
            window.addEventListener("touchend", function() {
            	_this.end();
            });
            window.addEventListener("mouseup", function() {
            	_this.end();
            });
            
            //刷新
            _this.$element.find('.verify-refresh').on('click', function() {
            	_this.refresh();
            });
        },
        
        //初始化加载
        loadDom : function() {
        	this.img_rand = Math.floor(Math.random() * this.options.actionName.length);			//随机的背景图片
        	
        	var panelHtml = '';
        	var tmpHtml = '';
        	//图片滑动
        	panelHtml += '<div class="verify-img-out"><div class="verify-img-panel"><div  class="verify-refresh"><i class="iconfont icon-refresh"></i></div></div></div>';
        	tmpHtml = '<div  class="verify-sub-block"></div>';
        	
        	panelHtml += '<div class="verify-bar-area"><span  class="verify-msg">'+this.options.explain+'</span><div class="verify-left-bar"><span  class="verify-msg"></span><div  class="verify-move-block"><i  class="verify-icon iconfont icon-right"></i>'+tmpHtml+'</div></div></div>';
        	this.$element.append(panelHtml);
        	
        	this.htmlDoms = {
        		sub_block : this.$element.find('.verify-sub-block'),
        		out_panel : this.$element.find('.verify-img-out'),
        		img_panel : this.$element.find('.verify-img-panel'),
        		bar_area : this.$element.find('.verify-bar-area'),
        		move_block : this.$element.find('.verify-move-block'),
        		left_bar : this.$element.find('.verify-left-bar'),
        		msg : this.$element.find('.verify-msg'),
        		icon : this.$element.find('.verify-icon'),
        		refresh :this.$element.find('.verify-refresh')
        	};
        	
        	this.status = false;	//鼠标状态
        	this.isEnd = false;		//是够验证完成
        	this.setSize = this.resetSize(this);	//重新设置宽度高度
        	
        	this.$element.css('position', 'relative');
        	if(this.options.mode == 'pop') {
        		this.htmlDoms.out_panel.css({'display': 'none', 'position': 'absolute', 'bottom': '42px'});
        		this.htmlDoms.sub_block.css({'display': 'none'});
        	}else {
        		this.htmlDoms.out_panel.css({'position': 'relative'});
        	}
        	
        	//this.htmlDoms.gap.css({'width': this.options.blockSize.width, 'height': this.options.blockSize.height});
        	this.htmlDoms.sub_block.css({'width': this.options.blockSize.width, 'height': this.options.blockSize.height});
        	this.htmlDoms.out_panel.css('height', parseInt(this.setSize.img_height) + 'px');
        	this.htmlDoms.img_panel.css({'width': this.setSize.img_width, 'height': this.setSize.img_height, 'background': 'url(' + this.options.imgUrl + this.options.actionName[0]+')', 'background-size' : this.setSize.img_width + ' '+ this.setSize.img_height});
        	this.htmlDoms.bar_area.css({'width': this.setSize.bar_width, 'height': this.options.barSize.height, 'line-height':this.options.barSize.height});
        	this.htmlDoms.move_block.css({'width': this.options.barSize.height, 'height': this.options.barSize.height});
        	this.htmlDoms.left_bar.css({'width': this.options.barSize.height, 'height': this.options.barSize.height});
        	
        	this.getTopValue();
        },
        
        //鼠标按下
        start: function(e) {
        	if(this.isEnd == false) {
	        	this.htmlDoms.msg.text('');
	        	this.htmlDoms.move_block.css('background-color', '#337ab7');
	        	this.htmlDoms.left_bar.css('border-color', '#337AB7');
	        	this.htmlDoms.icon.css('color', '#fff');
	        	e.stopPropagation();
	        	this.status = true;
        	}
        },
        
        //鼠标移动
        move: function(e) {
        	if(this.status && this.isEnd == false) {
				if(this.options.mode == 'pop')	{
        			this.showImg();
				}
        		
	            if(!e.touches) {    //兼容移动端
	                var x = e.clientX;
	            }else {     //兼容PC端
	                var x = e.touches[0].pageX;
	            }
	            var bar_area_left = Slide.prototype.getLeft(this.htmlDoms.bar_area[0]); 
	            var move_block_left = x - bar_area_left; //小方块相对于父元素的left值
	            //图片滑动
	            if(move_block_left >= this.htmlDoms.bar_area[0].offsetWidth - parseInt(parseInt(this.options.blockSize.width)/2) - 2) {
	            	move_block_left = this.htmlDoms.bar_area[0].offsetWidth - parseInt(parseInt(this.options.blockSize.width)/2) - 2;
	            }
	            
	            if(move_block_left <= 0) {
            		move_block_left = parseInt(parseInt(this.options.blockSize.width)/2);
            	}
	            var left_value = move_block_left-parseInt(parseInt(this.options.blockSize.width)/2);
	            //防止滑块向左滑出验证图片
	            if(left_value < 0){
	            	left_value = 0;
	            }
	            //拖动后小方块的left值
	            this.htmlDoms.move_block.css('left', left_value + "px");
	            this.htmlDoms.left_bar.css('width', left_value + "px");
	        }
        },
        
        //鼠标松开
        end: function() {
        	
        	var _this = this;
        	
        	//判断是否重合
        	if(this.status  && this.isEnd == false) {
        		
        		var position = parseInt(this.htmlDoms.move_block.css('left'));
        		$.ajax({
        			type:'get',
        			cache: false,
        			url: '/scrm-api/component/verifyCode/checkVerifyImage?position=' + position + '&type=IMAGE_LOGIN',
        			timeout: 30000,
        			contentType: 'application/json'
        		}).then(function(data) {
        			if(data.valid) {
        				_this.htmlDoms.move_block.css('background-color', '#5cb85c');
        				_this.htmlDoms.left_bar.css({'border-color': '#5cb85c', 'background-color': '#fff'});
        				_this.htmlDoms.icon.css('color', '#fff');
        				_this.htmlDoms.icon.removeClass('icon-right');
        				_this.htmlDoms.icon.addClass('icon-check');
        				_this.htmlDoms.refresh.hide();
        				_this.isEnd = true;
        				_this.options.success(_this);
        				//如果是pop模式，验证成功隐藏图片
        				if(_this.options.mode == 'pop')	{
        					_this.hideImg();
        				}
        			} else {
        				_this.htmlDoms.move_block.css('background-color', '#d9534f');
        				_this.htmlDoms.left_bar.css('border-color', '#d9534f');
        				_this.htmlDoms.icon.css('color', '#fff');
        				_this.htmlDoms.icon.removeClass('icon-right');
        				_this.htmlDoms.icon.addClass('icon-close');
        				
        				
        				setTimeout(function () { 
        					_this.refresh();
        				}, 400);
        				
        				_this.options.error(_this);
        			}
        			
        		}, function(data) {
        			
        		});
        		
	            this.status = false;
        	}
        },
        
        //弹出式
        showImg : function() {
        	this.htmlDoms.out_panel.css({'display': 'block'});
        	this.htmlDoms.sub_block.css({'display': 'block'});
        },
        
        //固定式
        hideImg : function() {
        	this.htmlDoms.out_panel.css({'display': 'none'});
        	this.htmlDoms.sub_block.css({'display': 'none'});
        },
        
        
        resetSize : function(obj) {
        	var img_width,img_height,bar_width,bar_height;	//图片的宽度、高度，移动条的宽度、高度
        	var parentWidth = obj.$element.parent().width() || $(window).width();
        	var parentHeight = obj.$element.parent().height() || $(window).height();
        	
       		if(obj.options.imgSize.width.indexOf('%')!= -1){
        		img_width = parseInt(obj.options.imgSize.width)/100 * parentWidth + 'px';
		　　}else {
				img_width = obj.options.imgSize.width;
			}
		
			if(obj.options.imgSize.height.indexOf('%')!= -1){
        		img_height = parseInt(obj.options.imgSize.height)/100 * parentHeight + 'px';
		　　}else {
				img_height = obj.options.imgSize.height;
			}
		
			if(obj.options.barSize.width.indexOf('%')!= -1){
        		bar_width = parseInt(obj.options.barSize.width)/100 * parentWidth + 'px';
		　　}else {
				bar_width = obj.options.barSize.width;
			}
		
			if(obj.options.barSize.height.indexOf('%')!= -1){
        		bar_height = parseInt(obj.options.barSize.height)/100 * parentHeight + 'px';
		　　}else {
				bar_height = obj.options.barSize.height;
			}
		
			return {img_width : img_width, img_height : img_height, bar_width : bar_width, bar_height : bar_height};
       	},
        
        //获取游标图片TOP值
        getTopValue: function() {
        	var top = 0;
        	top = this.createVerifyImage();
          	this.$element.find('.verify-sub-block').css({'top':'-'+(parseInt(this.setSize.img_height) - top)+'px', 'background-image': 'url('+ this.options.imgUrl + this.options.actionName[1]+')'});
        },
        
        //刷新
        refresh: function() {
			
        	this.htmlDoms.refresh.show();
        	this.$element.find('.verify-msg:eq(1)').text('');
        	this.$element.find('.verify-msg:eq(1)').css('color', '#000');
        	this.htmlDoms.move_block.animate({'left':'0px'}, 'fast');
			this.htmlDoms.left_bar.animate({'width': '40px'}, 'fast');
			this.htmlDoms.left_bar.css({'border-color': '#ddd'});
			
			this.htmlDoms.move_block.css('background-color', '#fff');
			this.htmlDoms.icon.css('color', '#000');
			this.htmlDoms.icon.removeClass('icon-close');
			this.htmlDoms.icon.addClass('icon-right');
			this.$element.find('.verify-msg:eq(0)').text(this.options.explain);
        	
        	this.getTopValue();
        	var action_0 = this.options.actionName[0] + '&t='+new Date().getTime();
        	var action_1 = this.options.actionName[1] + '&t='+new Date().getTime();
			this.$element.find('.verify-img-panel').css({'background': 'url('+ this.options.imgUrl +action_0+')'});
            this.$element.find('.verify-sub-block').css({'background-image': 'url('+ this.options.imgUrl +action_1+')'});
			
			
        	this.isEnd = false;
        },
        
        //获取left值
        getLeft: function(node) {
			var left = $(node).offset().left; 
            return left;
        },
        //生成验证码图片
    	createVerifyImage: function() {
    		var top = 0;
        	$.ajax({
    		 	url: '/scrm-api/component/verifyCode/createVerifyImage?type=IMAGE_LOGIN',
    		 	async: false, 
    		 	cache: false,
    		 	type:'get',
   			  	timeout: 30000,
   			  	contentType: 'application/json'
    	    }).then(function(data){
    	    	top = data.Y;
    	    }, function(data) {
    	    	toastr.error("获取验证码出错，请刷新重试", "错误");
    	    });
        	return top;
        }
    };

    //在插件中使用slideVerify对象
    $.fn.slideVerify = function(options, callbacks) {
        var slide = new Slide(this, options);
        slide.init();
        return slide;
    };

   
})(jQuery, window, document);
