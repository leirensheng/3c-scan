<template>
  <div class="no-match">
    <image class="pic" mode="widthFix" src="/static/noData.png"></image>
    <div class="title">未匹配到有效3C认证信息</div>
    <div class="sub-title" v-if="isNoRecomend">
      未查询到与所拍照信息相匹配及相类似的3C证书信息
    </div>
    <div class="btn" v-if="isNoRecomend" @click="toCamera">重新拍照</div>

    <div v-else class="bottom">
      <my-tab @change="changeTab"></my-tab>

      <div class="items" v-if="tab === 0">
        <template v-if="enList.length">
          <result-item
            v-for="(item, index) in enList"
            :key="index"
            :result="item"
          ></result-item>
        </template>

        <div v-else class="no-recommend">暂无推荐</div>
      </div>
      <div class="items" v-else>
        <template v-if="specList.length">
          <result-item
            v-for="(item, index) in specList"
            :key="index"
            :result="item"
          ></result-item>
        </template>

        <div v-else class="no-recommend">暂无推荐</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 0,
      enList: [],
      specList: [],
    };
  },
  computed: {
    isNoRecomend() {
      return this.enList.length === 0 && this.specList.length === 0;
    },
  },
  created() {},
  mounted() {},
  onLoad() {
    let recommend = uni.getStorageSync("recommend");
    if (recommend) {
      let { enList, specList } = recommend;
      this.enList = enList;
      this.specList = specList;
    }
  },

  methods: {
    changeTab(i) {
      this.tab = i;
    },
    toCamera() {
      uni.navigateTo({
        url: "/pages/scan/camera",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.no-match {
  min-width: 100%;
  background-color: white;
  padding-top: 80rpx;
  text-align: center;
  .pic {
    width: 80%;
  }
  .title {
    color: rgba(0, 0, 0, 0.45);
    font-weight: bold;
    line-height: 66rpx;
    margin-top: 58rpx;

    font-size: 48rpx;
  }
  .sub-title {
    margin-top: 16rpx;
    font-weight: 400;
    line-height: 40rpx;
    color: #262626;
    font-size: 28rpx;
  }
  .btn {
    margin: 0 auto;
    width: 700rpx;
    margin-top: 88rpx;
    //   width: 95%;
  }
  .bottom {
    margin-top: 82rpx;
    .items {
      background-color: #f5f5f5;
      padding: 32rpx 24rpx;
      display: flex;
      flex-direction: column;
      gap: 32rpx;
    }
    .no-recommend{
      font-size: 28rpx;
      margin-top: 30px;
      line-height: 40rpx;
    }
  }
}
</style>
