import Vue from 'vue';
import
{
  NavBar, Popup, Dialog, Icon, Tab, Tabs, Picker, Toast,
  PasswordInput, NumberKeyboard, Form, Field, Calendar,
}
  from 'vant';

import NavBarBase from '@/components/NavBar.vue';
import NoContent from '@/components/NoContent.vue';
import PaymentPassword from '@/components/PaymentPassword.vue';
import { requestAxios } from '@/utils/myutils/axios';
import HotCard from '@/components/MyComponents/HotCard.vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/filter'; // global filter
import './assets/css/style/common.less';

// 引入自动化引入icons/svg文件夹下所有svg的js文件
import '@/assets/icons';
// 全局引入封装的axios

// 注册vant使用的组件
Vue.use(NavBar)
  .use(Popup)
  .use(Dialog)
  .use(Icon)
  .use(Tab)
  .use(Tabs)
  .use(Picker)
  .use(Toast)
  .use(PasswordInput)
  .use(NumberKeyboard)
  .use(Form)
  .use(Field)
  .use(Calendar);

// 组件自己封装的公用组件
Vue.component('nav-bar-base', NavBarBase);
Vue.component('no-content', NoContent);
Vue.component('payment-password', PaymentPassword);
Vue.component('hot-card', HotCard);

// 全局引入封装的axios
Vue.prototype.requestAxios = requestAxios;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
