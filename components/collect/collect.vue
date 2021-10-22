<template>
  <div class="collect">
    <div class="top">
      <div class="title">收藏夹</div>
      <div class="more" v-if="collect" @click="seeMore">
        <span>更多</span>
        <image class="icon" mode="widthFix" src="/static/back.svg"></image>
      </div>
    </div>
    <div
      class="content"
    >
      <div v-if="!isLogin" class="no-login has-height" @click="$toLogin">
        <div>你还没有登录，</div>
        <div>请登录后查看收藏夹></div>
      </div>

      <div class="has-height no-data" v-else-if="!loading && !collect">
        <div class="name">暂无收藏内容</div>
        <image class="icon" mode="widthFix" src="/static/no-data.svg"></image>
      </div>

      <div v-else class="has-content">
        <result-item
          isInUser
          :result="valueForResultItem"
          :loading="loading"
        ></result-item>
      </div>
    </div>
  </div>
</template>

<script>
import { getCollection } from "@/api/identify.js";

export default {
  data() {
    return {
      loading: true,
      collect: null,
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
  computed: {
    valueForResultItem() {
      return this.collect || {};
    },
  },
  watch: {
    isShow: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getCollection();
        }
      },
    },
  },
  mounted() {},
  methods: {
    async getCollection() {
      if (!this.isLogin) return;
      this.loading = true;
      let start = Date.now();
      let data = await getCollection();
      this.firstCollect = data;
      let dates = Object.keys(data);
      let sorted = dates.sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
      );
      if (dates.length) {
        this.collect = data[sorted[0]][0];
      } else {
        this.collect = null;
      }
      let useTime = Date.now() - start;
      let minTime = 350;
      if (useTime < minTime) {
        setTimeout(() => {
          this.loading = false;
        }, minTime - useTime);
      } else {
        this.loading = false;
      }
    },
    seeMore() {
      uni.setStorageSync("firstCollect", this.firstCollect);
      uni.navigateTo({
        url: "/pages/collect/index",
      });
    },
  },
};
</script>

<style scoped lang="scss">
.collect {
  box-shadow: 0px 0px 12rpx 0px rgba(0, 0, 0, 0.15);
  border-radius: 2px;
  padding: 26rpx 0;
  padding-bottom: 0;
  background-color: white;
  .top {
    margin: 0 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid #d4d4d4;
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

      font-weight: 400;
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
    // min-height: 308rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .has-height{
      height: 300rpx;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
    }
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
    .loading {
      font-size: 28rpx;
      text-align: center;
    }
    .has-content {
      width: 100%;
    }
  }
}
</style>
