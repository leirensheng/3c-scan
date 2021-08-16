<template>
  <div class="home-wrap">
    <div class="home">
      <div class="title">欢迎使用CCC产品标签智能识别</div>
      <div class="sub-title">* 适用于玩具（2202）及童车类产品（2201）查询</div>
      <div class="pic-content">
        <image class="pic" src="/static/home.png" mode="widthFix" />
        <div class="desc">* 请拍取产品标签</div>
      </div>
      <div class="bottom">
        <div class="left">广州海关技术中心</div>
        <div class="right">
          <div>消费者报道杂志社有限公司</div>
          <div>正选™数据中心</div>
        </div>
      </div>
    </div>

    <uni-tabbar :isLogin="isLogin" isInIndex @change="handleTabChange"></uni-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLogin:false
    };
  },
  async onShow(){
   this.isLogin = await this.$checkLogin()
  },
  created() {},
  mounted() {},
  methods: {
    handleTabChange(tab) {
      uni.navigateTo({
        url: "/pages/main/index?tab=" + tab,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home-wrap {
  background-color: white;
  height: 100%;
}
.home {
  background-color: white;
  text-align: center;
  padding-top: 30px;
  .title {
    font-size: 44rpx;
    line-height: 56rpx;
    font-weight: 500;
    color: #262626;
  }
  .sub-title {
    margin-top: 14rpx;
    font-size: 28rpx;
    line-height: 34rpx;
    font-weight: 400;
    color: #999999;
  }
  .pic-content {
    // padding: 0 24rpx;
    margin-top: 36rpx;
    margin-left: 12rpx;
    position: relative;
    .pic{
      width: 100%
    }
    .desc {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 96rpx;
      font-size: 28rpx;
      color: white;
    }
  }
  .bottom {
    margin-top: 30rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 28rpx;
    color: #999999;
    font-size: 24rpx;
//     @media screen and (max-width: 376px) {
//         font-size: 24rpx !important
// }
  .left{
    width: 50%;
    padding-right: 30rpx;
    text-align: right;
  }
    .right {
      width: 50%;
      padding-left: 30rpx;
      // margin-left: 30rpx;
      line-height: 40rpx;
      border-left: 1px solid #999999;
      text-align: left;
    }
  }
}

</style>
