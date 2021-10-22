<template>
  <div class="history-page">
    <uni-swipe-action>
      <div class="one-day" v-for="item in data" :key="item.date">
        <div class="date">{{ getShowDate(item.date) }}</div>
        <uni-swipe-action-item
          v-for="(one, index) in item.data"
          :key="index"
          :right-options="options"
          @click="remove(item, one)"
          class="one-history"
        >
          <history-item :value="one"></history-item>
        </uni-swipe-action-item>
      </div>
    </uni-swipe-action>

    <load-more v-if="!noMore"></load-more>
    <div class="no-more" v-else>没有更多了</div>
  </div>
</template>

<script>
import { getHistory, removeHistory } from "@/api/identify.js";

export default {
  data() {
    return {
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#E05A5B",
          },
        },
      ],
      page: 2,
      yesterdayStr: "",
      todayStr: "",
      data: [],
      loading: false,
      noMore: false,
    };
  },
  created() {
    let firstHistory = uni.getStorageSync("firstHistory");
    this.getTodayStr();
    this.getYesterdayStr();
    this.getData(firstHistory);
  },
  beforeDestroy() {
    uni.removeStorageSync("firstHistory");
  },
  computed: {
    hasLoadCnt() {
      return this.data.reduce((prev, cur) => prev + cur.data.length, 0);
    },
  },
  mounted() {},
  async onShow() {
    let needRefresh = uni.getStorageSync("needRefresh");
    if (needRefresh) {
      try {
        let res = await getHistory(1);
        if (res[this.todayStr]) {
          if (this.data[0].date === this.todayStr) {
            let firstOneId = this.data[0].data[0].id;
            let addData = await this.getTodayData(1, [], firstOneId);
            this.data[0].data.unshift(...addData);
          } else {
            let todayData = await this.getTodayData();
            this.data.unshift({ date: this.todayStr, data: todayData });
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    uni.removeStorageSync("needRefresh");
  },
  async onReachBottom() {
    if (this.noMore || this.loading) return;
    await this.getData();
  },
  methods: {
    async getTodayData(page = 1, result = [], targetId) {
      let res = await getHistory(page);
      let resData = res[this.todayStr] || [];

      let all = [...result, ...resData];
      if (targetId) {
        let index = all.findIndex((one) => one.id === targetId);
        if (index !== -1) {
          return all.slice(0, index);
        }
      }
      if (resData.length === 10) {
        return await this.getTodayData(page + 1, all, targetId);
      }
      return all;
    },
    async remove({ date, data }, obj) {
      uni.showLoading({
        title: "删除中",
      });
      await removeHistory(obj.id);
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
          res = await getHistory(this.page);
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
  },
};
</script>

<style scoped lang="scss">
.history-page {
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
    .one-history {
      box-shadow: 0px 0px 12rpx 0px rgba(0, 0, 0, 0.15);
      border-radius: 4rpx;
      background: white;
      margin-bottom: 32rpx;
      display: block;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
