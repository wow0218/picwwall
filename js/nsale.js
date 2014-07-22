// JavaScript Document

var $msie = $.browser.msie;
var $msiev=parseFloat($.browser.version)<7 ? true:false;
var $ie6=$msie && $msiev;

function NSale(){
	var _self=this;
	var $win=$(window),$doc=$(document);
	var pageWidth=[],globleScale=1;
	var coverFlow=null;
	var beWheel=false;
	
	function mainWheelHandler(e, delta, deltaX, deltaY,isKey){
		if(!beWheel){
			beWheel=true;
			var $this=$(".page.cur"),_c=$(".page").index($this);
			//var _l=$("#main").offset().left,_ww=$(window).width(),_sW=$(this).outerWidth();
			if(delta>0){
				//if(_c==1){$f.beWheel=false;return;}//禁止向上滚回首屏
				mainPageChange.call(this,_c,_c-1);
			}else{
				//if(_c==0){$f.beWheel=false;return;}//首屏禁止向下滚动
				mainPageChange.call(this,_c,_c+1);
			}
			setTimeout(function(){
				beWheel=false;
			},500);
		}
		return false;
	}
	function mainPageChange(c,t){
		if(c!=t){
			var _h=$win.height(),_w=$win.width();
			_h=_h>500?_h:500;
			_w=_w>1000?_w:1000;
			var $this=$(this),$page=$(".page"),_l=$page.size(),$nav=$(".navlist");
			var befang=c<t?1:-1;
			t<0?(t=_l-1,befang=-1):(t>=_l?(t=0,befang=1):(t=t));
			$this.trigger("pageOut",befang);
			var cx1=-(pageWidth[c]-_w)/2,
				cx2=-1.5*pageWidth[c]+_w*0.5,
				cx3=(_w+pageWidth[c])/2,
				tx1=-(pageWidth[t]-_w)/2,
				tx2=-1.5*pageWidth[t]+_w*0.5,
				tx3=(_w+pageWidth[t])/2;
			$this.stop(false,true).css({"left":cx1,"display":"block"}).animate({"left":befang>0?(cx2):(cx3)},500,function(){
				$this.css({"display":"none"});
			});
			$page.eq(t).stop(false,true).css({"left":befang>0?cx3:tx2,"display":"block"}).animate({"left":tx1},500,function(){
				if($page.eq(t).hasClass("nosoon")){
					$page.eq(t).trigger("pageIn",befang);
				}
			});
			$this.removeClass("cur");
			$page.eq(t).addClass("cur");
		}
		navStatueChange(t);
	}
	function navClickHandle(e){
		if($(this).hasClass("cur")){return;}
		var index=$(".navlist").index(this);
		var c=$(".page").index($(".page.cur"));
		mainPageChange.call($(".page.cur").get(0),c,index);
	};
	function navStatueChange(index){
		var $nav=$(".navlist");
		$nav.removeClass("cur").eq(index).addClass("cur");
		
		//LOGO切换 及导航条位置
		if(index==0){
			//$("#logo1").fadeIn(200);
			$("#logo2").fadeOut(200);
			//$("#nav_wrapper").stop().animate({"margin-left":-540},300);
		}else{
			$("#logo2").fadeIn(200);
			//$("#logo1").fadeOut(200);
			//$("#nav_wrapper").stop().animate({"margin-left":-280},300);
		}
		
	};
	//Flash 播放
	function shFlashObj(id, data, oWidth, oHeight, flashvals,beFullScreen) {
        var B = "";
        if ($.browser.msie) B = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0\" ";
        else B = "<object type=\"application/x-shockwave-flash\" data=\"" + data + "\" ";
        B += " ID=\"" + id + "\" allownetworking=\"all\" loop=\"true\" allowFullScreen=\""+beFullScreen+"\" allowScriptAccess=\"always\" width=\"" + oWidth + "\" height=\"" + oHeight + "\">";
        if ($.browser.msie) B += "<PARAM NAME=movie VALUE=\"" + data + "\">";
        B += "<PARAM NAME=\"swLiveConnect\" VALUE=\"true\"><PARAM NAME=allowScriptAccess VALUE=\"always\"><PARAM NAME=allownetworking VALUE=\"all\"><PARAM NAME=quality VALUE=high><PARAM NAME=\"LOOP\" VALUE=\"true\"><PARAM NAME=\"wmode\" VALUE=\"transparent\"><PARAM NAME=\"allowFullScreen\" VALUE=\""+beFullScreen+"\"><PARAM NAME=\"flashVars\" VALUE=\"" + flashvals + "\"><PARAM NAME=SALIGN VALUE=T><PARAM NAME=MENU VALUE=FALSE></OBJECT>";
        return B;
    };
	var navpos=[0,200,400,600];
	function navMouseOverHandler(e){
		clearTimeout($("#navbar").attr("timeid"));
		var pos=$(this).position().left,_width=$(this).outerWidth(),index=$(".navlist").index(this);
		$("#navbar").stop().animate({left:navpos[index],width:_width},300,"easeOutBounce");
	}
	function navMouseOutHandler(e){
		$("#navbar").attr("timeid",setTimeout(function(){
			var $tar=$(".navlist.cur");
			if($tar.size()<=0){return;}
			var pos=$tar.position().left,_width=$tar.outerWidth(),index=$(".navlist").index($tar);
			$("#navbar").stop().animate({left:navpos[index],width:_width},300,"easeOutBounce");
		},200));
	}
	
	function resizeHandler(){
		var _h=$win.height(),_w=$win.width();
		_h=_h>600?_h:600;
		_w=_w>1280?_w:1280;
		var _scale=Math.max(_w/1980,_h/1050);
		globleScale=_scale;
		$("#main").css({"height":_h});
		//背景图片
		$(".pagebg").each(function(index, element) {
            var iw=1980,ih=1050;
			$(this).css({width:_scale*iw,height:_scale*ih,'margin-left':-_scale*iw/2});
			/*$(this).parents('.page').css({width:_scale*iw,'margin-left':-_scale*iw/2});*/
			//$(this).parents('.page').css({width:_scale*iw,left:-(_scale*iw-_w)/2});
			pageWidth[index]=_w;
        });

		//左右切换按钮 位置
		$(".prev").css({"left":_w>=1440?100:50});
		$(".next").css({"right":_w>=1440?100:50});

		//导航位置:
		$("#nav_wrapper").css({"top":_h<=660?10:(_h<=800?50:100)});

		//其他缩放项目
		var $msie8= $msie && parseFloat($.browser.version)< 9 ;

		$(".scaleitem").each(function(i,e){
			if($msie8){
				var thisWidth=parseInt($(this).attr("relw")),thisHeight=parseInt($(this).attr("relh"));
				var thisL=parseInt($(this).attr("relL")),thisT=parseInt($(this).attr("relT")),
					thisR=parseInt($(this).attr("relR")),thisB=parseInt($(this).attr("relB")),
					thisML=parseInt($(this).attr("relML")),thisMT=parseInt($(this).attr("relMT"));
				if(!!thisWidth){$(this).css({"width":thisWidth*globleScale});}
				if(!!thisHeight){$(this).css({"height":thisHeight*globleScale});}

				if(!!thisML){$(this).css({"margin-left":thisML*globleScale});}
				if(!!thisMT){$(this).css({"margin-top":thisMT*globleScale});}
				if(!!thisL){$(this).css({"left":thisL*globleScale});}
				if(!!thisT){$(this).css({"top":thisT*globleScale});}
				if(!!thisR){$(this).css({"right":thisR*globleScale});}
				if(!!thisB){$(this).css({"bottom":thisB*globleScale});}
			}else{
				$(this).css({scale:globleScale});
			}
		});
		
		//其他CSS设置
		var jsHeight=230/1980*_w;
		$(".countrywrapper").css({width:_w,height:jsHeight}).attr("aniH",jsHeight);
		$(".countrycover").css({height:jsHeight});

	};
	function scrollHandler(){
		
	};
	function ruleTxtToggle(){
		$(".rulestxt").toggle(300,function(){
			if($(this).hasClass("beclose")){
				$(this).removeClass("beclose");
				$(".btn_rule").fadeOut(200);
				$(".qiuyi").fadeIn(200);
			}else{
				$(this).addClass("beclose");
				$(".btn_rule").fadeIn(200);
				$(".qiuyi").fadeOut(200);
			}
		});
	};
	function cssInit(){
		if($msie && $msiev){
			$(".iepng").each(function(index, element) {
				$(this).attr("src",$(this).attr("src").replace(".png",".gif"));
			});
		}
		
	};
	
	function eventInit(){
		$win.on("resize",resizeHandler).trigger("resize");;
		$win.on("scroll",scrollHandler);
		//$("#main .page").on("mousewheel",mainWheelHandler);
		$(".navlist").bind("mouseenter",navMouseOverHandler).bind("mouseleave",navMouseOutHandler);
		$(".navlist").bind("click",navClickHandle);
		$(".prev").bind("click",function(e){
			var cur=$(".navlist").index($(".navlist.cur")),_l=$(".navlist").size();
			$(".navlist").eq(cur-1<0?_l-1:cur-1).trigger("mouseenter").trigger("click");
		});
		$(".next").bind("click",function(e){
			var cur=$(".navlist").index($(".navlist.cur")),_l=$(".navlist").size();
			$(".navlist").eq(cur+1>=_l?0:cur+1).trigger("mouseenter").trigger("click");
		});
		

		//游戏规则
		$(".btn_rule").bind("click",function(e){
			ruleTxtToggle();
		});
		$(".innerclose").bind("click",function(e){
			ruleTxtToggle();
		}).trigger("click");
		$(".btn_guojiaclose").bind("click",function(e){
			if($(this).hasClass("beclose")){ //执行开
				$(this).removeClass("beclose");
				var ah=$(".countrywrapper").attr("aniH");
				$(".countrywrapper").stop().animate({"height":ah},300);
			}else{//执行关
				$(this).addClass("beclose");
				$(".countrywrapper").stop().animate({"height":20},300);
				$(".rulestxt").hasClass("beclose") || ruleTxtToggle();
			}
		});

		
	};
	_self.Init=function(){
		cssInit();
		eventInit();
		return _self;
	};
	
}

