<template>
  <div class="home">
    <nav-bar-base title="综合账单" ref="nav" @rightClick="showPicker = true">
      <template v-slot:right>
        <span>10月账单</span>
        <van-icon name="arrow-down" color="#333333" />
      </template>
    </nav-bar-base>
    <no-content v-if="tabList.length < 1 || !onLine" :type='type' @reLoad="getData"></no-content>
    <template v-if="tabList.length >= 1 && onLine">
      <template v-if="tabList.length == 1">
        <home-mian :dataInfo="dataObj"></home-mian>
      </template>
      <van-tabs v-else @click="onClick" sticky>
        <van-tab v-for="(key, index) in tabList" :key="key" :dot="index > 3" :title="key">
          <home-mian :dataInfo="dataObj"></home-mian>
        </van-tab>
      </van-tabs>
      <!-- bottom fix formssi-btn Begin-->
      <div class="bottom-fixed">
        <div class="formssi-btn disabled" @click="payPwd">一键还款</div>
      </div>
      <!-- bottom fix formssi-btn Begin-->
    </template>
    <payment-password
    ref="popPwd"
    @forgetPwd="forgetPwd"
    @requestPwd="requestPwd"
    :amount="amount">
    <!-- v-slot:amount amount 模块显示内容控制 -->
    <!-- v-slot:errInfo errInfo 模块显示内容控制 -->
    <!-- v-slot:forgetPwd forgetPwd 模块显示内容控制 -->
    </payment-password>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        title="请选择账期"
        confirm-button-text="确定"
        visible-item-count="5"
        :default-index="2"
        :columns="tabList"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
// @ is an alias to /src
// import { getList } from '@/api/index';
import { getCurrencySymbolByCode } from '@/utils/commonBase';
import { APPSYS } from '@/utils/commonApp';
import HomeMian from './template/HomeMian.vue';

export default {
  name: 'Home',
  data() {
    return {
      colorGray: '#333',
      showPicker: false,
      tabList: ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华', '衢州'],
      onLine: navigator.onLine, // 判断是否断网
      code: '388',
      dataObj: {
        money: 3333333,
        unit: '11$',
        title: '',
      },
      msg2: `<p style="color:red;">中银数字信用卡是中国银行推出的无实体介质卡片，免去繁琐的交付环节。</p ><br />
      ★2020年12月24日-2021年3月31日，使用中银数字信用卡金卡、中银数字信用卡白金卡、中银数字ETC卡通过微信支付、支付宝、京东支付、唯品会、美团快捷支付消费，每消费人民币1元可累计中国银行信用卡交易积分3积分。
      每名持卡人每月最多获得5万积分奖励。详见“中国银行信用卡”微信公众。
      ★尊享银联白金信用卡礼遇，详见云闪付APP权益精选介绍。`,
      showPwd: false,
      amount: '¥23797239287492',
    };
  },
  components: {
    HomeMian,
  },
  methods: {
    getData() {
      // 重新请求数据
      this.$toast.loading({
        duration: 0,
        loadingType: 'spinner',
        message: '加载中',
        forbidClick: true,
      });
      setTimeout(() => {
        this.$toast.clear();
      }, 1000);
      // getList().then(() => {
      //   // this.$dialog.alert({ message: res });
      // });
    },
    onConfirm(value, index) {
      console.log('onConfirm,', value, index);
    },
    onCancel() {

    },
    onChange(picker, value, index) {
      console.log(`'picker='${picker},'value='${value},'index='${index}`);
    },
    updateOnlineStatus(e) {
      const { type } = e;
      this.onLine = type === 'online';
      if (!this.onLine) {
        this.type = 3;
      }
    },
    onClick(name, title) {
      this.$set(this.dataObj, 'title', title);
      this.dataObj.unit = `${getCurrencySymbolByCode(this.code)}'货币符号'`;
      // console.log('dataObj,', this.dataObj.unit);
    },
    payPwd() {
      this.$refs.popPwd.show = true;
    },
    forgetPwd() {
    },
    requestPwd() {
    },
  },
  computed: {

  },
  created() {
    this.$nextTick(() => {
      console.log(APPSYS().s);
    });
  },
  mounted() {
    window.addEventListener('online', this.updateOnlineStatus);
    window.addEventListener('offline', this.updateOnlineStatus);
  },
  beforeDestroy() {
    window.removeEventListener('online', this.updateOnlineStatus);
    window.removeEventListener('offline', this.updateOnlineStatus);
  },
};
</script>
<style lang="less">

</style>
