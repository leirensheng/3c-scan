<template>
  <div class="no-data">
    <image class="pic" src="/static/noData.png" mode="widthFix"></image>
    <div class="desc">未查询到相关3C证书</div>
    <div class="btn" @click="back">重新查询</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isNoData: false,
      data: [],
    };
  },
  created() {},
  watch: {},
  mounted() {},
  methods: {
    back() {
      uni.navigateBack();
    },
  },
};
</script>

<style scoped lang="scss">
.no-data {
  padding: 0 24rpx;
  height: 100%;
  background-color: white;
  text-align: center;
  padding-top: 80rpx;
  .pic{
    width: 80%;
  }
  .desc {
    font-size: 48rpx;
    color: rgba(0, 0, 0, 0.45);
    line-height: 66rpx;
    margin-bottom: 144rpx;
    font-weight: bold;
    margin-top: 58rpx;
  }
}
</style>
