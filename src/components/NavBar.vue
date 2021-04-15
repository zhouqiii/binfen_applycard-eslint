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
      default: '综合账单',
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
  },
  methods: {
    onClickRight() {
      this.$emit(this.opt, true);
      // console.log('按钮');
    },
    onClickLeft() {
      if (this.type === '1') {
        this.$router.go(-1);
      }
      if (this.type === '0') {
        callAppMethod({
          callName: 'lastGoBack',
        });
      }
    },
  },
};
</script>
