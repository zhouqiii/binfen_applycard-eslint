<template>
  <div class="index">
    <!-- main Begin -->
    <div class="main">
      <div class="repay-title" @click="getData">
        <span class="date">10/20还款</span>
        <span class="txt">还款金额</span>
      </div>
      <div class="repay-amount">
        <span>{{ dataInfo.money | NumberFormat | MoneyUnit(dataInfo.unit) }}</span>
      </div>
      <div class="repay-type">
        <div class="btn active">全款还</div>
        <div class="btn">最低还</div>
      </div>
      <div class="last-block">
        <div class="content">
          <div class="title">剩余应还</div>
          <div class="amount">¥ 90,000,000.00</div>
          <div v-html="msg"></div>
          <div v-html="msg2"></div>
        </div>
        <div class="content">
          <div class="title">剩余应还</div>
          <div class="amount">¥ 90,000,000.00</div>
        </div>
      </div>
    </div>
    <!-- main End -->
    <!-- bankList Begin -->
    <div class="bank-list">
      <div class="bank-title">
        <div class="txt">银行卡2张 内容 {{ dataInfo.title }}</div>
        <van-icon @click="getBankInfo" name="warning-o" size="20" color="#999"/>
      </div>
      <div class="list-item">
        <div class="list-title">
          <div class="bank">6455 **** **** 3456</div>
          <div class="more">
            <div class="txt">交易明细</div>
            <van-icon name="arrow" color="#F44336" />
          </div>
        </div>
        <div class="list-block">
          <div class="list-main">
            <div class="title">剩余应还</div>
            <div class="amount">¥ 43,823.00</div>
          </div>
          <div class="list-main">
            <div class="title">剩余最低应还</div>
            <div class="amount">¥ 43,823.00</div>
          </div>
        </div>
      </div>
    </div>
    <!-- bankList End -->
  </div>
</template>

<script>
export default {
  name: 'HomeMain',
  data() {
    return {
      msg: "<a href='#Attribute' class='headerlink' title='Attribute' data-scroll=''>Attribute</a>",
    };
  },
  props: {
    dataInfo: {
      type: Object,
      default() {
        return { money: 111111 };
      },
    },
    msg2: {
      type: String,
      default: '',
    },
  },
  watch: {
    'dataInfo.title': {
      handler(val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal);
      },
      // immediate: true,
      // deep: true,
    },
  },
  methods: {
    getBankInfo() {
      this.$dialog.alert({
        message: '公务卡、长城单位卡欠款不计入综合账单，请在账单服务中查询',
        confirmButtonText: '知道了',
      }).then((res) => {
        console.log(`res:${res}`);
        if (res === 'confirm') {
          this.$toast('看见了');
        }
        if (res === 'cancel') {
          this.$toast('不关心');
        }
      });
    },
    getData() {
      this.$emit('getData');
    },
  },
  mounted() {
    // console.log('msg2', this.msg2);
  },
};
</script>

<style>
</style>
