import wx from 'jweixin-npm'
/**
 * 截取URL里面的参数
 * @param {Object} arg
 */
function getParamsFromUrl(arg = "") {
	let url = window.location.href;
	if (url.indexOf("?") <= 0) {
		return;
	}
  let paramsString = url.split("?")[1];
	//	if(paramsString) {
	//		let paramsObj = {};
	//		if(paramsString.indexOf('&amp;') > 0) {
	//			paramsString = paramsString.indexOf("#/") > -1 ? paramsString.replace(/#\//g, "&amp;") : paramsString;
	//			paramsString.split("&amp;").forEach(function(item, index) {
	//				paramsObj[item.split("=")[0]] = item.split("=")[1]
	//			});
	//		} else {
	//			paramsString = paramsString.indexOf("#/") > -1 ? paramsString.replace(/#\//g, "&") : paramsString;
	//			paramsString.split("&").forEach(function(item, index) {
	//				paramsObj[item.split("=")[0]] = item.split("=")[1]
	//			});
	//		}
	//		if(arg && paramsObj[arg]) {
	//			return paramsObj[arg]
	//		} else {
	//			// console.log("查询的参数不存在")
	//			return ""
	//		}
	//	} else {
	//		return
	//	}
	return getParamsFromLink(paramsString, arg);
}
/**
 * 获取页面链接前缀
 */
function getLocationUrlPrefix() {
	let url = window.location.href;
	if (url.indexOf("#/") <= 0) {

	} else {
		url = url.split("#/")[0];
	}
	if (url.indexOf("?") <= 0) {

	} else {
		url = url.split("?")[0];
	}
	return url;
}
/**获取IOS的系统*/
function getIosSystem() {
	let nav = navigator.userAgent.indexOf("OS ") + 3;
	let nav1 = navigator.userAgent.indexOf(" like");
	return parseInt(navigator.userAgent.substring(nav, nav1).split("_")[0]);
}
/**
 * 截取URL里面的参数
 * @param {Object} arg
 * @param {Object} urls
 */
function getParamsFromOutUrl(urls, arg = "") {
	if (!notNull(urls)) {
		return;
	}
	if (urls.indexOf("?") <= 0) {
		return;
	}
	let paramsString = urls.split("?")[1];
	return getParamsFromLink(paramsString, arg);
}
/**
 * 截取字符串里面的参数
 * @param {Object} arg
 * @param {Object} urls，不是URL，是URL里面?后面的参数
 */
function getParamsFromLink(paramsString, arg = "") {
	if(paramsString) {
		let paramsObj = {};
		if (paramsString.indexOf('&amp;') > 0) {
			paramsString = paramsString.indexOf("#/") > -1 ? paramsString.replace(/#\//g, "&amp;") : paramsString;
			paramsString.split("&amp;").forEach(function (item, index) {
				paramsObj[item.split("=")[0]] = item.split("=")[1]
			});
		} else {
			paramsString = paramsString.indexOf("#/") > -1 ? paramsString.replace(/#\//g, "&") : paramsString;
			paramsString.split("&").forEach(function (item, index) {
				paramsObj[item.split("=")[0]] = item.split("=")[1]
			});
		}

		if (arg && paramsObj[arg]) {
			return paramsObj[arg]
		} else {
			return ""
		}
	} else {
		return
	}
}
/*是否显示顶部标题
 *@return true:显示，false:不显示
 * */
function isShowTopTitles() {
	let shareLen = window.location.href.indexOf("/share");
	let shareLens = window.location.href.indexOf("/mainPageShare");
	let fromLen = window.location.href.indexOf("&from");
	if (shareLens > 0 || shareLen >= 0 || fromLen > 0) {
		return false;
	} else {
		return true;
	}
};
/**是否显示下载条
 *true:显示，false：不显示
 */
function isShowDownloadDiv(channelFlag) {
	let urls = window.location.href;
	let isWX = false;
	var Navigator = navigator.userAgent;
	var ifChrome = Navigator.match(/Chrome/i) != null && Navigator.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ?
		true : false;
	var ifAndroid = (Navigator.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true : false;
	var ifiPad = (Navigator.match(/(iPad).*OS\s([\d_]+)/)) ? true : false;
	var ifiPhone = (!ifiPad && Navigator.match(/(iPhone\sOS)\s([\d_]+)/)) ? true : false;
	var ifSafari = (ifiPhone || ifiPad) && Navigator.match(/Safari/);
	var isWx = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
	var isWeibo = navigator.userAgent.toLowerCase().match(/weibo/i) == "weibo";
	let downloadTitle = getParamsFromUrl('downloadTitle');
	if ("3" == channelFlag || "4" == channelFlag) { //微信公众号和小程序，不显示下载条
		isWX = false;
	} else {
		if (isWx || isWeibo || "1" == downloadTitle) {
			isWX = true;
		} else {
			isWX = false;
		}
	}
	return isWX;
}
/**获取移动端设备
 *1：Android；2：ios
 */
function isMobile() {
	if (/android/i.test(navigator.userAgent) || /adr/i.test(navigator.userAgent)) {
		return 1
	} else if (/iPhone|iPad|iPod|iOS/i.test(navigator.userAgent)) {
		return 2
	} else {
		return 1
	}
}

function setupWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge);
	} else {
		document.addEventListener(
			'WebViewJavascriptBridgeReady',
			function () {
				callback(WebViewJavascriptBridge);
			},
			false
		);
	}
	if (window.WVJBCallbacks) {
		return window.WVJBCallbacks.push(callback);
	}
	window.WVJBCallbacks = [callback];
	var WVJBIframe = document.createElement('iframe');
	WVJBIframe.style.display = 'none';
	WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
	document.documentElement.appendChild(WVJBIframe);
	setTimeout(function () {
		document.documentElement.removeChild(WVJBIframe);
	}, 0);
}

function callAppMethod(obj) {
	let callName = obj.callName || "";
	let parameters = obj.parameters || {};
	let callback = obj.callback || function (data) { };
	if (!callName) {
		return
	} else {
		setupWebViewJavascriptBridge(function (bridge) {
			bridge.callHandler(callName, parameters, callback)
		})
	}
}

