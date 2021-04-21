<template>
    <div class="home">
        <nav-bar-base title="信用卡全部卡片" ref="nav" type="0" @rightClick="shareGet">
          <template v-slot:right>
            <svg-icon iconClass="shareBold"></svg-icon>
          </template>
        </nav-bar-base>
        <div v-show="show">
          <div class="boxHomeSwip">
            <!--轮播图-->
            <swiper-card  :images="imagesSwip"></swiper-card>
            <!--畅销热卡-->
            <div class="boxHomeHot">
              <hot-card :images="images" :showApply="showApply" :showProgress="showProgressGive">
                  <template v-slot:hotTitle>{{hotTitle}}</template>
              </hot-card>
            </div>
          </div>
          <!--主题卡-->
          <special-card :cardMsg="cardMsgT" className="giveHeight" boxClassName="boxHeight">
            <template v-slot:specialTitle>{{specialTitle}}</template>
            <template v-slot:specialCard>
                <div class="box_frame marginbox">
                    <div style="margin:auto 2%">
                        <p class="titleCard">{{mainCard.cardName}}</p>
                        <p class="cardNumber">{{mainCard.cardIntro}}</p>
                    </div>
                    <div style="margin:1em auto;">
                        <img :src="mainCard.defaultPic"/>
                    </div>
                </div>
            </template>
          </special-card>
          <!--留学卡-->
          <special-card :cardMsg="cardShow" :className="flexWrap">
            <template v-slot:specialTitle>{{studyTitle}}</template>
          </special-card>
          <!--旅游卡-->
          <travel-card :travelList="travelListT">
              <template v-slot:travelTitle>{{travelTitle}}</template>
          </travel-card>
          <div class="bottomText">
            <p>中国信用信用卡伴你随行，让你的生活更美好</p>
          </div>
        </div>
    </div>
</template>
<script>
import '../assets/css/style/applyhome.less';
import SwiperCard from '../components/MyComponents/SwiperCard.vue';
import SpecialCard from '../components/MyComponents/SpecialCard.vue';
import TravelCard from '../components/MyComponents/TravelCard.vue';

export default {
  name: 'ApplyHome',
  components: {
    SwiperCard,
    SpecialCard,
    TravelCard,
  },
  data() {
    return {
      imagesSwip: [],
      images: [], // 畅销热卡
      showApply: true, // 是否显示申请按钮
      showProgressGive: false, // 是否显示进度按钮
      hotTitle: '畅销热卡',
      cardMsgT: [], // 主题卡右二
      specialTitle: '主题特色',
      mainCard: {}, // 主题卡左一
      cardShow: [], // 留学卡
      flexWrap: 'wrap',
      studyTitle: '留学必备',
      travelListT: [], // 旅游卡
      travelTitle: '旅游出行',
      show: false,
    };
  },
  methods: {
    shareGet() {
      this.$toast('分享内容');
    },
    getHomeData() {
      // 加载所有信用卡信息，与数据对应
      this.requestAxios({
        url: '/api/cgi.do?txnId=2APO200011&dns=628&gtype=9&attest=-339418059&imei=124545',
        method: 'post',
      })
        .then((res) => {
          if (JSON.parse(res).stat === '00') {
            this.getHomeDataSucc(JSON.parse(res).body);
          } else {
            this.$toast('数据加载失败！');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 在接口拿到数据后，在getHomeDataSucc给信用卡首页每个列表赋值
    getHomeDataSucc(res) {
      this.show = true;
      const arr = [];
      if (res.list) {
        Array.prototype.forEach.call(res.list, (item) => {
          if (item.type === '0') {
            this.images.push(item);
          } else if (item.type === '2') {
            this.cardShow.push(item);
          } else if (item.type === '1') {
            arr.push(item);
          } else if (item.type === '3') {
            this.travelListT.push(item);
          }
        });
        sessionStorage.setItem('hotcard', JSON.stringify(this.images));// 因为申请结果页面还有一个场营销热卡
        for (let i = 0; i < arr.length; i++) {
          if (i === 2) { // 主题卡分了两个，左边是maincard
            this.mainCard = arr[i];
          } else {
            this.cardMsgT.push(arr[i]);
          }
        }
      } if (res.pics) {
        this.imagesSwip = res.pics;// 轮播图
      }
    },
  },
  mounted() {
    this.getHomeData();
  },
};
</script>
