<template>
  <div class="collect-page">
    <div class="one-day" v-for="item in data" :key="item.date">
      <div class="date">{{ getShowDate(item.date) }}</div>
      <uni-swipe-action>
        <uni-swipe-action-item
          v-for="(one, index) in item.data"
          :key="index"
          :right-options="options"
          @click="remove(item, one)"
          class="one-collect"
        >
          <result-item :result="one"></result-item>
        </uni-swipe-action-item>
      </uni-swipe-action>
    </div>
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
      options: [
        {
          text: "取消收藏",
          style: {
            backgroundColor: "#E05A5B",
          },
        },
      ],
    };
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
      let total = days.reduce((prev,cur)=>prev+res[cur].length ,0)
      this.noMore = total<10
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

    .one-collect {
      display: block;
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