/**判空方法*/
function notNull(obj) {
	if (obj === null) {
		return false;
	} else if (obj === undefined) {
		return false;
	} else if (obj === "undefined") {
		return false;
	} else if (obj === "") {
		return false;
	} else if (obj === "[]") {
		return false;
	} else if (obj === "{}") {
		return false;
	} else {
		return true;
	}
};
/**手机银行APP下载方法*/
function bocAppDownLoad(params) {
	let urls = "http://a.app.qq.com/o/simple.jsp?pkgname=com.chinamworld.bocmbci";
	window.location.href = urls;
};

function bocAppDownLoad2(){
  let url = window.location.href
  url = url.replace(/isShareLink/g, "placeholder")
  let urlData = {"url":url};

  /*  bocmbciphone://h5/promotionPage?gctExtraParams=*/
  let userUrl = encodeURIComponent(JSON.stringify(urlData));
  let endUrl = encodeURIComponent("bocmbciphone://h5/promotionPage?gctExtraParams="+userUrl);
  let txUrl = "http://a.app.qq.com/o/simple.jsp?pkgname=com.chinamworld.bocmbci&android_scheme="+endUrl+"&ios_scheme="+endUrl;
  console.log(txUrl);
}
/**与客户端进行交互
* 自定义参数
* userParameters.uiJumpId
*      模块详情ID
* userParameters.uiParmValue
*      模块详情ID
* userParameters.type
*      跳转模块类型: h5/app
*
* userParameters.isLogin
*      是否需要登陆: 0/1
*
*  actIsHtml5=1   跳转url
   actIsHtml5=0跳转app本地模块	—>type

   actIsLogin=1 需要登录
   actIsLogin=0 不需要登录		—> 新增拼接参数 ->isLogin

   actUrl 是模块id，可为空    		 —>uiJumpId

   actDetailsId 模块详情id  		—>uiParmValue
   在actIsHtml5=1时，需要增加下面的参数

   actHtml5Type 跳转H5类型      —>actHtml5Type(新增)
   actHtml5Url	 跳转H5地址	   —>jumpURLStr
*/
function openApp(userParameters) {
	// 判断浏览器
	var Navigator = navigator.userAgent;
	var ifChrome = Navigator.match(/Chrome/i) != null && Navigator.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null ?
		true : false;
	var ifAndroid = (Navigator.match(/(Android);?[\s\/]+([\d.]+)?/)) ? true : false;
	var ifiPad = (Navigator.match(/(iPad).*OS\s([\d_]+)/)) ? true : false;
	var ifiPhone = (!ifiPad && Navigator.match(/(iPhone\sOS)\s([\d_]+)/)) ? true : false;
	var ifSafari = (ifiPhone || ifiPad) && Navigator.match(/Safari/);
	var version = 0;
	ifSafari && (version = Navigator.match(/Version\/([\d\.]+)/));
	// safari浏览器版本
	version = parseFloat(version[1], 10);
	// 是否从微信打开
	var ifWeixin = navigator.userAgent.indexOf("MicroMessenger") >= 0; // weixin

	var bocSchemeUrl = "mlife";
	var loadTimer;
	//拼接自定义参数
	if (!$.isEmptyObject(userParameters)) {
		bocSchemeUrl += "?"
		for (var item in userParameters) {
			bocSchemeUrl += item + "=" + ((userParameters[item] != undefined && userParameters[item] != "undefined") ?
				userParameters[item] : "") + "&";
		}
		bocSchemeUrl = bocSchemeUrl.replace(/\&$/, "");
	}
	var encodeParams = encodeURIComponent(bocSchemeUrl);
	// 由安卓APP提供
	var AppConfig = {
		"scheme": "boc",
		"host": "mlife",
		"package": "com.forms",
		"action": "android.intent.action.VIEW",
		"category": "android.intent.category.BROWSABLE",
		"FAILBACK_ANDROID": "http://a.app.qq.com/o/simple.jsp?pkgname=com.forms&android_schema=boc://" + encodeParams, //安卓下载地址--应用宝下载地址
		"FAILBACK_IOS": "http://a.app.qq.com/o/simple.jsp?pkgname=com.forms&ios_scheme=bocMlife://" + encodeParams //ios下载地址--应用宝下载地址
	};

	if (ifAndroid) {
		var s = getAndroidSchema(AppConfig, ifChrome);
		if (ifChrome) { // chrome会自动识别S.browser_fallback_url如果没有安装则打开下载链接地址
			//			window.location.href = s;
			window.location.href = AppConfig.FAILBACK_ANDROID;
		} else
			if (ifWeixin) { // 微信无法打开APP，跳转到下载页面//ld---跳转到应用宝下载链接
				window.location.href = AppConfig.FAILBACK_ANDROID;
			} else { // 其他浏览器3秒内没打开则跳转到下载链接
				window.location.href = AppConfig.FAILBACK_ANDROID;

				//			window.location.href = s;
				//			var start = Date.now();
				//			// 如果页面在后台运行返回，如果超过3秒没有打开APP，则没有安装，跳转到应用市场
				//			loadTimer = setTimeout(function() {
				//				if(document.hidden || document.webkitHidden) {
				//					return;
				//				}
				//				if(Date.now() - start <= 3000 + 200) {
				//					//设置下载按钮的地址
				//					if(location.port) {
				//						location.href = "https://mlife.jf365.boc.cn/AppPrj/download.html";
				//					} else {
				//						location.href = "https://mlife.jf365.boc.cn/AppPrj/download.html";
				//					}
				//				} else {}
				//			}, 3000);
			}
		// 当页面在后台运行时清空定时器防止页面跳转到下载页
		var visibilitychange = function () {
			var tag = document.hidden || document.webkitHidden;
			tag && clearTimeout(loadTimer);
		}
		document.addEventListener('visibilitychange', visibilitychange, false);
		document.addEventListener("webkitvisibilitychange", visibilitychange, false);
		window.addEventListener("pagehide", function () {
			clearTimeout(loadTimer);
		}, false);
	}

	if (ifiPhone) {
		if (ifWeixin) {
			window.location.href = AppConfig.FAILBACK_IOS;
		} else {
			window.location.href = AppConfig.FAILBACK_IOS;
			//			window.location.href = 'boc://mlife/open';
			//			var start = Date.now();
			//			// 如果页面在后台运行返回，如果超过3秒没有打开APP，则没有安装，跳转到IOS应用市场
			//			loadTimer = setTimeout(function() {
			//				if(document.hidden || document.webkitHidden) {
			//					return;
			//				}
			//				if(Date.now() - start > 3000 + 200) {
			//
			//				} else {
			//					//设置下载按钮的地址
			//					if(location.port) {
			//						location.href = "https://mlife.jf365.boc.cn/AppPrj/download.html";
			//					} else {
			//						location.href = "https://mlife.jf365.boc.cn/AppPrj/download.html";
			//					}
			//				}
			//			}, 3000);

		}
		// 当页面在后台运行时清空定时器防止页面跳转到下载页
		var visibilitychange = function () {
			var tag = document.hidden || document.webkitHidden;
			tag && clearTimeout(loadTimer);
		}
		document.addEventListener('visibilitychange', visibilitychange, false);
		document.addEventListener("webkitvisibilitychange", visibilitychange, false);
		window.addEventListener("pagehide", function () {
			clearTimeout(loadTimer);
		}, false);
	}

};
/*
 * 此方法默认打开缤纷生活
 * urlAfter:链接后缀，如?#/orderListMLifePage
 */
