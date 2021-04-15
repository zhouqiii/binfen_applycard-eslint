<template>
  <div class="noContent">
    <slot name="icon">
      <div>
        <img :src="srcUrl" class="img_icon" />
      </div>
    </slot>
    <slot name="txt">
      <template v-if="type == 0">
        <div>本期综合账单生成中</div>
        <div>您可在账单服务中查询单卡账单</div>
      </template>
      <template v-if="type == 1">
        <div>本期无账单</div>
      </template>
      <template v-if="type == 2">
        <div>公务卡、长城单位卡欠款不计入综合账单，</div>
        <div>请在账单服务中查询</div>
        <div class="no-btn"  @click="toBillService">账单服务</div>
      </template>
      <template v-if="type == 3">
        <div>网络不佳，请检查网络或刷新重试</div>
        <div class="no-btn-wrap" @click="reLoad">
          <img class="icon_reload" src="../assets/icons/icon_reload@3x.png" alt="重新获取">
          <span class="link">点击刷新</span>
        </div>
      </template>
      <template v-if="type == 4">
        <div>暂未查询到账单</div>
        <div>您可尝试重新获取</div>
        <div class="no-btn-wrap" @click="reLoad">
          <img class="icon_reload" src="../assets/icons/icon_reload@3x.png" alt="重新获取">
          <span class="link">重新获取</span>
        </div>
      </template>
    </slot>
  </div>
</template>

<script>
import bill from '../assets/images/no_bill@3x.png';
import bank from '../assets/images/no_bank@3x.png';
import wifi from '../assets/images/no_wifi@3x.png';
import not from '../assets/images/not_found@3x.png';

/* 图片部分可定制 icon
** 文字部分可定制 txt
** 默认图片imgList index 0账单生成中 1无账单  2无长城卡等 3无网络 4未查询到
** 图片用index获取
*/
export default {
  name: 'NoContent',
  data() {
    return {
      imgList: [
        bill,
        bill,
        bank,
        wifi,
        not,
      ],
    };
  },
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    reLoad() {
      this.$emit('reLoad', true);
      // console.log('按钮');
    },
    toBillService() {
      // 去账单服务页面
      this.$router.push('/About');
    },
  },
  computed: {
    srcUrl() {
      return this.imgList[this.type];
    },
  },
  created() {
    this.$nextTick(() => {
    });
  },
  mounted() {
  },
};
</script>
