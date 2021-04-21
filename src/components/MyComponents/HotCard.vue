<template>
    <div>
        <div :class="CardBox">
            <div>
                <p class="cardTitle" :class="{ active: isActive }" >
                    <slot name="hotTitle"></slot>
                </p>
            </div>
            <div class="box_frame cart" v-for="(image, index) in images"
              :class="{activeBox: borActive}"
              :key="index"
            >
                <p v-if="showTime" class="cardNumber" style="margin-bottom:.8em">
                  申请时间： {{image.applyTime}}
                </p>
                <div class="card" >
                    <div style="width:25%">
                        <img :src="image.defaultPic"/>
                    </div>
                    <div style="width:62%;margin:auto 0% auto 3%">
                        <p class="titleCard">{{image.cardName}}</p>
                        <p class="cardNumber">{{image.cardIntro}}</p>
                    </div>
                    <div style="margin:auto" v-if="showApplyGet">
                        <div class="applyCard" @click="gotoApplyPage(image.cardId)">
                            申请
                        </div>
                    </div>
                     <div style="margin:auto"  v-if="showProgressGet">
                        <div class="applyProgress" @click="gotoProgress(image)">
                            {{image.progress}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '../../assets/css/style/hotCard.less';

export default {
  name: 'HotCard',
  props: ['images', // 数据
    'CardBoxPatent', // 动态class
    'padActive', // 动态class
    'borderActive', // 动态class
    'showApply', // 显示申请按钮
    'showProgress', // 显示进度按钮
  ],
  data() {
    return {
      CardBox: this.CardBoxPatent,
      isActive: this.padActive,
      showTime: true,
      borActive: this.borderActive,
      showApplyGet: this.showApply,
      showProgressGet: this.showProgress,
    };
  },
  computed: {
  },
  methods: {
    gotoApplyPage(id) {
      this.$router.push({
        name: 'ApplyBasicInfo',
        query: {
          cardId: JSON.stringify(id),
        },
      });
    },
    // 点击进度按钮，进入进度查询时间轴
    gotoProgress(res) {
      this.$router.push({
        name: 'QueryProgress',
        query: {
          data: JSON.stringify(res),
        },
      });
    },
  },
  watch: {
    // 为了组件复用，首页的热卡列表没有时间展示，申请列表有时间展示，在这里判断该组件是否展示时间
    // 这里的逻辑是当传的数据有时间字段时就展示时间，之后可以改成绑定v-if
    images() {
      Array.prototype.forEach.call(this.images, (item) => {
        if (!item.applyTime) {
          this.showTime = false;
        }
      });
    },
  },

};
</script>