function openMlifeAppByParams(urlAfter) {
	let uiJumpUrl = "https://mlife.jf365.boc.cn/mlife/mobilelife/html5/107/ColorfulLife_motionHealth_XW/index.html";
	if (notNull(urlAfter)) {
		uiJumpUrl = uiJumpUrl + urlAfter;
	}
	uiJumpUrl = encodeURIComponent(uiJumpUrl);
	let actConfig = {
		type: "1",
		uiJumpId: "190001",
		uiJumpChildId: "",
		tip: "",
		uiName: "",
		uiJumpUrl: "",
		uiParmValue: uiJumpUrl,
	};
	openApp(actConfig);
}
/**android打开app 地址
 *@AppConfig
 *@ifChrome
 * */
function getAndroidSchema(AppConfig, ifChrome) {
	var schemaStr = 'mlife/open?a=test';
	if (ifChrome) {
		schemaStr = "intent://" + schemaStr + "#Intent;" +
			"scheme=" + AppConfig.scheme + ";" +
			"package=" + AppConfig.package + ";" +
			"category=" + AppConfig.category + ";" +
			"S.browser_fallback_url=" + encodeURIComponent(AppConfig.FAILBACK_ANDROID) + ";" +
			"end";
	} else {
		schemaStr = "boc://mlife/open";
	}
	return schemaStr;
};

/**
 *封装点击事件
 *@type：1-app,2-h5
 *@uiJumpId:功能id
 *@titleName:标题名称
 *@uiJumpUrl:2的时候传：H5-URL
 *@uiParmValue:参数
 * */
function itemClickParams(type, uiJumpId, titleName, uiJumpUrl, uiParmValue) {
	console.log(...arguments)
	console.log("==itemClickParams==")
	//应用包打开使用
	let actConfig = {
		type: type,
		uiJumpId: uiJumpId,
		uiJumpChildId: "",
		tip: "",
		uiName: titleName,
		uiJumpUrl: uiJumpUrl,
		uiParmValue: uiParmValue,
	};
	//app内使用
	let parameters = {
		uiIcon: "",
		uiIconUrl: "",
		uiJump: type,
		uiJumpId: uiJumpId,
		uiName: titleName,
		uiSeq: "",
		uiJumpUrl: uiJumpUrl,
		uiParmValue: uiParmValue,
	}
	gotoCommonClick(actConfig, parameters);
};
/*区分是APP内调用还是微信调用
 *@actConfig:微信使用
 *@parameters：APP使用
 * */
function gotoCommonClick(actConfig, parameters) {
	console.log("==gotoCommonClick==")
	var isWx = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
	var isWeibo = navigator.userAgent.toLowerCase().match(/weibo/i) == "weibo";
	if (isWx || isWeibo) {
		openApp(actConfig);
	} else {
		gotoApp(parameters);
	}
};

/**
 * 是否在APP内
 * @return:false:不在APP内 true:在APP内
 */
function isInApp(channel) {
	var isWx = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger";
	var isWeibo = navigator.userAgent.toLowerCase().match(/weibo/i) == "weibo";
	let urls = window.location.href;
	if (channel == "3" || channel == "4" || channel == "6") { //3-微信公众 4-小程序
		return true;
	} else {
		if (isWx || isWeibo) {
			return false;
		} else {
			return true;
		}
	}

};
/*与客户端交互*/
function gotoApp(parameter) {
	console.log("==gotoApp==")
	callAppMethod({
		callName: "goBannerModel",
		parameters: parameter
	});

};

//	callAppMethod({
//		callName: "clearLoginInfo"
//	});
/*跳转客户端登录*/
function gotoLogin() {
	console.log("==gotoLogin==")
	callAppMethod({
		callName: "toLogin"
	});

};
/*请求超时-跳转客户端登录*/
function gotoLoginByTimeOut() {
	console.log("==gotoLoginByTimeOut==")
	callAppMethod({
		callName: "clearLoginInfo"
	});
	callAppMethod({
		callName: "toLogin"
	});
};
/*从URL中提取giftno的方法
 * key：url中的关键词
 * urls：路径
 * */
function getGiftNo(key, urls) {
	if (notNull(key) && notNull(urls)) {
		if (urls.indexOf(key) > 0) {
			var newUrl = urls.split(key);
			return newUrl[1].substr(1);
		} else {
			return ""
		}

	} else {
		return ""
	}

}
/*
 * 根据固定长度，添加符号
 * stringParams：要处理的字符串
 * flexLen:固定长度，数字类型
 * codeParams：要添加的符号
 */
function getStrByFlexFormat(strParams, flexLen, codeParams) {
	if (!notNull(strParams)) {
		return "";
	}
	let stringParams = String(strParams);
	let len = stringParams.length / flexLen;
	let numbers = "";
	for (let i = 0; i < len; i++) {
		let str = stringParams.substring(0, flexLen) + codeParams;
		numbers = numbers + str;
		stringParams = stringParams.substring(flexLen)
	}
	if (notNull(numbers)) {
		numbers = numbers.substring(0, numbers.length - 1)
	}
	return numbers;
}
/**
 * 金额格式化，
 * number:要格式化的数字；decimals：保留几位小数，
 * dec_point：小数点符号, thousands_sep：千分位分割符号
 */

