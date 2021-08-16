<template>
  <div class="scan-no-result">
    <div class="title">未识别出有效信息</div>
    <div class="sub-title">请拍取含有产品名称、规格型号、制造商的部分</div>
    <image class="pic" mode="widthFix" src="/static/scan-result.png"></image>
    <div class="btn" @click="back">重新拍照</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    back() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped lang="scss">
.scan-no-result {
  background-color: white;
  height: 100%;
  padding: 120rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.45);
    line-height: 66rpx;
    font-size: 48rpx;
  }
  .sub-title {
    margin-top: 22rpx;
    font-size: 28rpx;
    color: #262626;
    font-weight: 400;
  }
  .pic {
    margin-top: 26px;

    width: 546rpx;
  }
  .btn {
    margin-top: 73px;
    width: 100%;
  }
}
</style>
