<template>
  <div class="collect-page">
    <uni-swipe-action>
      <div class="one-day" v-for="item in data" :key="item.date">
        <div class="date">{{ getShowDate(item.date) }}</div>
        <uni-swipe-action-item
          v-for="(one, index) in item.data"
          :key="index"
          class="collect-wrap"
        >
          <div class="delete-btn" slot="right" @click="remove(item, one)">
            <div>取消</div>
            <div>收藏</div>
          </div>
          <div class="one-collect">
            <result-item :result="one" is-in-collect></result-item>
          </div>
        </uni-swipe-action-item>
      </div>
    </uni-swipe-action>
    <load-more v-if="!noMore"></load-more>
    <div class="no-more" v-else>没有更多了</div>
  </div>
</template>

<script>
import { getCollection, toggleCollect } from "@/api/identify.js";

export default {
  data() {
    return {
      page: 2,
      yesterdayStr: "",
      todayStr: "",
      data: [],
      noMore: false,
      loading: false,
    };
  },
  computed: {
    hasLoadCnt() {
      return this.data.reduce((prev, cur) => prev + cur.data.length, 0);
    },
  },
  onShow() {
    this.refreshRemove();
  },
  created() {
    let firstCollect = uni.getStorageSync("firstCollect");

    this.getTodayStr();
    this.getYesterdayStr();
    this.getData(firstCollect);
  },
  beforeDestroy() {
    uni.removeStorageSync("firstCollect");
  },
  async onReachBottom() {
    if (this.noMore || this.loading) return;
    await this.getData();
  },
  mounted() {},
  methods: {
    // 从详情页取消收藏,返回后更新页面
    refreshRemove() {
      let removeId = uni.getStorageSync("collect_remove");
      if (removeId) {
        let i2 = -1;
        let i = this.data.findIndex((one) => {
          i2 = one.data.findIndex((_) => _.id === removeId);
          return i2 !== -1;
        });
        if (i !== -1) {
          if (i2 !== -1) {
            this.data[i].data.splice(i2, 1);
            if (this.data[i].data.length === 0) {
              this.data.splice(i, 1);
            }
          }
        }
      }
      uni.removeStorageSync("collect_remove");
    },
    getShowDate(date) {
      let map = {
        [this.yesterdayStr]: "昨天",
        [this.todayStr]: "今天",
      };
      return map[date] || date;
    },
 
    getTodayStr() {
      let date = new Date();
      this.todayStr = this.$formatDate(date);
    },
    getYesterdayStr() {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      this.yesterdayStr = this.$formatDate(date);
    },
    checkIsNoMore(res) {
      let days = Object.keys(res);
      let total = days.reduce((prev, cur) => prev + res[cur].length, 0);
      this.noMore = total < 10;
    },
    async getData(firstPageData) {
      let res = firstPageData;
      if (!firstPageData) {
        this.loading = true;
        try {
          res = await getCollection(this.page);
          this.page++;
        } catch (e) {}
      }

      this.checkIsNoMore(res);

      let lastdayData = this.data.slice(-1)[0];
      let lastday = lastdayData && lastdayData.date;

      if (lastday && res[lastday]) {
        lastdayData.data.push(...res[lastday]);
        delete res[lastday];
      }

      let days = Object.keys(res);
      days.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      let data = days.map((date) => ({
        date,
        data: res[date],
      }));
      this.data.push(...data);
      this.loading = false;
    },
    async remove({ date, data }, obj) {
      uni.showLoading({
        title: "取消中",
      });
      await toggleCollect(obj.id, 0);
      let i = data.findIndex((one) => one.id === obj.id);
      data.splice(i, 1);
      if (data.length === 0) {
        let i = this.data.findIndex((one) => one.date === date);
        this.data.splice(i, 1);
      }
      uni.hideLoading();

      // 防止删除了第一页的,无法滑动到底部加载更多
      this.$nextTick(() => {
        if (!this.noMore && this.hasLoadCnt < 10) {
          this.getData();
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.collect-page {
  padding: 16rpx 24rpx;
  .one-day {
    margin-bottom: 16rpx;
    &:last-child {
      margin-bottom: 0;
    }
    .date {
      margin-bottom: 8rpx;
      line-height: 48rpx;
      color: rgba(0, 0, 0, 0.65);
      font-size: 30rpx;
      font-weight: 400;
    }

    .collect-wrap {
      background: transparent;
      display: block;
      margin-bottom: 32rpx;
      transform: translateX(-10rpx);
      .delete-btn {
        margin: 10rpx 0;
        padding: 44rpx;
        line-height: 44rpx;
        font-size: 32rpx;
        background-color: #e05a5b;
        color: white;
        display: flex;
        gap: 12rpx;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        border-radius: 4px;
      }
      &:last-child {
        margin-bottom: 0;
      }
      .one-collect {
        margin: 10rpx;
        display: block;
        border-radius: 4rpx;
        background: white;
      }
    }
  }
}
</style>