<template>
  <div class="history">
    <div class="top">
      <div class="title">历史记录</div>
      <div class="more" @click="seeMore" v-if="history">
        <span>更多</span>
        <image class="icon" mode="widthFix" src="/static/back.svg"></image>
      </div>
    </div>
    <div class="content" :style="{ height: history ? 'auto' : '228rpx' }">
      <div v-if="!isLogin" class="no-login" @click="$toLogin">
        <div>你还没有登录，</div>
        <div>请登录后查看历史记录></div>
      </div>
      <div class="no-data" v-else-if="!history">
        <div class="name">暂无历史记录</div>
        <image class="icon" mode="widthFix" src="/static/no-data.png"></image>
      </div>
      <div class="has-content" v-else>
        <history-item :value="history" :isShowType="false"></history-item>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistory } from "@/api/identify.js";

export default {
  data() {
    return {
      history: null,
    };
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isShow: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getHistory();
        }
      },
    },
  },
  mounted() {},
  methods: {
    async getHistory() {
      if (!this.isLogin) return;

      let data = await getHistory();
      this.firstHistory = data;
      let dates = Object.keys(data);
      let sorted = dates.sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      if (dates.length) {
        this.history = data[sorted[0]][0];
      }
    },
    seeMore() {
      uni.setStorageSync("firstHistory", this.firstHistory);
      uni.navigateTo({
        url: "/pages/history/index",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.history {
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 26rpx 24rpx;
  background-color: white;
  .top {
    padding-bottom: 16rpx;
    border-bottom: 1px solid #d4d4d4;
    display: flex;
    justify-content: space-between;

    .title {
      font-weight: bold;
      color: #262626;
      font-size: 32rpx;
      line-height: 40rpx;
    }
    .more {
      color: rgba(0, 0, 0, 0.65);
      font-size: 28rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        margin-left: 12rpx;
        width: 20rpx;
        transform: rotate(180deg);
      }
    }
  }
  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    .no-login,
    .no-data {
      font-size: 28rpx;
      line-height: 40rpx;
      color: #292929;
      text-align: center;
    }
    .no-data {
      transform: translateX(10rpx);
      .name {
        transform: translateX(-10rpx) translateY(12px);
      }
      .icon {
        width: 360rpx;
      }
    }
    .has-content {
      width: 100%;
    }
    //   flex-direction: column;
    //   align-items: center;
  }
  //   min-height: 312rpx;
}
</style>
