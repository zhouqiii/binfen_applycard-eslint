import Vue from 'vue';
import
{
  NavBar, Popup, Dialog, Icon, Tab, Tabs, Picker, Toast,
  PasswordInput, NumberKeyboard,
}
  from 'vant';

import NavBarBase from '@/components/NavBar.vue';
import NoContent from '@/components/NoContent.vue';
import PaymentPassword from '@/components/PaymentPassword.vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/filter'; // global filter
import '@/assets/css/index.less';

// 引入自动化引入icons/svg文件夹下所有svg的js文件
import '@/assets/icons';

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
  .use(NumberKeyboard);

// 组件自己封装的公用组件
Vue.component('nav-bar-base', NavBarBase);
Vue.component('no-content', NoContent);
Vue.component('payment-password', PaymentPassword);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