function number_format(num) {
	if (!notNull(num)) {
		return "";
	}
	let numbers = String(num);
	if (numbers.indexOf(",") > 0) {
		return numbers
	}
	if (numbers.indexOf(".") > 0) { //有小数点
		let len = numbers.indexOf(".");
		let numBef = numbers.substring(0, len);
		let numAft = numbers.substring(len, numbers.length);
		let numReverse = numBef.split('').reverse().join(''); //将字符串顺序颠倒
		let str = getStrByFlexFormat(numReverse, 3, ",");
		let strReverse = str.split('').reverse().join(''); //将字符串顺序颠倒
		strReverse = strReverse + numAft;
		return strReverse;

	} else { //无小数点
		let numReverse = numbers.split('').reverse().join(''); //将字符串顺序颠倒
		let str = getStrByFlexFormat(numReverse, 3, ",");
		let strReverse = str.split('').reverse().join(''); //将字符串顺序颠倒
		strReverse = strReverse + ".00";
		return strReverse;
	}
	//	number = parseFloat(number);
	//	number = (number + '').replace(/[^0-9+-Ee.]/g, '');
	//	var n = !isFinite(+number) ? 0 : +number,
	//		prec = !isFinite(+decimals) ? 2 : Math.abs(decimals),
	//		sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
	//		dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
	//		s = '',
	//		toFixedFix = function(n, prec) {
	//			var k = Math.pow(10, prec);
	//			return '' + Math.ceil(n * k) / k;
	//		};
	//	s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
	//	var re = /(-?\d+)(\d{3})/;
	//	while(re.test(s[0])) {
	//		s[0] = s[0].replace(re, "$1" + sep + "$2");
	//	}
	//	if((s[1] || '').length < prec) {
	//		s[1] = s[1] || '';
	//		s[1] += new Array(prec - s[1].length + 1).join('0');
	//	}
	//	return s.join(dec);
}

/** 微信二次分享-回调处理
 * wxData：接口回调数据
 * shareTitle：分享标题
 * shareUrl：分享内容url
 * shareDes:分享描述
 * shareImgUrl:logo图片url
 */
function wxConfigCommon(wxData, shareUrl, shareTitle, shareDes, shareImgUrl) {
	wx.config({
		debug: false,
		appId: wxData.appId, //公众号的唯一标识
		timestamp: wxData.timestamp, //生产签名时间戳
		nonceStr: wxData.noncestr, //生成签名随机串
		signature: wxData.signature, //签名
		jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo'] //需要使用的接口列表，表中分别为朋友圈，朋友和微博
	});
	wx.ready(function () {
		wx.onMenuShareTimeline({ //分享到朋友圈
			title: shareTitle,
			desc: shareDes,
			link: shareUrl,
			imgUrl: shareImgUrl,
			success: function () { }
		});
		wx.onMenuShareAppMessage({ //分享给朋友
			title: shareTitle, //分享标题
			desc: shareDes, //分享描述
			link: shareUrl, //分享地址
			imgUrl: shareImgUrl, //分享图标（绝对路径）
			success: function () { },
			trigger: function () { }
		});
		wx.onMenuShareWeibo({ //分享到微博
			title: shareTitle,
			desc: shareDes,
			link: shareUrl,
			imgUrl: shareImgUrl,
			success: function () { }
		});
		//    wx.hideAllNonBaseMenuItem();
	});
	wx.error(function (err) { //分享配置失败会执行这里
	});
}

/**
 * 3des 加密
 * @param buffer: 要加密的数据
 * @param radom: 随机数（后台随机数的前12位加自己生成的随机数的前12位）
 * @param iv: 偏移量（后台随机数的后4位加自己随机数的后4位）
 */
function get3DesData(testData, radom, iv) {
	let that = this;
	testData = JSON.stringify(testData);
	let key111 = that.CryptoJS.enc.Base64.parse(btoa(radom));
	let ivs = that.CryptoJS.enc.Utf8.parse(iv);
	let encrypted111 = that.CryptoJS.TripleDES.encrypt(testData, key111, {
		iv: ivs,
		mode: that.CryptoJS.mode.CBC,
		padding: that.CryptoJS.pad.Pkcs7
	});
	return encrypted111.toString();
};

/**
 * 私钥解密，解密之后 返回 utf8编码的字符串
 * @param buffer: Buffer object or base64 encoded string
 * @param privateKey: 解密用的私钥，格式是：pkcs8 pem
 * @param encoding: 加密之后的类型 buffer OR json, 默认是 buffer
 * @returns：默认返回值类型就是 encoding 的默认值，即 buffer
 */
function privateKeyDecrypt(buffer, privateKey, encoding = "buffer") {
	let that = this;
	let key = new that.NodeRSA();
	key.setOptions({
		encryptionScheme: "pkcs1", // 默认是：pkcs1_oaep，Java 端默认是 pkcs1, 这里做个修改
	})
	key.importKey(privateKey, "pkcs8-private-pem");
	return key.decrypt(buffer, encoding)
};

/**
 * 公钥加密，加密之后以 BASE64 形式编码
 * @param buffer : 待加密内容 编码格式：utf-8
 * @param publicKey: 加密使用的公钥, 格式是：pkcs8 pem
 * @param encoding: 加密之后的输出编码类型 默认输出编码格式是：base64
 * @param source_encoding: 指定代加密内容的编码方式，默认是：utf-8
 * @returns: 返回以 BASE64 处理之后的加密内容
 */
function publicKeyEncrypt(buffer, pubicKey, encoding = "base64", source_encoding = "utf8") {
	let that = this;
	let key = new that.NodeRSA();
	key.setOptions({
		encryptionScheme: "pkcs1", // 默认是：pkcs1_oaep，Java 端默认是 pkcs1, 这里做个修改
	})
	key.importKey(pubicKey, "pkcs8-public-pem");
	return key.encrypt(buffer, encoding, source_encoding);
};

/**生产固定位数的随机数
 * range:是可以改变的
 **/

