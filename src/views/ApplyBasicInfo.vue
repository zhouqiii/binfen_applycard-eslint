<template>
    <div>
        <nav-bar-base title="我要申请-第一步" ref="nav" ifDialog='1'>
        </nav-bar-base>
        <div class="contentBody" v-show="showBody">
            <div class="applyAllCard">
              <!--把这里要展示的轮播图信息统一放在cardExp里，cardMsg是当前页面停留在的card信息-->
              <!--card信息展示部分-->
              <div>
                <div class="box_frame-row" style="margin:1rem 1rem .5rem 1rem">
                    <div @click="changeCardLeft()">
                      <svg-icon iconClass="left"></svg-icon>
                    </div>
                    <div style="width:40%;margin:auto;height:5.5rem">
                        <div><img :src="defaultPic"/></div>
                    </div>
                    <div @click="changeCardRight()">
                        <svg-icon iconClass="right"></svg-icon>
                    </div>
                </div>
                <div class="titleCardIndex">
                    <p class="titleCard">{{cardMsg.cardName}}</p>
                    <p class="cardNumber">{{cardMsg.cardIntro}}</p>
                </div>
              </div>
              <div style="padding:1% 3%;background:#fff">
                  <div style="height:1.5rem;line-height:1.5rem" class="box_frame-row">
                      <div class="exper">年费</div>
                      <div class="description"><span>{{cardMsg.cardCostStandardInfo}}</span></div>
                      <div @click="showNian(cardMsg.cardCostStandard)" class="btn">
                          <svg-icon iconClass="right"></svg-icon>
                      </div>
                  </div>
                  <div style="height:1.5rem;line-height:1.5rem" class="box_frame-row">
                      <div class="exper">权益</div>
                      <div class="description"><span>{{cardMsg.cardRightsInfo}}</span></div>
                      <div @click="showDescription(cardMsg.cardRights)" class="btn">
                          <svg-icon iconClass="right"></svg-icon>
                      </div>
                  </div>
              </div>
            </div>
            <!--card信息展示部分结束-->
            <div>
                <div class="formBox basicInfo">
                    <div><p class="titleCard">基本信息</p></div>
                    <div>
                        <van-form class="ruleForm">
                            <div class="formItem">
                                <van-field v-model="formData.chineseName"
                                    label="*中文姓名"
                                    placeholder="中文姓名"
                                    @blur="getPinYin"
                                    :error-message="errMsg.chineseName"
                                />
                                <!-- :error-message="errMsg.chineseName"    -->
                            </div>
                            <div class="formItem">
                                <van-field v-model="formData.chinesePinyin"
                                    label="*姓名拼音"
                                    placeholder="英文姓名"
                                    @blur="checkchinesePinyin"
                                    :error-message="errMsg.chinesePinyin"
                                />
                            </div>
                            <div class="formItem">
                                <van-field v-model="formData.idCard"
                                    label="*身份证号码"
                                    placeholder="身份证号"
                                    @blur="checkCard"
                                    :error-message="errMsg.idCard"
                                />
                            </div>
                             <div class="formItem"
                                style="display:flex;flex-direction:row;
                                       justify-content: space-between;"
                             >
                                <van-field v-model="formData.checkNumber"
                                    label="*手机验证码"
                                    class="idCardWidth"
                                    placeholder="验证码"
                                    @blur="checkCode"
                                    :error-message="errMsg.checkNumber"
                                    style="width:74%"
                                />
                                <div style="height: 1.5rem;line-height: 1.5rem;">
                                    <button class="checkNum"
                                        @click.prevent="timeStart()"
                                        :disabled="btnChangeEnable"
                                    >
                                        {{btnText}}
                                    </button>
                                </div>
                            </div>
                        </van-form>
                    </div>
                </div>
                <div class="agreeCheck">
                    <button class="submitBtn"
                        :disabled="btnAgree"
                        :style="thisStyle"
                        @click="submitMsg"
                    >
                        <span>同意协议并提交下一步</span>
                    </button>
                    <div style="font-size:0.8rem">
                        <p>
                            <input type="checkbox" id="check"
                                @change="getValue(this)"
                                :checked="checkAgree"
                            >
                            本人已阅读全部申请材料，充分了解并清楚知晓该信用卡的产品相关信息，愿意遵守
                            <span style="color:blue" @click="showContract" class="btn">
                                《中国银行股份有限公司信用卡领用合约》
                            </span>的各项规则。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '../assets/css/style/applybasicinfo.less';
