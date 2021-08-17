<template>
  <div
    class="history-item"
    :class="!isShowType && 'in-user'"
    @click="gotoSearch"
  >
    <div class="type" v-if="isShowType">{{ history.type }}</div>
    <div class="tags">
      <div class="tag" v-for="(item, index) in strArr" :key="index">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: [],
    };
  },
  created() {},
  props: {
    isShowType: {
      type: Boolean,
      default: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    history() {
      let { searchType, status, category } = this.value;
      let res = { ...this.value };
      res.type = searchType === 2 ? "证书检索" : "拍照查询";

      return res;
    },
    strArr() {
      let fields = ["no", "clientName", "productName", "specifications"];
      let temp = this.filterData(fields, this.history);
      return Object.values(temp).filter(Boolean);
    },
  },
  mounted() {},
  methods: {
    filterData(fields, obj) {
      return fields.reduce((prev, cur) => {
        prev[cur] = obj[cur];
        return prev;
      }, {});
    },
    gotoSearch() {
      let isSearch = this.history.type === "证书检索";
      let fields = isSearch
        ? [
            "no",
            "clientName",
            "productName",
            "specifications",
            "status",
            "category",
          ]
        : ['productName','specifications','factory','manufacturer','distributor','importer','agent'];

      let temp = this.filterData(fields, this.value);
      let val = encodeURIComponent(JSON.stringify(temp));
      let url = (isSearch ? "/pages/main/index?tab=search&&query="  : "/pages/scan/result?query=")+val;

      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.history-item {
  padding: 36rpx 24rpx 18rpx 24rpx;
  &.in-user {
    padding: 0;
    padding-top: 24rpx;
    padding-bottom: 6rpx;
  }
  .type {
    line-height: 44rpx;
    font-size: 30rpx;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 28rpx;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 14rpx 18rpx;
    .tag {
      padding: 0 16rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #292929;
      line-height: 48rpx;
      background-color: #f5f5f5;
      border-radius: 4rpx;
    }
  }
}
</style>