function getRandom(range) {
	var str = "",
		arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
			'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
		];
	for (var i = 0; i < range; i++) {
		let pos = Math.round(Math.random() * (arr.length - 1));
		str += arr[pos];
	}
	return str;
};

/**
 * 字符串替换
 * @param {Object} replaceBefore:要替换的字符串
 * @param {Object} replaceAfter:最终要替换的字符串
 * @param replaceBefore替换成replaceAfter
 */
function strReplace(str, replaceBefore, replaceAfter) {
	if (!this.notNull(str)) {
		return ""
	}
	str = str.toString();
	while (str.indexOf(replaceBefore) != -1) {
		str = str.replace(replaceBefore, replaceAfter);
	}
	return str;
}
/**手机银行打开H5页面公共方法
 * url是跳转连接
 * name是头部名称
 */
function bocOpenPage(item) {
	//通过Cordova方法去打开H5页面
	//请求参数，JSON格式，如果不需要可以为空 ,url:是跳转的链接，name是头部名称
	var setting = {
		page: "1",
		url: item.urls,
		title: item.name
	}
	/*c_plugins为引入的Cordova配置文件，
	 * crcdMerchantBridge为Cordova配套文件的名称
	 * goToNative为请求方法的名称
	 * 请求交互方式为：请求方法名(成功返回方法，失败返回方法，请求参数)*/
	this.c_plugins.crcdMerchantBridge.goToNative(function (data) {
		//success callback
	}, function (data) {
		//error callback
	}, setting)
}

/*手机银行判断APP版本号*/
function versionCompare(version1, version2) {
	var v1 = version1.split('.');
	var v2 = version2.split('.');
	for (var i = 0; i < v1.length; i++) {
		if (v1[i] * 1 > v2[i] * 1) {
			return 1;
		} else if (v1[i] * 1 < v2[i] * 1) {
			return -1;
		}
	}
	return 0;
}

//金额保留两位小数，若不足两位则用0补足
function toDecimal2(x) {
	var f = parseFloat(x);
	if (isNaN(f)) {
		return false;
	}
	var f = Math.round(x * 100) / 100;
	var s = f.toString();
	var rs = s.indexOf('.');
	if (rs < 0) {
		rs = s.length;
		s += '.';
	}
	while (s.length <= rs + 2) {
		s += '0';
	}
	return s;
}
/*
 * 跳转到微信小程序支付
 * wechatOrderMsg：预下单返回参数
 * prodectType：商品类型
 * 冰雪玩乐：iceSnow，场馆：venue，axess:Axess,惠美:huimei
 * merChannelFlag:商户标记
 * navigateTo：换成reLaunch
 */
function jumpToWeChatProgramPayMoney(wechatOrderMsg, weChatPayAfter, prodectType, merChannelFlag) {
	//参数
	var payMoney = wechatOrderMsg.payMoney; //支付金额
	var resultUrl = weChatPayAfter + "#/blankExcessPage"; //返回url
	var orderNo = wechatOrderMsg.orderNo; //微信的订单号
	var prepayId = wechatOrderMsg.prepayId; //预支付交易会话标识
	var appId = wechatOrderMsg.appId; //公众号id
	var timeStamp = wechatOrderMsg.timeStamp; //时间戳
	var nonceStr = wechatOrderMsg.nonceStr; //随机字符串
	var package1 = wechatOrderMsg.package1; //订单详情扩展字符串
	package1 = encodeURIComponent(wechatOrderMsg.package1);
	var signType = wechatOrderMsg.signType; //签名方式
	var paySign = wechatOrderMsg.paySign; //签名
	paySign = encodeURIComponent(wechatOrderMsg.paySign);
	var orderDetails = wechatOrderMsg.orderDetails; //订单描述
	var orderNum = wechatOrderMsg.orderNum; //订单编号
	var prodectType = prodectType; //产品类型

	var smallPro = false;
	let urls = '/pages/payment/payment?payMoney=' + payMoney + "&resultUrl=" + resultUrl + "&orderNo=" + orderNo +
		"&prepayId=" + prepayId + "&appId=" + appId + "&timeStamp=" + timeStamp + "&nonceStr=" + nonceStr +
		"&package=" + package1 + "&signType=" + signType + "&paySign=" + paySign + "&orderDetails=" + orderDetails +
		"&orderNum=" + orderNum + "&prodectType=" + prodectType + "&merChannelFlag=" + merChannelFlag;
	alert("小程程参数URL="+urls)
	//判断当前页面是否在小程序环境中
	wx.miniProgram.getEnv(function (res) {
		if (res.miniprogram) {
			smallPro = true;
		} else {
			smallPro = false;
		}
	});
	alert("小程程参数smallPro="+smallPro)
	if (smallPro) {
		wx.miniProgram.reLaunch({
			//跳转回小程序的页面
			url: '/pages/payment/payment?payMoney=' + payMoney + "&resultUrl=" + resultUrl + "&orderNo=" + orderNo +
				"&prepayId=" + prepayId + "&appId=" + appId + "&timeStamp=" + timeStamp + "&nonceStr=" + nonceStr +
				"&package=" + package1 + "&signType=" + signType + "&paySign=" + paySign + "&orderDetails=" + orderDetails +
				"&orderNum=" + orderNum + "&prodectType=" + prodectType + "&merChannelFlag=" + merChannelFlag,
			success: function () {
				console.log('success')
			},
			fail: function () {
				console.log('fail');
			},
		});
	} else {
		console.log("跳转失败了。。。")
	}

}
/**打开小程序首页-----运动健身首页
 *wechatPaType参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,wechatOutEnter=跳转小程序外链
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * **/
function jumpToWeChatIndex() {
	let urls = '/pages/index/index';
	weParamGotoClick(urls);

}
/**小程序打开外部链接
 *wechatPaType:参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,wechatOutEnter=跳转小程序外链
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * **/
function jumpToWeChatProOutLink(wechatPaType, wechatUrl, wechatEnParams) {
	wechatUrl = encodeURIComponent(wechatUrl);
	let urls = '/pages/index/index?wechatPaType=' + wechatPaType + "&wechatEntFlag=weProgram&wechatUrl=" + wechatUrl +
		"&wechatModel=wechatOutEnter" + "&wechatEnParams=" + wechatEnParams;
	console.log("小程序外链：" + urls)
	//判断当前页面是否在小程序环境中
	weParamGotoClick(urls);
}
/**小程序渠道--打开运动专区任意模块
 *wechatPaType:参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * **/