import SvgIcon from '../components/SvgIcon.vue';
import pinyin from '../utils/myutils/chineseToPinYin';
import DialogMessage from '../components/MyComponents/DialogMessage.vue';
import createDom from '../utils/createDom';

const TIME_COUNT = 60;
export default {
  components: { SvgIcon },
  name: 'ApplyBasicInfo',
  data() {
    return {
      readDescription: { title: '', desc: '' }, // 《信用卡领用合约》标题和内容
      show: false,
      showBody: false,
      cardPage: '',
      CardExp: [],
      thisStyle: '',
      checkAgree: true,
      getpId: '',
      btnChangeEnable: false,
      btnAgree: true,
      title: '我要申请-第1步',
      countdown: '',
      btnText: '发送验证码',
      timer: null,
      showCount: false,
      cardMsg: '',
      defaultPic: '',
      formData: {
        chineseName: '', // 中文姓名
        chinesePinyin: '', // 姓名拼音
        checkNumber: '', // 验证码
        idCard: '', // 身份证号
      },
      flag: { // flag里的每一个属性对应一个输入框的校验,校验正确flag里该对应属性修改为true
        chineseName: false,
        chinesePinyin: false,
        checkNumber: false,
        idCard: false,
        agree: true,
      },
      errMsg: { // 输入框错误信息提示
        chineseName: '',
        chinesePinyin: '',
        idCard: '',
        checkNumber: '',
      },
    };
  },
  methods: {
    getHomeData() {
      this.requestAxios({
        url: '/api/cgi.do?txnId=2APO200012&dns=628&gtype=9&attest=-339418059&imei=124545',
        method: 'post',
        params: {
          cardId: JSON.parse(this.$route.query.cardId),
        },
      })
        .then((res) => {
          this.showBody = true;
          if (JSON.parse(res).stat === '00') {
            const data = JSON.parse(res).body;
            if (data) {
              this.cardMsg = data[0];// cardMsg放一类主标题，年费等信息
              this.CardExp = this.cardMsg.pics;// cardExp放卡面切换信息
              this.defaultPic = this.CardExp[0].url;// 当前页面停留在的卡面
              this.getpId = this.CardExp[0].picId;// 当前页面停留在的卡面唯一标识
            }
          } else {
            this.$toast('数据加载失败！');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 点击右边切换图片
    changeCardRight() {
      const len = this.CardExp.length;
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < len; i++) {
        if (this.getpId === this.CardExp[i].picId) {
          if (i === len - 1) {
            this.getpId = this.CardExp[0].picId;
            this.defaultPic = this.CardExp[0].url;
            break;
          } else {
            this.getpId = this.CardExp[i + 1].picId;
            this.defaultPic = this.CardExp[i + 1].url;
            break;
          }
        }
      }
    },
    // 点击左边切换图片
    changeCardLeft() {
      const len = this.CardExp.length;
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 0; i < len; i++) {
        if (this.getpId === this.CardExp[i].picId) {
          if (i === 0) {
            this.getpId = this.CardExp[len - 1].picId;
            this.defaultPic = this.CardExp[len - 1].url;
            break;
          } else {
            this.getpId = this.CardExp[i - 1].picId;
            this.defaultPic = this.CardExp[i - 1].url;
            break;
          }
        }
      }
    },
    // 点击按钮触发发送验证码计时器
    timeStart() {
      if (!this.timer) {
        this.countdown = TIME_COUNT;
        this.timer = setInterval(() => {
          if (this.countdown > 0 && this.countdown <= TIME_COUNT) {
            this.countdown -= 1;
            this.btnText = `${this.countdown}s后重发`;
            this.btnChangeEnable = true;
          } else {
            this.btnText = '发送验证码';
            clearInterval(this.timer);
            this.btnChangeEnable = false;
            this.timer = null;
          }
        }, 1000);
      }
    },
    // 输入中文姓名失焦事件
    getPinYin() {
      const chinese = new RegExp('[\u4E00-\u9FA5]+');
      if (!this.formData.chineseName) {
        this.errMsg.chineseName = '请填姓名！';
        this.flag.chineseName = false;
        return false;
      } if (!chinese.test(this.formData.chineseName)) {
        this.errMsg.chineseName = '请填汉字！';
        this.flag.chineseName = false;
        return false;
      }
      this.errMsg.chineseName = '';
      this.flag.chineseName = true;
      this.formData.chinesePinyin = pinyin.chineseToPinYin(this.formData.chineseName);
      this.checkchinesePinyin();
      return true;
    },
    // 输入姓名拼音失焦事件
    checkchinesePinyin() {
      const english = new RegExp('[A-Za-z]+');
      if (!this.formData.chinesePinyin) {
        this.errMsg.chinesePinyin = '请填姓名拼音！';
        this.flag.chinesePinyin = false;
        return false;
      } if (!english.test(this.formData.chinesePinyin)) {
        this.errMsg.chinesePinyin = '请填拼音！';
        this.flag.chinesePinyin = false;
        return false;
      }
      this.errMsg.chinesePinyin = '';
      this.flag.chinesePinyin = true;
      return true;
    },
    // 输入身份证号失焦事件
    checkCard() {
      // formRule.checkCard(this.formData.idCard,this.errMsg.idCard,this.flag.idCard)
      const zg = /^[0-9a-zA-Z]*$/;
      if (!this.formData.idCard) {
        this.errMsg.idCard = '请填身份证号！';
        this.flag.idCard = false;
        return false;
      } if (this.formData.idCard.length !== 18) {
        this.errMsg.idCard = '位数错误！';
        this.flag.idCard = false;
        return false;
      } if (!zg.test(this.formData.idCard)) { // 校验只能输入数字和字母
        this.errMsg.idCard = '格式错误！';
        this.flag.idCard = false;
        return false;
      }
      this.errMsg.idCard = '';
      this.flag.idCard = true;
      return true;
    },
    // 验证码输入失焦事件
    checkCode() {
      if (!this.formData.checkNumber) {
        this.errMsg.checkNumber = '请填验证码！';
        this.flag.checkNumber = false;
        return false;
      }
      this.errMsg.checkNumber = '';
      this.flag.checkNumber = true;
      return true;
    },
    // 同意协议checkbox改变时触发this.flag.agree改变
    getValue() {
      const check = document.getElementById('check');
      const value = check.checked;
      this.checkAgree = value;
      this.flag.agree = value;
    },
    // 同意协议提交下一步，对每个输入信息去空格键，然后缓存基本信息
    submitMsg() {
      const objOld = this.formData;
      const objNew = {};
      Object.keys(objOld).forEach((item) => {
        let data = objOld[item];
        data = data.toString();
        data = data.split(' ').join('');// 去空格键
        objNew[item] = data;
      });
      sessionStorage.setItem('basicData', JSON.stringify(objNew));// 转成字符串
      const msg = {};// 用来存储卡面信息
      msg.defaultPic = this.defaultPic;
      msg.cardName = this.cardMsg.cardName;
      msg.cardIntro = this.cardMsg.cardIntro;
      this.$router.push({
        name: 'ApplyAnoInfo',
        query: {
          cardId: this.$route.query.cardId,
          picId: JSON.stringify(this.getpId),
          data: JSON.stringify(msg),
        },
      });
    },
    // 显示《信用卡领用合约》弹框
    showContract() {
      // A2-2：实现了弹框滚动，已在弹框组件中标注实现方法
      createDom(
        DialogMessage,
        {},
        {
          title: '中国银行股份有限公司信用卡领用合约',
          content: `<div style='text-indent: 1.5em;'>甲方：中国银行股份有限公司信用卡主卡申请人/主卡持卡人/附属卡申请人/附属卡持卡人（如无特别说明，甲方指上述主体中的全部或任何一方）</div>
          <div style='text-indent: 1.5em;'>乙方：中国银行股份有限公司</div><div style='text-indent: 1.5em;'>基于甲方知悉、理解并遵守《中国银行股份有限公司信用卡章程》（以下简称“《章程》”）、本合约，甲方自愿向乙方申请使用中国银行股份有限公司信用卡（以下称“信用卡”），就信用卡的申领和使用等相关事宜，甲乙双方签订如下合约：</div>
          <div style='text-indent: 1.5em;'>第一条 申领</div></br><div style='text-indent: 1.5em;'> 1.甲方保证向乙方提供的所有申请资料真实、完整、准确、合法、有效，其中手机号码应与甲方一一对应，如有因甲方办理附属卡等使用同一手机号的合理情形，甲方应出具相关说明。无论申请成功与否，甲方同意乙方可以保留相关申请资料，无须退还。申请资料须由甲方本人亲自签名确认。</div>
          </br><div style='text-indent: 1.5em;'>甲方同意并授权，乙方有权出于相关信用卡业务（包括但不限于信用卡审批、用卡管理及风险评估与管理、为甲方提供服务）的需要，向个人信用信息基础数据库、公安部全国公民身份证号码查询服务中心、中国银联股份有公司信用卡。</div><div style='text-indent: 1.5em;'>第二条 申领</div></br><div style='text-indent: 1.5em;'> 1.甲方保证向乙方提供的所有申请资料真实、完整、准确、合法、有效，其中手机号码应与甲方一一对应，如有因甲方办理附属卡等使用同一手机号的合理情形，甲方应出具相关说明。无论申请成功与否，甲方同意乙方可以保留相关申请资料，
          无须退还。申请资料须由甲方本人亲自签名确认。</div>
          </br><div style='text-indent: 1.5em;'>甲方同意并授权，乙方有权出于相关信用卡业务（包括但不限于信用卡审批、用卡管理及风险评估与管理、为甲方提供服务）的需要，向个人信用信息基础数据库、公安部全国公民身份证号码查询服务中心、中国银联股份有公司信用卡。</div>
          `,
          classAno: '', // 绑定一个动态class，修改弹框的标题居中或者靠左
          show: false,
          paClassScroll: 'dialogScroll', // 绑定一个动态class，修改弹框的content部分，有滚动条的给固定长度，无滚动条的自适应
        },
      );
    },
    // 显示年费或权益弹框
    // 年费和权益后台传的id：年费=1，权益=0；
    // 所以index=0显示权益，index=1显示年费
    // 显示年费或权益弹框
    showDescription(content) {
      createDom(
        DialogMessage,
        {},
        {
          title: '权益说明:',
          content,
          classAno: 'introduction', // 绑定一个动态class，修改弹框的标题居中或者靠左
          show: false,
        },
      );
    },
    showNian(content) {
      createDom(
        DialogMessage,
        {},
        {
          title: '年费简介:',
          content,
          classAno: 'introduction', // 绑定一个动态class，修改弹框的标题居中或者靠左
          show: false,
        },
      );
    },

  },
  mounted() {
    this.getHomeData();
  },
  watch: {
    // 监听flag变化，这里flag里的每一个属性对应一个输入框的校验
    // 一个输入框校验正确，其对应的flag属性改为true，
    // 所有的输入框值校验正确，那么flag所有属性为true，此时可以点击同意按钮
    flag: {
      handler(newVal) {
        let flag = true;
        Object.keys(newVal).forEach((item) => {
          if (newVal[item] === false) {
            flag = false;
          }
        });
        if (flag) {
          this.thisStyle = 'background: rgb(165 29 29 / 93%);';
          this.btnAgree = false;
        } else {
          this.thisStyle = 'background: #d3d3d3';
          this.btnAgree = true;
        }
      },
      deep: true,
    },
  },
};
</script>
