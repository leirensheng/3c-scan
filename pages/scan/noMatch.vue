<template>
  <div class="no-match">
    <image class="pic" mode="widthFix" src="/static/noData.png"></image>
    <div class="title">未匹配到有效3C认证信息</div>
    <div class="sub-title" v-if="isNoRecomend">
      未查询到与所拍照信息相匹配及相类似的3C证书信息
    </div>
    <div class="btn" v-if="isNoRecomend" @click="toCamera">重新拍照</div>

    <div v-else class="bottom">
      <div class="tips">已为您推荐相关证书</div>
      <my-tab v-model="tab" class="tab"></my-tab>

      <div class="items" v-if="tab === 0">
        <template v-if="enList.length">
          <div v-for="(item, index) in enList" class="item" :key="index">
            <result-item :result="item"></result-item>
          </div>
        </template>

        <div v-else class="no-recommend">
          <image class="icon" mode="widthFix" src="/static/no-data.svg"></image>
          <div class="desc">暂无同一企业推荐</div>
        </div>
      </div>
      <div class="items" v-else>
        <template v-if="specList.length">
          <div class="item" v-for="(item, index) in specList" :key="index">
            <result-item :result="item"></result-item>
          </div>
        </template>

        <div v-else class="no-recommend">
          <image class="icon" mode="widthFix" src="/static/no-data.svg"></image>
          <div class="desc">暂无同一型号推荐</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCertificateByHistory } from "@/api/identify.js";

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
  async onLoad({ historyId }) {
    let recommend;
    if (historyId) {
      uni.showLoading({
        title: "查询中",
      });
      try {
        let res = await getCertificateByHistory(historyId);
        recommend = res.recommendCertificates;
      } catch (e) {
        console.log(e);
      }
      uni.hideLoading();
    } else {
      recommend = uni.getStorageSync("recommend");
    }
    if (recommend) {
      let { enList, specList } = recommend;
      this.enList = enList;
      this.specList = specList;
      if (this.enList.length === 0 && this.specList.length) {
        this.tab = 1;
      }
    }
  },

  methods: {
    toCamera() {
      let pages = getCurrentPages(); //页面对象
      let prePage = pages.slice(-3)[0];
      if (prePage.route === "pages/scan/camera") {
        uni.navigateBack({ delta: 2 });
      } else {
        uni.redirectTo({
          url: "/pages/scan/camera",
        });
      }
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
    .tips {
      margin-top: 8rpx;
      margin-bottom: 52rpx;
      font-size: 14px;
      text-align: center;
    }

    .items {
      background-color: #f5f5f5;
      padding: 32rpx 24rpx;
      .item {
        margin: 32rpx 0;
        &:first-child {
          margin-top: 0;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .no-recommend {
      font-size: 28rpx;
      margin-top: 30px;
      line-height: 40rpx;
      .icon {
        width: 384rpx;
        transform: translateX(5%);
      }
      .desc {
        margin-top: 32rpx;
      }
    }
  }
}
</style>