function jumpToWeChatProCommModel(wechatModel,wechatPaType,wechatEnParams) {
	// wechatUrl = encodeURIComponent(wechatUrl);
	let urls = '/pages/index/index?wechatPaType=' + wechatPaType + "&wechatEntFlag=weProgram"+
		"&wechatModel="+wechatModel + "&wechatEnParams=" + wechatEnParams;
	console.log("打开小程序的任意页面：" + urls)
	//判断当前页面是否在小程序环境中
	weParamGotoClick(urls);
}
/**中银运动+跳转事件*/
function weParamGotoClick(urls){
	var smallPro = true;
	console.log(wx.miniProgram);
/*	wx.miniProgram.getEnv(function(res) {
		if(res.miniprogram) {
			smallPro = true;
		} else {
			smallPro = false;
		}
	});*/
  console.log("YMH20210308");

	if(smallPro) {
		wx.miniProgram.reLaunch({
			//跳转回小程序的页面
			url: urls,
			success: function() {
				console.log('success')
			},
			fail :function() {
				console.log('fail');
			},
		});
	} else {
		console.log("跳转失败了。。。")
	}
}

/**小程序渠道公用退出方法
 * channelFlag：渠道标记
 * weChatTocken：惠美小程序token
 * */
function weChatProgramCommonExit(channelFlag, weChatTocken) {
	alert("-跳转小程序公用方法-")
	var smallPro = false;
	//判断当前页面是否在小程序环境中
	wx.miniProgram.getEnv(function(res) {
		// console.log(res.miniprogram); // true
		if(res.miniprogram) {
			smallPro = true;
		} else {
			smallPro = false;
		}
	});
	if(!smallPro) {
		// console.log('不在小程序');
	}
	//navigateTo:每次都新增，reLaunch：移除原来所有，新增当前页面，redirectTo：移除当前栈顶页面，显示当前页面
	if('4' == channelFlag) {
		// 中银运动程序-wx.miniProgram.reLaunch
		alert("-reLaunch公用方法-")
		wx.miniProgram.reLaunch({
			//跳转回小程序的页面
			url: '/pages/index/index',
			success: function() {
				console.log('success');
			},
			fail: function() {
				console.log('fail');
			}
		});
	} else {
		// 惠美小程序
		wx.miniProgram.navigateBack({
			url: '/page/goprogram/goprogram?token=' + weChatTocken
		});
	}
}

/**小程序打开外部链接
 *wechatPaType参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,wechatOutEnter=跳转小程序外链
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * **/
function jumpToWeChatShareLink(wechatPaType, wechatUrl, wechatEnParams, wechatModel = "wechatOutEnter", wechatEntFlag = "weProgram") {
	let urls = getWeShareLink(wechatPaType, wechatUrl, wechatEnParams, wechatModel);
	let smallPro = false;
	console.log("小程序外链：" + urls)
	//判断当前页面是否在小程序环境中
	wx.miniProgram.getEnv(function(res) {
		if(res.miniprogram) {
			smallPro = true;
		} else {
			smallPro = false;
		}
	});
	if(smallPro) {
		wx.miniProgram.reLaunch({
			//跳转回小程序的页面
			url: urls,
			success: function() {
				console.log('success')
			},
			fail: function() {
				console.log('fail');
			},
		});
	} else {
		console.log("跳转失败了。。。")
	}

}
/**小程序打开外部链接
 *wechatPaType参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,wechatOutEnter=跳转小程序外链
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * **/
function getWeShareLink(wechatPaType, wechatUrl, wechatEnParams, wechatModel = "wechatOutEnter", wechatEntFlag = "weProgram") {
	let urls = '/pages/index/index?wechatModel=' + wechatModel;
  if(wechatModel == "wechatOutEnter") { //如果model类型为外部链接
    wechatUrl = encodeURIComponent(wechatUrl);
    urls += `&wechatUrl=${wechatUrl}`
  }
	if(wechatPaType == 3 || wechatPaType == 4) { //对于多参数的判断
		wechatEnParams = encodeURIComponent(wechatEnParams);
	}
	if(wechatPaType != 1) { //type为1是无参数
		urls += "&wechatEntParams=" + wechatEnParams;
	}
	if(notNull(wechatEntFlag)){
    urls += `&wechatEntFlag=${wechatEntFlag}`
  }
  urls += `&wechatPaType=${wechatPaType}&wechatUrl=${wechatUrl}&targetChannel=${this.channelFlag}`;
	return urls;
}

function getAppPhoneUrl(wechatPaType, wechatEnParams, wechatModel = "wechatOutEnter", wechatEntFlag = "weProgram"){
  let urls = this.shareLinkBefore +'#/blankExcessPage?wechatModel=' + wechatModel;
  if(wechatPaType == 3 || wechatPaType == 4) { //对于多参数的判断
    wechatEnParams = encodeURIComponent(wechatEnParams);
  }
  if(wechatPaType != 1) { //type为1是无参数
    urls += "&wechatEntParams=" + wechatEnParams;
  }
  if(notNull(wechatEntFlag)){
    urls += `&wechatEntFlag=${wechatEntFlag}`
  }
  urls += `&wechatPaType=${wechatPaType}`;
  return urls
}
/**小程序打开外部链接
  小程序打开app
 * **/
function jumpToWeChatApp() {
  var smallPro = false;
  let urls = '/pages/blank/blank?openApp=Y&targetChannel='+(this.targetChannel == "1" ? "MAPSN": "MLIFE");
  console.log(urls)
  //判断当前页面是否在小程序环境中
  wx.miniProgram.getEnv(function(res) {
    if(res.miniprogram) {
      smallPro = true;
    } else {
      smallPro = false;
    }
    console.log("进入回调")
  });
  if(smallPro) {
    wx.miniProgram.navigateTo({
      //跳转回小程序的页面
      url: urls,
      success: function() {
        console.log('success')
      },
      fail: function() {
        console.log('fail');
      },
    });
  } else {
    console.log("跳转失败了。。。")
  }

}
/*时间格式转化
 *@params:timsF:yyyyMMdd
 * @treturn:yyyy-MM-dd
 */

