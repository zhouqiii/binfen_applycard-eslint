import axios from 'axios';

// 引入Loading组件和添加dom的方法
import Loading from '@/components/Loading.vue';
import { Dialog as $dialog } from 'vant';
import createDom from '@/utils/createDom';
// 引入判空的方法
import { callAppMethod } from '@/utils/commonApp';

export const instance = axios.create({
  baseURL: '', // process.env.NODE_ENV === 'development'?'https://alex188.cn/AppPrj1/cgi.do?txnId=2APO200001&dns=628&gtype=9&attest=-339418059&imei=124545':'/AppPrj',
  timeout: 15000,
});
let ld;

/** 添加请求拦截器 * */
instance.interceptors.request.use((config) => {
  ld = createDom(Loading);
  return config;
}, (error) => {
// 对请求错误做些什么
  Promise.reject(error);
});
/** 添加响应拦截器  * */
instance.interceptors.response.use((response) => {
  ld.hide();
  if (response.status === 200) {
    if (response.data.code === '00') {
      return Promise.resolve(response.data.data);
    } if (response.data.code === '-501' || response.data.code === '-505') {
      // 登录超时，需要调用客户端方法，进行登录
      callAppMethod({
        callName: 'toLogin',
      });
    } else {
      $dialog.alert({
        message: '请求异常！',
        confirmButtonText: '知道了',
      });
    }
    return Promise.resolve(response.data);
  }
  return Promise.reject(response.data.message);
}, (error) => {
  ld.hide();
  if (error.response) {
    return Promise.reject(error.response.data.message);
  }
  return Promise.reject(new Error('请求超时, 请刷新重试'));
});
/* 统一封装请求  */
export const requestAxios = ({
  url = '', data = {}, params = {}, method = 'post',
} = {}) => new Promise((resolve, reject) => {
  instance({
    url,
    data,
    params,
    method,
  })
    .then((response) => {
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
});
