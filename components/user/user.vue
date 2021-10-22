<template>
  <div class="user-page">
    <div class="top">
      <div class="left">
        <div class="icon-wrap">
        <image class="icon" mode="widthFix" :src="src" @click="clickName" />
        </div>
        <span @click="clickName">{{ username }}</span>
      </div>
      <div class="right">
        <image class="cloud" mode="widthFix" src="/static/cloud.png" />
      </div>
    </div>
    <div class="history">
      <history :isShow="isShow" :isLogin="isLogin" @changeQuery="(val)=>$emit('changeQuery',val)"></history>
    </div>
    <div class="collect-part">
      <collect :isLogin="isLogin" :isShow="isShow"></collect>
    </div>
    <div class="tips">
      <span>如何拍照识别？</span>
      <span class="blue" @click="toHome">操作指南></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    src() {
      return this.isLogin ? this.user.avatar : "/static/no-user.svg";
    },
    username() {
      return this.isLogin ? this.user.nickName : "登录/注册";
    },
    isLogin() {
      return !!this.user;
    },
  },
  props: {
    user: {
      type: Object,
      default: null,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },

  created() {},

  methods: {
    clickName() {
      if (!this.isLogin) {
        this.$toLogin();
      }
    },
    toHome() {
      uni.redirectTo({
        url: "/pages/index/index",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.user-page {
  padding-bottom: calc(constant(safe-area-inset-bottom) + 150rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 150rpx);
  .top {
    background-color: white;
    height: 202rpx;
    display: flex;
    position: relative;
    .left {
      margin-left: 64rpx;
      margin-top: 66rpx;
      height: 90rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      color: #262626;
      .icon-wrap {
        border-radius: 50%;
        width: 90rpx;
        height: 90rpx;
        border: 1rpx solid rgb(213, 213, 213);
        margin-right: 30rpx;
        overflow: hidden;
        will-change: transform;
        .icon{
          width: 90rpx;
        }
      }
    }
    .right {
      position: absolute;
      right: 40rpx;
      bottom: 30rpx;
      .cloud {
        width: 236rpx;
      }
    }
  }
  .history,
  .collect-part {
    padding: 32rpx 24rpx;
  }
  .collect-part {
    padding-top: 0;
  }
  .tips {
    padding-right: 24rpx;
    display: flex;
    justify-content: center;
    color: #292929;
    font-size: 24rpx;
    // line-height: 40rpx;
    .blue {
      color: #355dee;
    }
  }
}
</style>