function timeFormat10(timsF) {
	if (!notNull(timsF)) {
		return timsF;
	}
	if (timsF.length != 8) {
		return timsF;
	}
	let year = timsF.substring(0, 4);
	let month = timsF.substring(4, 6);
	let day = timsF.substring(6, 8);
	return year + "-" + month + "-" + day;
}
/*时间格式转化
 *@params:timsF:yyyyMMdd
 * formats:转换格式
 * @treturn:yyyy-MM-dd
 */

function timeFormat10Times(timsF,formats) {
	if(!notNull(timsF)) {
		return timsF;
	}
	if(timsF.length != 8) {
		return timsF;
	}
	let year = timsF.substring(0, 4);
	let month = timsF.substring(4, 6);
	let day = timsF.substring(6, 8);
	return year + formats + month + formats + day;
}
/*时间格式转化
 *@params:timsF:yyyy-MM-dd HH:mm:ss
 * @treturn:yyyy/MM/dd
 */
function timeFormatLine(timsF) {
	if (!notNull(timsF)) {
		return timsF;
	}
	if (timsF.length < 10) {
		return timsF;
	}
	let year = timsF.substring(0, 4);
	let month = timsF.substring(5, 7);
	let day = timsF.substring(8, 10);
	return year + "/" + month + "/" + day;
}
/*时间格式转化
 *@params:timsF:yyyy-MM-dd HH:mm:ss
 * @treturn:yyyy/MM/dd HH:mm:ss
 */
function timeFormatLineBySecond(timsF) {
	if (!notNull(timsF)) {
		return timsF;
	}
	let times = timsF.replace(/-/g, "/")
	return times;
}
/*时间格式转化
 *@params:timsF:yyyyMMdd
 * @treturn:yyyy年MM月dd日
 */
function timeFormatYaer(timsF) {
	if (!notNull(timsF)) {
		return timsF;
	}
	if (timsF.length != 8) {
		return timsF;
	}
	let year = timsF.substring(0, 4);
	let month = timsF.substring(4, 6);
	let day = timsF.substring(6, 8);
	return year + "年" + month + "月" + day + "日";
}

function highPrecisionAdd(data1, data2) { // 加法
	data1 = data1 + "";
	data2 = data2 + "";
	let r1, r2, m;
	// 获取每个参数的小数的位数
	try {
		r1 = data1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = data2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	// 计算底数为10以最大小数位数为次幂的值
	m = Math.pow(10, Math.max(r1, r2));
	// 把所有参数转为整数后相加再除以次幂的值
	return (data1 * m + data2 * m) / m;
}

function highPrecisionReduce(data1, data2) { // 减法
	data1 = data1 + "";
	data2 = data2 + "";
	let r1, r2, m, n;
	// 获取每个参数的小数的位数
	try {
		r1 = data1.toString().split(".")[1].length
	} catch (e) {
		r1 = 0
	}
	try {
		r2 = data2.toString().split(".")[1].length
	} catch (e) {
		r2 = 0
	}
	// 计算底数为10以最大小数位数为次幂的值
	m = Math.pow(10, Math.max(r1, r2));
	//精度长度以最大小数位数为长度
	n = (r1 >= r2) ? r1 : r2;
	return ((data1 * m - data2 * m) / m).toFixed(n);
}

function highPrecisionMul(data1, data2) { // 乘法
	data1 = data1 + "";
	data2 = data2 + "";
	let m = 0,
		s1 = data1.toString(),
		s2 = data2.toString();
	// 获取所有参数小数位长度之和
	try {
		m += s1.split(".")[1].length
	} catch (e) { }
	try {
		m += s2.split(".")[1].length
	} catch (e) { }
	// 替换掉小数点转为数字相乘再除以10的次幂值
	return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}

function highPrecisionDiv(data1, data2) { // 除法
	data1 = data1 + "";
	data2 = data2 + "";
	let t1 = 0,
		t2 = 0,
		r1, r2;
	// 获取每个参数的小数的位数
	try {
		t1 = data1.toString().split(".")[1].length
	} catch (e) { }
	try {
		t2 = data2.toString().split(".")[1].length
	} catch (e) { }
	// 把所有参数的小数点去掉转为整数
	r1 = Number(data1.toString().replace(".", ""));
	r2 = Number(data2.toString().replace(".", ""));
	return (r1 / r2) * Math.pow(10, t2 - t1);
}
/**
 *时间格式转化
 * fmt：输出时间格式
 * date：需要转化的时间，必须是Date
 * */
function dateFormat(fmt, date) { //author: meizz
	var o = {
		"M+": date.getMonth() + 1, //月份
		"d+": date.getDate(), //日
		"h+": date.getHours(), //小时
		"m+": date.getMinutes(), //分
		"s+": date.getSeconds(), //秒
		"q+": Math.floor((date.getMonth() + 3) / 3), //季度
		"S": date.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
/**手机银行-积分商品链接转化*/
function bocPointUrlEncode(productDetailsUrl) {
	if (!notNull(productDetailsUrl)) {
		return "";
	}
	let urlP = '"url":';
	let secondUrl = "{" + urlP + '"' + productDetailsUrl + '"' + "}";
	let secondUrlEncode = encodeURIComponent(secondUrl);
	return secondUrlEncode
}
/**手机银行-优惠券链接转化
 * urlPix:优惠券链接前缀
 * couponId：优惠券ID
 * cityName：城市名称
 * */
function bocCouponUrlEncode(urlPix, couponId, cityName) {
	if (!notNull(couponId) || !notNull(urlPix)) {
		return "";
	}
	let secondUrl = urlPix + "city=" + cityName + "&Id=" + couponId + "&type=3";
	let secondUrlEncode = encodeURIComponent(secondUrl);
	return secondUrlEncode
}
/**手机银行-外部链接拼接
 * urls：外部链接
 * title：页面标题
 * */
function bocContainUrl(urls, title) {
	if (!notNull(urls) || !notNull(title)) {
		return "";
	}
	let prix = "BOCBANK://containerAir/crcdSportsAreaDetail?gctExtraParams=";
	let posts = '&encodeFlag=encodeless';
	let urlP = '{"url":';
	let urlt = ',"title":';
	let secondUrl = urlP + '"' + urls + '"' + urlt + '"' + title + '"' + "}";
	let secondUrlEncode = prix + encodeURIComponent(secondUrl) + posts;
	return secondUrlEncode
}

/**
 * 新增公共判断默认图片的方法
 * 上送参数：1、图片类型imgType；2、后台返回的图片路径imgSrc
 * 如果返回的图片地址为空，即使用该类型的默认图片
 * 20201208-zj
 * */
function checkImgSrc(imgType, imgSrc) {
	// console.log("----------------------checkImgSrc----------------------")
	//先声明不同类型的图片的默认图片
	let shopLogoImg = require("../assets/iceArea/defaultImg/img_shop_logo@80x80.png"); //店铺logo
	let searchPageImg = require("../assets/iceArea/defaultImg/img_shop_banner@695x264.png"); //搜索页店铺广告图
	let listProPicImg = require("../assets/iceArea/defaultImg/img_list_pro@200x200.png"); //列表页商品图
	let mainProPicImg = require("../assets/iceArea/defaultImg/img_main_pro@335x251.png"); //瀑布流页商品图
	let detailLunboImg = require("../assets/iceArea/defaultImg/img_detail_banner@750x563.png"); //详情页商品轮播图
	let detailTuijianImg = require("../assets/iceArea/defaultImg/img_main_pro@335x251.png"); //详情页推荐商品图
	let detailZhuhuaImg = require("../assets/iceArea/defaultImg/img_detail_zhuhua@132x132.png"); //住滑套餐商品图
	let shopLunboImg = require("../assets/iceArea/defaultImg/img_shop_banner@750x422.png"); //店铺首页轮播图
	let defaultImg = require("../assets/stepCloak/stepFight/icon_defaultimg.png"); //店铺首页轮播图

	//再判断当前的
	if("shopLogo" == imgType) {
		//店铺logo
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return shopLogoImg;
		}
	} else if("searchPage" == imgType) {
		//搜索页店铺广告图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return searchPageImg;
		}
	} else if("listProPic" == imgType) {
		//列表页商品图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return listProPicImg;
		}
	} else if("mainProPic" == imgType) {
		//瀑布流页商品图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return mainProPicImg;
		}
	} else if("shopLunbo" == imgType) {
		//店铺首页轮播图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return shopLunboImg;
		}
	} else if("detailLunbo" == imgType) {
		//搜索页店铺广告图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return detailLunboImg;
		}
	} else if("detaiTuijian" == imgType) {
		//详情页商品轮播图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return detailTuijianImg;
		}
	} else if("detailZhuhua" == imgType) {
		//住滑套餐商品图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return detailZhuhuaImg;
		}
	}else if("defaultImg" == imgType) {
		//住滑套餐商品图
		if(notNull(imgSrc)) {
			return imgSrc;
		} else {
			return defaultImg;
		}
	}
	
}
/**
 * 蒋图片转成base64
 * width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
 * 可以会有跨域问题，建议是同源
 * @param imgSrc 图片地址
 * @param width
 * @param height
 * @returns {string}
 */
