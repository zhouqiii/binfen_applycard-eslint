<template>
  <div class="navbar">
    <van-nav-bar
      :title="title"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
      <template #left>
        <slot name="back">
          <van-icon name="arrow-left" size="22" />
        </slot>
      </template>
      <template #right>
        <slot name='right'></slot>
      </template>
    </van-nav-bar>
  </div>
</template>

<script>
import { callAppMethod } from '@/utils/commonApp';
import createDom from '../utils/createDom';
import DialogMessage from './MyComponents/DialogMessage.vue';
/* title
** onClickLeft 左侧按钮点击
** onClickRight 右侧按钮点击
*/
export default {
  name: 'NavBarBase',
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: '信用卡全部卡片',
    },
    // type的值：
    // '0':调用客户端的lastGoBack方法，关闭加载H5的webview
    // '1':返回当前项目的上级页面
    // '3':跳转到当前项目的指定页面
    type: {
      type: String,
      default: '1',
    },
    opt: {
      type: String,
      default: 'rightClick',
    },
    ifDialog: {
      type: String,
      default: '0',
    },
  },
  methods: {
    onClickRight() {
      this.$emit(this.opt, true);
      // console.log('按钮');
    },
    onClickLeft() {
      if (this.ifDialog === '1' && this.type === '1') {
        createDom(
          DialogMessage,
          {},
          {
            title: '不要走哦，就差一点就申请好了',
            content: '1、先消费后付款，可以分期可以提现金</br>2、生成良好的个人信用记录</br>3、累计积分，可以免费兑换礼物哦',
            classAno: '', // 绑定一个动态class，修改弹框的标题居中或者靠左
            show: true,
          },
        );
      } else {
        if (this.type === '1') {
          this.$router.go(-1);
        }
        if (this.type === '0') {
          callAppMethod({
            callName: 'lastGoBack',
          });
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.navbar{
  width: 100%;
  position: fixed;
  z-index: 1000;
  top:0;
}
</style>
