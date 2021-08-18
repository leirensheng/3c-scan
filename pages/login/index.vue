<template>
  <div class="login">
    <image class="pic" mode="widthFix" src="/static/logo.png"></image>
    <div class="title">CCC认证智能识别工具</div>
    <div class="sub-title" v-if="!hasGetUser">
      您暂未授权CCC认证智能识别工具小程序获取你的信息，将无法正常使用小程序功能。如需正常使用，请点击“授权”按钮，打开头像、昵称等信息的授权。
    </div>

    <div class="bottom">
      <div class="agree" v-if="hasGetUser">
        <radio
          value="1"
          :checked="isAgree"
          style="transform: scale(0.6)"
          color="#327CF9"
          @click="clickAgreeRadio"
        /><span @click="clickAgreeRadio">我已阅读并同意质量抽检数据助手</span>
        <span class="xieyi" @click="gotoServiceAgreement">《用户协议》</span>
      </div>

      <button class="btn" v-if="!hasGetUser" 
      :disabled="!isReady"
      @click="login">授权登录</button>
      <button
        class="btn"
        v-else
        :disabled="!isAgree"
        open-type="getPhoneNumber"
        @getphonenumber="getPhoneNumber"
      >
        <image class="icon" mode="widthFix" src="/static/wechat.png"></image>
        <span>微信用户快捷登录</span>
      </button>

      <div class="btn-primary" @click="back">取消</div>
    </div>
  </div>
</template>

<script>
import { saveUserInfo, savePhone, saveCode } from "@/api/login.js";

import { getCode, newGetUserInfo, oldGetUserInfo } from "./login.js";
// import { saveCode } from "@/api/index.js";

export default {
  data() {
    return {
      hasGetUser: false,
      isAgree: false,
      code: "",
      isNewApi: false,
      loading: false,
      isReady:false
    };
  },
  watch: {
    loading(val) {
      if (val) {
        uni.showLoading({
          title: "正在加载",
        });
      } else {
        uni.hideLoading();
      }
    },
  },
  async onLoad() {
    this.loading = true;
    this.isNewApi = !!uni.getUserProfile;
    this.code = await getCode("weixin");
    await saveCode(this.code);
    this.isReady= true
    this.loading = false;
  },
  created() {},
  mounted() {},
  methods: {
    async getUserInfo() {
      let userinfoRes;
      if (this.isNewApi) {
        console.log("新获取");
        userinfoRes = await newGetUserInfo();
        let { encryptedData: userInfoEncryptedData, iv } = await oldGetUserInfo(
          "weixin"
        );
        userinfoRes.userProfileEncryptedData = userinfoRes.encryptedData;
        userinfoRes.userProfileIv = userinfoRes.iv;
        userinfoRes.userInfoEncryptedData = userInfoEncryptedData;
        userinfoRes.userInfoIv = iv;
      } else {
        console.log("旧获取");
        userinfoRes = await oldGetUserInfo("weixin");
        userinfoRes.userInfoEncryptedData = userinfoRes.encryptedData;
        userinfoRes.userInfoIv = userinfoRes.iv;
      }
      return userinfoRes;
    },
    getUser() {},
    // 授权
    async login() {
      // this.loading = true;
      try {
        let userinfoRes = await this.getUserInfo();
        userinfoRes.jsCode = this.code;
        const user = await saveUserInfo(userinfoRes);
        uni.setStorageSync("user", user);
        uni.setStorageSync("openId", user.openId);
        console.log("用户信息缓存成功");
        this.hasGetUser = true;
      } catch (e) {
        uni.clearStorageSync();
        console.log(e);
      }
      // this.loading = false;
    },
    // 获取手机号码
    getPhoneNumber(res) {
      let secretData = res.detail;
      let errMsg = res.detail.errMsg;
      if (errMsg.indexOf("fail") >= 0) {
        uni.showToast({
          icon: "none",
          title: "微信快捷登录失败：用户未授权",
        });
        return;
      }

      this.savePhone(secretData);
    },
    async savePhone(secretData) {
      secretData.openId = uni.getStorageSync("openId");
      secretData.jsCode = this.code;
      let data = await savePhone(secretData);
      uni.setStorageSync("bandPhone", data.phoneNumber);
      uni.setStorageSync("jsCode", this.code);
      console.log("手机号码缓存成功");
      uni.navigateBack();
    },
    // 服务协议
    gotoServiceAgreement() {
      uni.navigateTo({
        url: "/pages/serviceAgreement/index",
      });
    },
    // 点击同意单选框
    clickAgreeRadio() {
      this.isAgree = !this.isAgree;
    },
    back() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background-color: white;
  text-align: center;
  .pic {
    width: 160rpx;
    margin-top: 114rpx;
  }
  .title {
    font-weight: 500;
    color: #262626;
    line-height: 56rpx;
    font-size: 44rpx;
    margin-top: 32rpx;
  }
  .sub-title {
    font-size: 28rpx;
    line-height: 40rpx;
    color: #999999;
    width: 632rpx;
    margin: 0 auto;
    margin-top: 32rpx;
    text-align: justify;
    // text-align: left;
  }
  .bottom {
    margin-top: 94rpx;
  }
  .icon {
    width: 40rpx;
  }
  .agree {
    font-size: 28rpx;
    line-height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;

    color: #999999;
    .xieyi {
      color: #355dee;
    }
    //   margin-top: ;
  }
  .grey {
    background-color: rgb(241, 239, 239);
    color: #8d8e8e;
  }
  .btn,
  .btn-primary {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12rpx;
    width: 700rpx;
    margin: 0 auto;
    margin-top: 32rpx;
  }
}
</style>
