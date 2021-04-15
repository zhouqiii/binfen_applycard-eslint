// 本文件内函数为基础数据处理常用函数

/** 判空方法 */
const notNull = (obj) => {
  if (obj === null || obj === undefined || obj === 'undefined' || obj === '' || obj === '[]' || obj === '{}' || obj === {} || obj === []) {
    return false;
  }
  return true;
};

/*
 * 根据固定长度，添加符号
 * stringParams：要处理的字符串
 * flexLen:固定长度，数字类型
 * codeParams：要添加的符号
 */
function getStrByFlexFormat(strParams, flexLen, codeParams) {
  if (!notNull(strParams)) {
    return '';
  }
  let stringParams = String(strParams);
  const len = stringParams.length / flexLen;
  let numbers = '';
  for (let i = 0; i < len; i++) {
    const str = stringParams.substring(0, flexLen) + codeParams;
    numbers += str;
    stringParams = stringParams.substring(flexLen);
  }
  if (notNull(numbers)) {
    numbers = numbers.substring(0, numbers.length - 1);
  }
  return numbers;
}

/**
 * 金额格式化
 * num:要格式化的数字；三分以 , 分隔
 */
function numberFormat(num) {
  if (!notNull(num)) {
    return '';
  }
  const numbers = String(num);
  if (numbers.indexOf(',') > 0) {
    return numbers;
  }
  let numReverse;
  let str;
  let strReverse;
  if (numbers.indexOf('.') > 0) { // 有小数点
    const len = numbers.indexOf('.');
    const numBef = numbers.substring(0, len);
    const numAft = numbers.substring(len, numbers.length);
    numReverse = numBef.split('').reverse().join(''); // 将字符串顺序颠倒
    str = getStrByFlexFormat(numReverse, 3, ',');
    strReverse = str.split('').reverse().join(''); // 将字符串顺序颠倒
    strReverse += numAft;
  } else { // 无小数点
    numReverse = numbers.split('').reverse().join(''); // 将字符串顺序颠倒
    str = getStrByFlexFormat(numReverse, 3, ',');
    strReverse = str.split('').reverse().join(''); // 将字符串顺序颠倒
    strReverse += '.00';
  }
  return strReverse;
}

