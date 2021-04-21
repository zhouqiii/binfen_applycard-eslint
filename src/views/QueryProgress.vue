<template>
    <div>
        <nav-bar-base title="进度查询" ref="nav">
        </nav-bar-base>
        <div class="cardListBox">
            <hot-card CardBoxPatent="CardBoxList"
                :borderActive='borderActive'
                :showApply="showApply"
                :showProgress="showProgressGive"
                :images="images"
                >
            </hot-card>
        </div>
        <div class="timeline">
            <div class="block">
                <van-steps direction="vertical"
                    :active="activeStep"
                    active-icon="checked"
                >
                    <van-step v-for="(activity, index) in activities " :key="index">
                        <div>{{activity.content}}</div>
                        <div>{{activity.timestamp}}</div>
                    </van-step>
                </van-steps>
            </div>
        </div>
    </div>
</template>
<script>
import { Step, Steps } from 'vant';

export default {
  name: 'QueryProgress',
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps,
  },
  data() {
    return {
      images: [],
      showApply: false,
      showProgressGive: false,
      iconClass: '',
      showIcon: false,
      activeStep: '-1',
      borderActive: true,
      msg: '',
      activeT: '',
      activities: [{ // 这里应该定义所有的审批状态，然后通过这张卡的状态改变其步骤样式
        content: '审批中',
        timestamp: '3020-22-33',
      }, {
        content: '物流邮寄中',
      }, {
        content: '签收卡片',
      }, {
        content: '已激活',
      }, {
        content: '已使用',
      }],

    };
  },
  methods: {
    checkData() {
      const msgGet = this.msg;
      this.images.push(msgGet);
      const step = msgGet.line;// 这里line是申请状态字段之后可以改成后台传过来的，比如约定0—审批通过，1-邮寄中，。。。
      if (step >= 0) {
        this.activeStep = step;
      }
    },
  },
  mounted() {
    this.msg = JSON.parse(this.$route.query.data);// 在页面渲染时，把申请列表里存的对应卡信息取出，这样在进度查询时可以直接展示对应的哪一张卡
    this.checkData();
  },
};
</script>

<style lang="less">
.timeline{
    margin-top: 1em;
    padding-top: 1em;
    padding-left: 3em;
    background: #ffffff;

}
//修改时间线样式
.van-step__circle{
    width: .6rem;
    height: .6rem;
    background-color: #919294;
}
.van-step__line{
    background-color: #919294;
}
.van-step{
    height: 3rem;
}
.van-icon{
    font-size:1.2rem;
    color:rgb(89 89 90)
}
.van-step--finish{
     color:rgb(89 89 90);
}
.van-step--vertical:not(:last-child)::after{
    border-bottom-width: 0;
}
.van-step--vertical{
    padding: 0.3125rem;
}
.van-step__title--active{
    color:rgb(89 89 90);
}
</style>
