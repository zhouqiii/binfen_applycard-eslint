// 本文件内函数为系统常用函数、H5与app原生交互函数、微信相关函数

import { getParamsFromUrl, notNull } from './commonBase';

// 判断当前操作系统及app版本
const APPSYS = () => {
  let s;
  const u = navigator.userAgent;
  const v = navigator.appVersion;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  if (isAndroid) {
    s = 'Android';
  } else if (isIOS) {
    s = 'IOS';
  } else {
    s = 'Android';
  }
  return {
    v,
    s,
  };
};

// 判断浏览器是否为IE
function isIE() {
  const bw = window.navigator.userAgent;
  const compare = (s) => bw.indexOf(s) >= 0;
  const ie11 = (() => 'ActiveXObject' in window)();
  return compare('MSIE') || ie11;
}

// 与缤纷生活的交互方法jsBridge
function setupWebViewJavascriptBridge(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      () => {
        callback(window.WebViewJavascriptBridge);
      },
      false,
    );
  }
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  const WVJBIframe = document.createElement('iframe');
  WVJBIframe.style.display = 'none';
  WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(() => {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
  return window.WVJBCallbacks;
}

// 调用app原生函数
const callAppMethod = (obj) => {
  const { callName = '', parameters = {}, callback = () => { } } = obj;
  if (!callName) {
    return;
  }
  setupWebViewJavascriptBridge((bridge) => {
    bridge.callHandler(callName, parameters, callback);
  });
};

/* 手机银行判断APP版本号 */
function versionCompare(version1, version2) {
  const v1 = version1.split('.');
  const v2 = version2.split('.');
  for (let i = 0; i < v1.length; i++) {
    if (v1[i] * 1 > v2[i] * 1) {
      return 1;
    }
    if (v1[i] * 1 < v2[i] * 1) {
      return -1;
    }
  }
  return 0;
}

/* 手机银行打开H5页面公共方法
 * url是跳转连接
 * name是头部名称
 */
function bocOpenPage(item) {
  // 通过Cordova方法去打开H5页面
  // 请求参数，JSON格式，如果不需要可以为空 ,url:是跳转的链接，name是头部名称
  const setting = {
    page: '1',
    url: item.urls,
    title: item.name,
  };
  /* c_plugins为引入的Cordova配置文件，
  * crcdMerchantBridge为Cordova配套文件的名称
  * goToNative为请求方法的名称
  * 请求交互方式为：请求方法名(成功返回方法，失败返回方法，请求参数) */
  this.c_plugins.crcdMerchantBridge.goToNative((data) => {
    console.log(data);
    // success callback
  }, (err) => {
    console.log(err);
    // error callback
  }, setting);
}

/* *手机银行APP下载方法 */
function bocAppDownLoad() {
  const urls = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chinamworld.bocmbci';
  window.location.href = urls;
}

function bocAppDownLoad2() {
  let url = window.location.href;
  url = url.replace(/isShareLink/g, 'placeholder');
  const urlData = { url };
  const baseUrl = 'bocmbciphone://h5/promotionPage?gctExtraParams=';
  const txBaseUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.chinamworld.bocmbci';
  const userUrl = encodeURIComponent(JSON.stringify(urlData));
  const endUrl = encodeURIComponent(`${baseUrl}${userUrl}`);
  const txUrl = `${txBaseUrl}&android_scheme=${endUrl}&ios_scheme=${endUrl}`;
  return txUrl;
}

/* 是否显示下载条
 * true:显示，false：不显示
 */
function isShowDownloadDiv(channelFlag) {
  let isDownLoad = false;
  const Navigator = navigator.userAgent.toLowerCase();
  const isWx = Navigator.match(/MicroMessenger/i) === 'micromessenger';
  const isWeibo = Navigator.match(/weibo/i) === 'weibo';
  const downloadTitle = getParamsFromUrl('downloadTitle');
  if (channelFlag === '3' || channelFlag === '4') { // 微信公众号和小程序，不显示下载条
    isDownLoad = false;
  } else if (isWx || isWeibo || downloadTitle === '1') {
    isDownLoad = true;
  }
  return isDownLoad;
}

/* 是否显示顶部标题
 * @return true:显示，false:不显示
 * */
function isShowTopTitles() {
  const shareLen = window.location.href.indexOf('/share');
  const shareLens = window.location.href.indexOf('/mainPageShare');
  const fromLen = window.location.href.indexOf('&from');
  if (shareLens > 0 || shareLen >= 0 || fromLen > 0) {
    return false;
  }
  return true;
}

/**
 * 是否在APP内
 * @return:false:不在APP内 true:在APP内
 */
function isInApp(channel) {
  let result = true;
  const Navigator = navigator.userAgent.toLowerCase();
  const isWx = Navigator.match(/MicroMessenger/i) === 'micromessenger';
  const isWeibo = Navigator.match(/weibo/i) === 'weibo';
  if (channel === '3' || channel === '4' || channel === '6') { // 3-微信公众 4-小程序
    result = true;
  } else if (isWx || isWeibo) {
    result = false;
  }
  return result;
}

/* 与客户端交互 */
function gotoApp(parameter) {
  callAppMethod({
    callName: 'goBannerModel',
    parameters: parameter,
  });
}

/* 跳转客户端登录 */
function gotoLogin() {
  callAppMethod({
    callName: 'toLogin',
  });
}

/* 请求超时-跳转客户端登录 */
function gotoLoginByTimeOut() {
  callAppMethod({
    callName: 'clearLoginInfo',
  });
  gotoLogin();
}

/* *android打开app 地址
 * @AppConfig
 * @ifChrome
 * */
function getAndroidSchema(AppConfig, ifChrome) {
  let schemaStr = 'mlife/open?a=test';
  if (ifChrome) {
    schemaStr = `intent://${schemaStr}#Intent;scheme=${AppConfig.scheme};package=${AppConfig.package};category=${AppConfig.category};S.browser_fallback_url=${encodeURIComponent(AppConfig.FAILBACK_ANDROID)};end`;
  } else {
    schemaStr = 'boc://mlife/open';
  }
  return schemaStr;
}

/* *与客户端进行交互
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
   actIsHtml5=0跳转app本地模块  —>type

   actIsLogin=1 需要登录
   actIsLogin=0 不需要登录   —> 新增拼接参数 ->isLogin

   actUrl 是模块id，可为空        —>uiJumpId

   actDetailsId 模块详情id      —>uiParmValue
   在actIsHtml5=1时，需要增加下面的参数

   actHtml5Type 跳转H5类型      —>actHtml5Type(新增)
   actHtml5Url   跳转H5地址    —>jumpURLStr
*/
function openApp(userParameters) {
  // 判断浏览器
  const Navigator = navigator.userAgent;
  const ifChrome = Navigator.match(/Chrome/i) != null && Navigator.match(/Version\/\d+\.\d+(\.\d+)?\sChrome\//i) == null;
  const ifAndroid = Navigator.match(/(Android);?[\s/]+([\d.]+)?/);
  const ifiPad = Navigator.match(/(iPad).*OS\s([\d_]+)/);
  const ifiPhone = !ifiPad && Navigator.match(/(iPhone\sOS)\s([\d_]+)/);
  // const ifSafari = (ifiPhone || ifiPad) && Navigator.match(/Safari/);
  // let version = 0;
  // if (ifSafari) version = Navigator.match(/Version\/([\d.]+)/);
  // safari浏览器版本
  // version = parseFloat(version[1], 10);
  // 是否从微信打开
  const ifWeixin = navigator.userAgent.indexOf('MicroMessenger') >= 0; // weixin
  let bocSchemeUrl = 'mlife';
  let loadTimer;
  // 拼接自定义参数
  if (!notNull(userParameters)) {
    bocSchemeUrl += '?';
    bocSchemeUrl = Object.keys(userParameters).map((item) => {
      const param = (userParameters[item] !== undefined && userParameters[item] !== 'undefined')
        ? userParameters[item] : '';
      bocSchemeUrl += `${item}=${param}&`;
      return bocSchemeUrl;
    });
    bocSchemeUrl = bocSchemeUrl.replace(/\\&$/, '');
  }
  const encodeParams = encodeURIComponent(bocSchemeUrl);
  const baseUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.forms';
  // 由安卓APP提供
  const AppConfig = {
    scheme: 'boc',
    host: 'mlife',
    package: 'com.forms',
    action: 'android.intent.action.VIEW',
    category: 'android.intent.category.BROWSABLE',
    FAILBACK_ANDROID: `${baseUrl}&android_schema=boc://${encodeParams}`, // 安卓下载地址--应用宝下载地址
    FAILBACK_IOS: `${baseUrl}&ios_scheme=bocMlife://${encodeParams}`, // ios下载地址--应用宝下载地址
  };

  if (ifAndroid) {
    // let s = getAndroidSchema(AppConfig, ifChrome);
    if (ifChrome) { // chrome会自动识别S.browser_fallback_url如果没有安装则打开下载链接地址
      //      window.location.href = s;
      window.location.href = AppConfig.FAILBACK_ANDROID;
    } else if (ifWeixin) { // 微信无法打开APP，跳转到下载页面//ld---跳转到应用宝下载链接
      window.location.href = AppConfig.FAILBACK_ANDROID;
    } else { // 其他浏览器3秒内没打开则跳转到下载链接
      window.location.href = AppConfig.FAILBACK_ANDROID;
      //      window.location.href = s;
      //      let start = Date.now();
      //      // 如果页面在后台运行返回，如果超过3秒没有打开APP，则没有安装，跳转到应用市场
      //      loadTimer = setTimeout(function() {
      //        if(document.hidden || document.webkitHidden) {
      //          return;
      //        }
      //        if(Date.now() - start <= 3000 + 200) {
      //          //设置下载按钮的地址
      //          if(location.port) {
      //      location.href = 'https://mlife.jf365.boc.cn/AppPrj/download.html';
      //          } else {
      //      location.href = 'https://mlife.jf365.boc.cn/AppPrj/download.html';
      //          }
      //        } else {}
      //      }, 3000);
    }
    // 当页面在后台运行时清空定时器防止页面跳转到下载页
    const visibilitychange = () => {
      const tag = document.hidden || document.webkitHidden;
      if (tag) clearTimeout(loadTimer);
    };
    document.addEventListener('visibilitychange', visibilitychange, false);
    document.addEventListener('webkitvisibilitychange', visibilitychange, false);
    window.addEventListener('pagehide', () => {
      clearTimeout(loadTimer);
    }, false);
  }

  if (ifiPhone) {
    if (ifWeixin) {
      window.location.href = AppConfig.FAILBACK_IOS;
    } else {
      window.location.href = AppConfig.FAILBACK_IOS;
      //      window.location.href = 'boc://mlife/open';
      //      let start = Date.now();
      //      // 如果页面在后台运行返回，如果超过3秒没有打开APP，则没有安装，跳转到IOS应用市场
      //      loadTimer = setTimeout(function() {
      //        if(document.hidden || document.webkitHidden) {
      //          return;
      //        }
      //        if(Date.now() - start > 3000 + 200) {
      //
      //        } else {
      //          //设置下载按钮的地址
      //          if(location.port) {
      //      location.href = "https://mlife.jf365.boc.cn/AppPrj/download.html";
      //          } else {
      //      location.href = "https://mlife.jf365.boc.cn/AppPrj/download.html";
      //          }
      //        }
      //      }, 3000);
    }
    // 当页面在后台运行时清空定时器防止页面跳转到下载页
    const visibilitychange = () => {
      const tag = document.hidden || document.webkitHidden;
      if (tag) clearTimeout(loadTimer);
    };
    document.addEventListener('visibilitychange', visibilitychange, false);
    document.addEventListener('webkitvisibilitychange', visibilitychange, false);
    window.addEventListener('pagehide', () => {
      clearTimeout(loadTimer);
    }, false);
  }
}

/*
 * 此方法默认打开缤纷生活
 * urlAfter:链接后缀，如?#/orderListMLifePage
 */
function openMlifeAppByParams(urlAfter) {
  let uiJumpUrl = 'https://mlife.jf365.boc.cn/mlife/mobilelife/html5/107/ColorfulLife_motionHealth_XW/index.html';
  if (notNull(urlAfter)) {
    uiJumpUrl += urlAfter;
  }
  uiJumpUrl = encodeURIComponent(uiJumpUrl);
  const actConfig = {
    type: '1',
    uiJumpId: '190001',
    uiJumpChildId: '',
    tip: '',
    uiName: '',
    uiJumpUrl: '',
    uiParmValue: uiJumpUrl,
  };
  openApp(actConfig);
}

/* 区分是APP内调用还是微信调用
 * @actConfig:微信使用
 * @parameters：APP使用
 * */
function gotoCommonClick(actConfig, parameters) {
  console.log('==gotoCommonClick==');
  const isWx = navigator.userAgent.toLowerCase().match(/MicroMessenger/i) === 'micromessenger';
  const isWeibo = navigator.userAgent.toLowerCase().match(/weibo/i) === 'weibo';
  if (isWx || isWeibo) {
    openApp(actConfig);
  } else {
    gotoApp(parameters);
  }
}

/* *
 * 封装点击事件
 * @type：1-app,2-h5
 * @uiJumpId:功能id
 * @titleName:标题名称
 * @uiJumpUrl:2的时候传：H5-URL
 * @uiParmValue:参数
 * */
function itemClickParams(type, uiJumpId, titleName, uiJumpUrl, uiParmValue) {
  // console.log(...arguments);
  // console.log('==itemClickParams==');
  // 应用包打开使用
  const actConfig = {
    type,
    uiJumpId,
    uiJumpChildId: '',
    tip: '',
    uiName: titleName,
    uiJumpUrl,
    uiParmValue,
  };
  // app内使用
  const parameters = {
    uiIcon: '',
    uiIconUrl: '',
    uiJump: type,
    uiJumpId,
    uiName: titleName,
    uiSeq: '',
    uiJumpUrl,
    uiParmValue,
  };
  gotoCommonClick(actConfig, parameters);
}

export {
  APPSYS,
  isIE,
  callAppMethod,
  versionCompare,
  bocOpenPage,
  bocAppDownLoad,
  bocAppDownLoad2,
  isShowDownloadDiv,
  isShowTopTitles,
  isInApp,
  gotoApp,
  gotoLogin,
  gotoLoginByTimeOut,
  openMlifeAppByParams,
  gotoCommonClick,
  getAndroidSchema,
  itemClickParams,
};
