<template>
    <div>
        <nav-bar-base title="查看审批进度" ref="nav">
        </nav-bar-base>
        <div class="cardListBox">
            <hot-card :images="images" CardBoxPatent="CardBoxList"
                :padActive="padActive"
                :borderActive='borderActive'
                :showApply="showApply"
                :showProgress="showProgressGive"
            >
                <template v-slot:hotTitle>{{cartList}}</template>
            </hot-card>
        </div>

    </div>
</template>
<script>

export default {
  name: 'ApprovalList',
  data() {
    return {
      images: [],
      cartList: '办卡列表',
      padActive: true,
      borderActive: true,
      showApply: false,
      showProgressGive: true,
    };
  },
  methods: {
    getHomeData() {
      this.requestAxios({
        // url: "/mock/index.json",
        url: '/api/cgi.do?txnId=2APO200014&dns=628&gtype=9&attest=-339418059&imei=124545',
        // data: {
        //     cardId: id,
        // },
        params: {
          usersId: 123456,
        },
        method: 'post',
      })
        .then((res) => {
          const timelist = [];
          const steplistText = [];
          const steplist = [];
          const data = JSON.parse(res.data);
          Array.prototype.forEach.call(data.body, (item) => {
            this.images.push(item.card);
            timelist.push(item.applyTime);
            if (parseInt(item.sendStep, 10) > 4) {
              this.$set(item, 'sendStep', '0');
            }
            steplist.push(item.sendStep);
            if (item.sendStep === '0') {
              this.$set(item, 'sendStep', '审批中');
            } if (item.sendStep === '1') {
              this.$set(item, 'sendStep', '物流邮寄中');
            } if (item.sendStep === '2') {
              this.$set(item, 'sendStep', '签收卡片');
            } if (item.sendStep === '3') {
              this.$set(item, 'sendStep', '已激活');
            } if (item.sendStep === '4') {
              this.$set(item, 'sendStep', '已使用');
            }
            steplistText.push(item.sendStep);
          });
          for (let i = 0; i < this.images.length; i++) {
            this.images[i].applyTime = timelist[i];
            this.images[i].progress = steplistText[i];
            this.images[i].line = steplist[i];
          }
          // this.images.push(Object.assign({},item,{applyTime:timelist[index]}))
          console.log(data.body);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    this.getHomeData();
  },
};
</script>
