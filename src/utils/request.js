import axios from 'axios';
import { Dialog as $dialog, Toast } from 'vant';

// 引入Loading组件和添加dom的方法
// import Loading from '@/components/Loading.vue';
import Dialog from '@/components/Dialog.vue';
import createDom from '@/utils/createDom';
// 引入判空的方法
import { getParamsFromUrl } from '@/utils/commonBase';
import { callAppMethod } from '@/utils/commonApp';

const clearAndLogin = () => {
  callAppMethod({
    callName: 'clearLoginInfo',
    parameters: '',
    callback: '',
  });
  callAppMethod({
    callName: 'toLogin',
    parameters: '',
    callback: '',
  });
};

const request = axios.create({
  baseURL: '',
  timeout: 15000,
  params: {
    dns: process.env.NODE_ENV === 'development' ? '011' : '208',
    imei: getParamsFromUrl('imei') || '123477',
    gtype: '9',
    attest: '-339418059',
  },
  withCredentials: true,
});

// ld为存放loading组件的变量，下边要用到组件里的方法，以及创建dom时添加到组件上的方法
let ld;
let alertDialog;
// num用于多个并发请求的计数
let num = 0;

// 响应拦截
function interceptorsResponse(res) {
  // console.log(res)
  num -= 1;
  if (num === 0) {
    ld.clear();
  }
  if (res.status === 200) {
    let resp;
    if (res.data.stat) {
      if (res.data.stat === '00') {
        if (res.data.body) {
          return res.data.body;
        }
        return res.data;
      }
      if (res.data.stat === '01' || res.data.stat === '02') {
        alertDialog = createDom(Dialog, {}, {
          title: '提示',
          content: res.data.result,
          confirmCallback() {
            clearAndLogin();
          },
        });
        return '0';
      }
      alertDialog = createDom(Dialog, {}, {
        title: '提示',
        content: res.data.result,
      });
      return '0';
    }
    if (res.data.code === '00') {
      if (typeof (res.data.data) === 'string') {
        resp = JSON.parse(res.data.data);
      }
      if (resp.stat === '00') {
        return resp.body;
      }
      return '0';
    }
    if (res.data.code === '-501') {
      alertDialog = createDom(Dialog, {}, {
        title: '提示',
        content: '登录检测失败，请重新登录',
        confirmCallback() {
          clearAndLogin();
        },
      });
    } else if (res.data.code === '-505') {
      alertDialog = createDom(Dialog, {}, {
        title: '提示',
        content: '发现您的账户在其他设备登录，如非本人操作请尽快更改您的登录密码',
        confirmCallback() {
          clearAndLogin();
        },
      });
    } else {
      // $dialog.alert({
      //   message: res.data.message,
      // });
      alertDialog = createDom(Dialog, {}, {
        title: '提示',
        content: res.data.message,
      });
      return '0';
    }
  }
  if (!alertDialog) {
    alertDialog = createDom(Dialog, {}, {
      title: '提示',
      content: '服务出错了，请稍后重试',
    });
    return '0';
  }
  return res;
}

// 异常拦截处理器
const errorHandler = (error) => {
  if(ld) ld.clear();
  // alertDialog = createDom(Dialog, {}, {
  //   title: '提示',
  //   content: '连接服务器出错了',
  //   confirmText: '知道了',
  // });
  $dialog.alert({
    message: '连接服务器出错了',
    confirmButtonText: '知道了',
  });
  // console.log(error);
  return Promise.reject(error);
};

// 请求拦截
function interceptorsRequest(config) {
  // 发送请求之前添加loading效果
  if (num === 0) {
    ld = Toast.loading({
      duration: 0,
      loadingType: 'spinner',
      message: '加载中',
      forbidClick: true,
    });
  }
  num += 1;
  return config;
}

// request interceptor
request.interceptors.request.use(interceptorsRequest, errorHandler);
// response interceptor
request.interceptors.response.use(interceptorsResponse, errorHandler);

function get(uri, parameter) {
  return request({
    url: uri,
    method: 'get',
    params: parameter,
  });
}

function post(uri, parameter) {
  return request({
    url: uri,
    method: 'post',
    data: parameter,
  });
}

export default request;
export {
  get,
  post,
};
