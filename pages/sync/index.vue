<template>
  <div class="sync">
    <image class="pic" mode="widthFix" src="/static/sync.png"></image>
    <div class="title">正在同步最新3C证书信息</div>
    <div class="subtext">授权后查询结果将在一分钟内发送至您微信</div>
    <button class="btn" @click="subscribeMessage">确定</button>
  </div>
</template>

<script>
import subscribeMixin from "./subscribe";
import { subscribe, getHistory, finishSync } from "@/api/identify.js";
export default {
  data() {
    return {
      historyId: "",
    };
  },
  mixins:[subscribeMixin],
  created() {
    
  },
  mounted() {},
  async onLoad({ historyId }) {
    uni.showLoading({
      title: "加载中",
    });

    this.historyId = historyId;
    let data = await getHistory();
    uni.setStorageSync("firstHistory", data);
    uni.hideLoading();
  },
  methods: {
    async toHistory() {
      uni.redirectTo({
        url: "/pages/history/index",
      });
      // setTimeout(() => {
      //   finishSync(this.historyId);
      // }, 15);
    },
    handleSuccess() {
      subscribe(this.historyId);
      this.toHistory();
    },
    async subscribeMessage() {
      try {
        await this.subscribe();
        this.handleSuccess();
      } catch (e) {
        this.toHistory();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.sync {
  min-height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  .pic {
    margin-top: 160rpx;
    width: 444rpx;
  }
  .title {
    margin-top: 106rpx;
    font-weight: 500;
    line-height: 66rpx;
    font-size: 48rpx;
  }
  .subtext {
    margin-top: 16rpx;
    font-weight: 400;
    line-height: 40rpx;
    font-size: 28rpx;
  }
  .btn {
    margin-top: 76rpx;
    width: 700rpx;
  }
}
</style>
