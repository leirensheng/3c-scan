<template>
  <div class="history-page">
    <div class="one-day" v-for="item in data" :key="item.date">
      <div class="date">{{ getShowDate(item.date) }}</div>
      <div v-for="(one, index) in item.data" :key="index" class="one-history">
        <history-item :value="one"></history-item>
      </div>
    </div>
    <load-more v-if="loading"></load-more>
    <div class="no-more" v-else>没有更多了</div>
  </div>
</template>

<script>
import { getHistory } from "@/api/identify.js";

export default {
  data() {
    return {
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
  computed: {},
  onLoad() {},
  mounted() {},
  async onReachBottom() {
    if (this.noMore || this.loading) return;
    await this.getData();
  },
  methods: {
    getShowDate(date) {
      let map = {
        [this.yesterdayStr]: "昨天",
        [this.todayStr]: "今天",
      };
      return map[date] || date;
    },
    formatDate(date) {
      let month = date.getMonth() + 1;
      month = month < 9 ? `0${month}` : month;
      let day = date.getDate();
      day = day < 9 ? `0${day}` : day;
      let year = date.getFullYear();
      return `${year}-${month}-${day}`;
    },
    getTodayStr() {
      let date = new Date();
      this.todayStr = this.formatDate(date);
    },
    getYesterdayStr() {
      let date = new Date();
      date.setDate(date.getDate() - 1);
      this.yesterdayStr = this.formatDate(date);
    },
    checkIsNoMore(res) {
      let days = Object.keys(res);
      if(!days.length) this.noMore = true
      days.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
      let oldestDay = days.slice(-1)[0];
      this.noMore =  res[oldestDay].length<10
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
      box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
      border-radius: 4rpx;
      background: white;
      margin-bottom: 32rpx;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
