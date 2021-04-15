<template>
  <div class="payPwd">
    <van-popup
      v-model="show"
      round
      duration="0.2"
      position="bottom"
    >
      <div class="title">
        <van-icon @click="show = false"
        name="arrow-left" size="22" class="close" color="#444444"/>
        <div>{{title}}</div>
      </div>
      <slot name="amount">
        <div class="amount">{{amount}}</div>
      </slot>
      <!-- 密码输入框 -->
      <van-password-input
        :value="pwdVal"
      />
      <slot name="errInfo">
        <div class="error-info">
          <div class="error">{{errorInfo}}</div>
          <slot name="forgetPwd">
            <div class="forgetPwd" @click="forgetPwd">忘记支付密码</div>
          </slot>
        </div>
      </slot>
      <!-- 数字键盘 -->
      <div class="keyboard">
        <div class="key-wrap" v-for="index in 9"
        :key="index" @click="keyboard(index)" >
        {{index}}
        </div>
        <div class="key-wrap" @click="keyboard('.')">
          <div class="dot"></div>
        </div>
        <div class="key-wrap" @click="keyboard('0')">0</div>
        <div class="key-wrap" @click="keyboard('del')">
          <svg-icon icon-class="del"></svg-icon>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
/* 顶部标题可修改 props title
** 金额可修改 props amount 模块也可以定制
** 忘记密码点击事件 forgetPwd
** 密码输入成功事件 requestPwd
** 输入密码下方提示信息及忘记密码模块可定制 errInfo
** 忘记密码模块可以定制 forgetPwd
*/
export default {
  name: 'PaymentPassword',
  data() {
    return {
      show: false,
      errorInfo: '',
      pwdVal: '',
    };
  },
  props: {
    title: {
      type: String,
      default: '请输入缤纷生活支付密码',
    },
    amount: {
      type: String,
      default: '0',
    },
  },
  watch: {
  },
  computed: {
  },
  methods: {
    keyboard(val) {
      if (val === 'del') {
        if (this.pwdVal === '') return;
        this.pwdVal = this.pwdVal.slice(0, this.pwdVal.length - 1);
        console.log('this.pwdVal=', this.pwdVal);
      } else {
        if (this.pwdVal.length === 6) {
          // 支付密码请求事件
          this.$emit('requestPwd', this.pwdVal);
          return;
        }
        this.pwdVal += val;
      }
      console.log(this.pwdVal);
    },
    forgetPwd() {
      // 忘记密码事件绑定
      this.$emit('forgetPwd');
    },
  },
};
</script>

<style>
</style>