// 从url截取参数
function getParamsFromUrl(arg = '') {
  const url = window.location.href;
  let result = '';
  let arr;
  if (url.indexOf('?') <= 0) { // 路径没有参数,返回空 ''
    return result;
  }
  let paramsString = url.split('?')[1];
  if (paramsString) {
    const paramsObj = {};
    if (paramsString.indexOf('&amp;') > 0) {
      paramsString = paramsString.indexOf('#/') > -1 ? paramsString.replace(/#\//g, '&amp;') : paramsString;
      paramsString.split('&amp;').forEach((item) => {
        arr = item.split('=');
        paramsObj[arr[0]] = arr[1];
      });
    } else {
      paramsString = paramsString.indexOf('#/') > -1 ? paramsString.replace(/#\//g, '&') : paramsString;
      paramsString.split('&').forEach((item) => {
        arr = item.split('=');
        paramsObj[arr[0]] = arr[1];
      });
    }
    if (arg && paramsObj[arg]) {
      result = paramsObj[arg];
    } else {
      console.log('查询的参数不存在');
    }
  }
  return result;
}

/* 字符串复制
* text：需要复制的字符 */
function copyText(text) {
  const input = document.createElement('input');
  input.setAttribute('id', 'input_for_copyText');
  input.value = text;
  document.getElementsByTagName('body')[0].appendChild(input);
  document.getElementById('input_for_copyText').select();
  document.execCommand('copy');
  document.getElementById('input_for_copyText').remove();
}

/**
 * 将图片转成base64
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
    newImg.onload = function drawImage() {
      // console.log('进入方法111');
      canvas.width = width || newImg.width;
      canvas.height = height || newImg.height;
      if (newImg.width > 1024 && newImg.height > 768) {
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

/** 链接是否是转义过的
 * return：true:是 false：否
 * */
function urlIsEncode(urls1) {
  let isEncode = false;
  if (!notNull(urls1)) {
    return isEncode;
  }
  if (urls1.indexOf('%3A%2F%2F') > -1 || urls1.indexOf('%3F') > -1 || urls1.indexOf('%3D') > -1) {
    isEncode = true;
  }
  return isEncode;
}

function highPrecisionAdd(data1, data2) { // 加法
  let r1;
  let r2;
  // 获取每个参数的小数的位数
  try {
    r1 = data1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = data2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  // 计算底数为10以最大小数位数为次幂的值
  const m = Math.pow(10, Math.max(r1, r2));
  // 把所有参数转为整数后相加再除以次幂的值
  return (data1 * m + data2 * m) / m;
}

function highPrecisionReduce(data1, data2) { // 减法
  let r1;
  let r2;
  // 获取每个参数的小数的位数
  try {
    r1 = data1.toString().split('.')[1].length;
  } catch (e) {
    r1 = 0;
  }
  try {
    r2 = data2.toString().split('.')[1].length;
  } catch (e) {
    r2 = 0;
  }
  // 计算底数为10以最大小数位数为次幂的值
  const m = Math.pow(10, Math.max(r1, r2));
  // 精度长度以最大小数位数为长度
  const n = (r1 >= r2) ? r1 : r2;
  return ((data1 * m - data2 * m) / m).toFixed(n);
}

function highPrecisionMul(data1, data2) { // 乘法
  let m = 0;
  const s1 = data1.toString();
  const s2 = data2.toString();
  // 获取所有参数小数位长度之和
  try {
    m += s1.split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  try {
    m += s2.split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  // 替换掉小数点转为数字相乘再除以10的次幂值
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / Math.pow(10, m);
}

function highPrecisionDiv(data1, data2) { // 除法
  let t1 = 0;
  let t2 = 0;
  // 获取每个参数的小数的位数
  try {
    t1 = data1.toString().split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  try {
    t2 = data2.toString().split('.')[1].length;
  } catch (e) {
    console.log(e);
  }
  // 把所有参数的小数点去掉转为整数
  const r1 = Number(data1.toString().replace('.', ''));
  const r2 = Number(data2.toString().replace('.', ''));
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

// 金额保留两位小数，若不足两位则用0补足
function toDecimal2(x) {
  let f = parseFloat(x);
  if (Number.isNaN(f)) {
    return false;
  }
  f = Math.round(x * 100) / 100;
  let s = f.toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

/**
 * 3des 加密
 * @param buffer: 要加密的数据
 * @param radom: 随机数（后台随机数的前12位加自己生成的随机数的前12位）
 * @param iv: 偏移量（后台随机数的后4位加自己随机数的后4位）
 */
function get3DesData(testData, radom, iv) {
  const that = this;
  const testDataStr = JSON.stringify(testData);
  const key111 = that.CryptoJS.enc.Base64.parse(btoa(radom));
  const ivs = that.CryptoJS.enc.Utf8.parse(iv);
  const encrypted111 = that.CryptoJS.TripleDES.encrypt(testDataStr, key111, {
    iv: ivs,
    mode: that.CryptoJS.mode.CBC,
    padding: that.CryptoJS.pad.Pkcs7,
  });
  return encrypted111.toString();
}

/**
 * 私钥解密，解密之后 返回 utf8编码的字符串
 * @param buffer: Buffer object or base64 encoded string
 * @param privateKey: 解密用的私钥，格式是：pkcs8 pem
 * @param encoding: 加密之后的类型 buffer OR json, 默认是 buffer
 * @returns：默认返回值类型就是 encoding 的默认值，即 buffer
 */
function privateKeyDecrypt(buffer, privateKey, encoding = 'buffer') {
  const that = this;
  const key = new that.NodeRSA();
  key.setOptions({
    encryptionScheme: 'pkcs1', // 默认是：pkcs1_oaep，Java 端默认是 pkcs1, 这里做个修改
  });
  key.importKey(privateKey, 'pkcs8-private-pem');
  return key.decrypt(buffer, encoding);
}

/**
 * 公钥加密，加密之后以 BASE64 形式编码
 * @param buffer : 待加密内容 编码格式：utf-8
 * @param publicKey: 加密使用的公钥, 格式是：pkcs8 pem
 * @param encoding: 加密之后的输出编码类型 默认输出编码格式是：base64
 * @param source_encoding: 指定代加密内容的编码方式，默认是：utf-8
 * @returns: 返回以 BASE64 处理之后的加密内容
 */
function publicKeyEncrypt(buffer, pubicKey, encoding = 'base64', source_encoding = 'utf8') {
  const that = this;
  const key = new that.NodeRSA();
  key.setOptions({
    encryptionScheme: 'pkcs1', // 默认是：pkcs1_oaep，Java 端默认是 pkcs1, 这里做个修改
  });
  key.importKey(pubicKey, 'pkcs8-public-pem');
  return key.encrypt(buffer, encoding, source_encoding);
}

/** 生产固定位数的随机数
 * range:是可以改变的
 * */
function getRandom(range) {
  let str = '';
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  ];
  for (let i = 0; i < range; i++) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}

/**
 * 字符串替换
 * @param {Object} replaceBefore:要替换的字符串
 * @param {Object} replaceAfter:最终要替换的字符串
 * @param replaceBefore替换成replaceAfter
 */
function strReplace(str, replaceBefore, replaceAfter) {
  if (!this.notNull(str)) {
    return '';
  }
  let strData = str.toString();
  while (strData.indexOf(replaceBefore) !== -1) {
    strData = strData.replace(replaceBefore, replaceAfter);
  }
  return strData;
}

/* 从URL中提取giftno的方法
 * key：url中的关键词
 * urls：路径
 * */
function getGiftNo(key, urls) {
  if (notNull(key) && notNull(urls)) {
    if (urls.indexOf(key) > 0) {
      const newUrl = urls.split(key);
      return newUrl[1].substr(1);
    }
  }
  return '';
}

/**
 * 获取当前页面链接前缀
 */
function getLocationUrlPrefix() {
  let url = window.location.href;
  const arr = ['#/', '?'];
  arr.forEach((item) => {
    if (url.indexOf(item) > 0) {
      url = url.split(item)[0];
    }
  });
  return url;
}
/**
 * 截取字符串里面的参数
 * @param {Object} arg
 * @param {Object} urls，不是URL，是URL里面?后面的参数
 */
function getParamsFromLink(paramsString, arg = '') {
  if (paramsString) {
    const paramsObj = {};
    let result;
    let arr;
    if (paramsString.indexOf('&amp;') > 0) {
      result = paramsString.indexOf('#/') > -1 ? paramsString.replace(/#\//g, '&amp;') : paramsString;
      result.split('&amp;').forEach((item) => {
        arr = item.split('=');
        paramsObj[arr[0]] = arr[1];
      });
    } else {
      result = paramsString.indexOf('#/') > -1 ? paramsString.replace(/#\//g, '&') : paramsString;
      result.split('&').forEach((item) => {
        arr = item.split('=');
        paramsObj[arr[0]] = arr[1];
      });
    }
    if (arg && paramsObj[arg]) {
      return paramsObj[arg];
    }
  }
  return '';
}

/**
 * 截取URL里面的参数
 * @param {Object} arg
 * @param {Object} urls
 */
function getParamsFromOutUrl(urls, arg = '') {
  if (!notNull(urls) || urls.indexOf('?') <= 0) {
    return '';
  }
  const paramsString = urls.split('?')[1];
  return getParamsFromLink(paramsString, arg);
}

/* CNY, 人民币, 156, 2, GCS  ¥
** USD, 美元, 840, 2, GCS    $
** EUR, 欧元, 978, 2, GCS   €
** JPY, 日元, 392, 0, GCS    JPY
** GBP, 英镑, 826, 2, GCS    £
** HKD, 港币, 344, 2, GCS   HK$
** JMD, 牙买加元, 388, 2, GCS    J$  加元
** AUD, 澳大利亚元, 036, 2, GCS   $ 澳元 */
/**
 * 根据code查询返回相应的货币符号
 * @param code 货币代码
 */
function getCurrencySymbolByCode(code) {
  let symbol = '¥';
  switch (code) {
    case '840':
    case '036':
      symbol = '$';
      break;
    case '978':
      symbol = '€';
      break;
    case '392':
      symbol = 'JPY';
      break;
    case '826':
      symbol = '£';
      break;
    case '344':
      symbol = 'HK$';
      break;
    case '388':
      symbol = 'J$';
      break;
    default:
      symbol = '¥';
  }
  return symbol;
}

/**
 * 根据英文编码查询返回相应的货币符号
 * @param en 货币代码
 */
function getCurrencySymbolByEn(en) {
  let symbol = '¥';
  switch (en) {
    case 'USD':
    case 'AUD':
      symbol = '$';
      break;
    case 'EUR':
      symbol = '€';
      break;
    case 'JPY':
      symbol = 'JPY';
      break;
    case 'GBP':
      symbol = '£';
      break;
    case 'HKD':
      symbol = 'HK$';
      break;
    case 'JMD':
      symbol = 'J$';
      break;
    default:
      symbol = '¥';
  }
  return symbol;
}

/**
 * 根据中文编码查询返回相应的货币符号
 * @param cn 货币代码
 */
function getCurrencySymbolByCn(cn) {
  let symbol = '¥';
  switch (cn) {
    case '美元':
    case '澳元':
      symbol = '$';
      break;
    case '欧元':
      symbol = '€';
      break;
    case '日元':
      symbol = 'JPY';
      break;
    case '英镑':
      symbol = '£';
      break;
    case '港币':
      symbol = 'HK$';
      break;
    case '加元':
      symbol = 'J$';
      break;
    default:
      symbol = '¥';
  }
  return symbol;
}

export {
  notNull,
  getStrByFlexFormat,
  numberFormat,
  getParamsFromUrl,
  copyText,
  getBase64Image,
  urlIsEncode,
  highPrecisionAdd,
  highPrecisionReduce,
  highPrecisionMul,
  highPrecisionDiv,
  toDecimal2,
  get3DesData,
  privateKeyDecrypt,
  publicKeyEncrypt,
  getRandom,
  strReplace,
  getGiftNo,
  getParamsFromOutUrl,
  getLocationUrlPrefix,
  getCurrencySymbolByCode,
  getCurrencySymbolByEn,
  getCurrencySymbolByCn,
};