function getBase64Image(imgSrc, width, height) {
	return new Promise((resolve) => {
		const newImg = new Image();
		newImg.setAttribute('crossOrigin', 'anonymous');
		newImg.src = imgSrc;
		const canvas = document.createElement('canvas');

		newImg.onload = function() {
		  console.log("进入方法111");
      canvas.width = width || newImg.width;
      canvas.height = height || newImg.height;
      if(newImg.width > 1024 && newImg.height > 768){
        canvas.width = 1024;
        canvas.height = 768;
      }
			const ctx = canvas.getContext('2d');

			ctx.drawImage(newImg, 0, 0, canvas.width, canvas.height);
			const dataURL = canvas.toDataURL('image/png', 1);
			resolve(dataURL);
		};
	});
}

/**链接是否是转义过的
 * return：true:是 false：否
 * */
function urlIsEncode(urls1){
	let isEncode=false;
	if(!notNull(urls1)){
		return isEncode
	}
	if(urls1.indexOf("%3A%2F%2F")>-1||urls1.indexOf("%3F")>-1||urls1.indexOf("%3D")>-1){
	 	isEncode=true;
	}
	return isEncode
}
/*字符串复制
* text：需要复制的字符*/
function copyText(text){
  var input = document.createElement('input');

  input.setAttribute('id', 'input_for_copyText');
  input.value = text;

  document.getElementsByTagName('body')[0].appendChild(input);
  document.getElementById('input_for_copyText').select();
  document.execCommand('copy');
  document.getElementById('input_for_copyText').remove();
}
export default {
	getParamsFromUrl,
	isMobile,
	setupWebViewJavascriptBridge,
	callAppMethod,
	notNull,
	isShowTopTitles,
	openApp,
	itemClickParams,
	gotoCommonClick,
	gotoApp,
	gotoLogin,
	isInApp,
	isShowDownloadDiv,
	gotoLoginByTimeOut,
	getGiftNo,
	getParamsFromOutUrl,
	getIosSystem,
	number_format,
	wxConfigCommon,
	bocOpenPage,
	strReplace,
	versionCompare,
	getLocationUrlPrefix,
	toDecimal2,
	openMlifeAppByParams,
	get3DesData,
	privateKeyDecrypt,
	publicKeyEncrypt,
	getRandom,
	getStrByFlexFormat,
	jumpToWeChatProgramPayMoney,
	timeFormat10,
	timeFormatLine,
	timeFormatYaer,
	timeFormatLineBySecond,
	timeFormat10Times,
	bocAppDownLoad,
	highPrecisionAdd,
	highPrecisionReduce,
	highPrecisionMul,
	highPrecisionDiv,
	dateFormat,
	bocPointUrlEncode,
	bocCouponUrlEncode,
	bocContainUrl,
	checkImgSrc,
	jumpToWeChatProOutLink,
	getParamsFromLink,
	getWeShareLink,
	jumpToWeChatShareLink,
	getBase64Image,
	weChatProgramCommonExit,
	urlIsEncode,
	jumpToWeChatIndex,
  jumpToWeChatApp,
  getAppPhoneUrl,
  jumpToWeChatProCommModel,
  copyText
}
