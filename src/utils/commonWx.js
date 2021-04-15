import wx from 'jweixin-npm';
import { notNull } from './commonBase';

/* *小程序打开外部链接
 *wechatPaType参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,wechatOutEnter=跳转小程序外链
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * * */
function getWeShareLink(wechatPaType, wechatUrl, wechatEnParams, wechatModel = 'wechatOutEnter', wechatEntFlag = 'weProgram') {
  let urls = `/pages/index/index?wechatModel=${wechatModel}`;
  let wechatUrlEncode = wechatUrl;
  let wechatEnParamsEncode = wechatEnParams;
  if (wechatModel === 'wechatOutEnter') { // 如果model类型为外部链接
    wechatUrlEncode = encodeURIComponent(wechatUrl);
    urls += `&wechatUrl=${wechatUrlEncode}`;
  }
  if (wechatPaType === 3 || wechatPaType === 4) { // 对于多参数的判断
    wechatEnParamsEncode = encodeURIComponent(wechatEnParams);
  }
  if (wechatPaType !== 1) { // type为1是无参数
    urls += `&wechatEntParams=${wechatEnParamsEncode}`;
  }
  if (notNull(wechatEntFlag)) {
    urls += `&wechatEntFlag=${wechatEntFlag}`;
  }
  urls += `&wechatPaType=${wechatPaType}&wechatUrl=${wechatUrlEncode}&targetChannel=${this.channelFlag}`;
  return urls;
}

/* *小程序打开外部链接
 *wechatPaType参数类型：1.无参数 2.参数是单个  3.链接URL 4.多个参数
 *wechatUrl:跳转链接，必须转义，小程序打开三方页面，url放在此处
 * wechatModel:跳转模块,wechatOutEnter=跳转小程序外链
 * wechatEnParams：参数，根据wechatPaType参数类型传参数
 * wechatEntFlag：跳转标识 1：小程序中专页面 无：小程序首页
 * * */
function jumpToWeChatShareLink(wechatPaType, wechatUrl, wechatEnParams, wechatModel = 'wechatOutEnter', wechatEntFlag = 'weProgram') {
  const urls = getWeShareLink(wechatPaType, wechatUrl, wechatEnParams, wechatModel, wechatEntFlag);
  let smallPro = false;
  console.log(`小程序外链：${urls}`);
  // 判断当前页面是否在小程序环境中
  wx.miniProgram.getEnv((res) => {
    if (res.miniprogram) {
      smallPro = true;
    } else {
      smallPro = false;
    }
  });
  if (smallPro) {
    wx.miniProgram.reLaunch({
      // 跳转回小程序的页面
      url: urls,
      success() {
        console.log('success');
      },
      fail() {
        console.log('fail');
      },
    });
  } else {
    console.log('跳转失败了。。。');
  }
}

function getAppPhoneUrl(wechatPaType, wechatEnParams, wechatModel = 'wechatOutEnter', wechatEntFlag = 'weProgram') {
  let urls = `${this.shareLinkBefore}#/blankExcessPage?wechatModel=${wechatModel}`;
  let wechatEnParamsEncode = wechatEnParams;
  if (wechatPaType === 3 || wechatPaType === 4) { // 对于多参数的判断
    wechatEnParamsEncode = encodeURIComponent(wechatEnParams);
  }
  if (wechatPaType !== 1) { // type为1是无参数
    urls += `&wechatEntParams=${wechatEnParamsEncode}`;
  }
  if (notNull(wechatEntFlag)) {
    urls += `&wechatEntFlag=${wechatEntFlag}`;
  }
  urls += `&wechatPaType=${wechatPaType}`;
  return urls;
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
    appId: wxData.appId, // 公众号的唯一标识
    timestamp: wxData.timestamp, // 生产签名时间戳
    nonceStr: wxData.noncestr, // 生成签名随机串
    signature: wxData.signature, // 签名
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareWeibo'], // 需要使用的接口列表，表中分别为朋友圈，朋友和微博
  });
  wx.ready(() => {
    wx.onMenuShareTimeline({ // 分享到朋友圈
      title: shareTitle,
      desc: shareDes,
      link: shareUrl,
      imgUrl: shareImgUrl,
      success() { },
    });
    wx.onMenuShareAppMessage({ // 分享给朋友
      title: shareTitle, // 分享标题
      desc: shareDes, // 分享描述
      link: shareUrl, // 分享地址
      imgUrl: shareImgUrl, // 分享图标（绝对路径）
      success() { },
      trigger() { },
    });
    wx.onMenuShareWeibo({ // 分享到微博
      title: shareTitle,
      desc: shareDes,
      link: shareUrl,
      imgUrl: shareImgUrl,
      success() { },
    });
    //    wx.hideAllNonBaseMenuItem();
  });
  wx.error((err) => { // 分享配置失败会执行这里
    console.log(err);
  });
}

export {
  jumpToWeChatShareLink,
  getAppPhoneUrl,
  getWeShareLink,
  wxConfigCommon,
};
