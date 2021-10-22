<template>
  <div
    class="history-item"
    :class="!isShowType && 'in-user'"
    @click="gotoSearch"
  >
    <div class="top" v-if="isShowType">
      <div class="type">{{ history.type }}</div>
      <div v-if="isShowSync" class="sync" :class="isSyncing && 'active'">
        {{ syncStatus }}
      </div>
    </div>
    <div class="tags" v-show="!loading">
      <div class="tag" v-for="(item, index) in strArr" :key="index">
        {{ item }}
      </div>
    </div>
    <div v-show="loading" class="tags loading">
      <div class="tag" v-for="(item, index) in loadingArr" :key="index">
        {{ item }}
      </div>
      <div class="light"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: [],
      loadingArr: ["占位符", "5个占位符", "6个占位符呢", "4个占位"],
    };
  },
  created() {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isShowType: {
      type: Boolean,
      default: true,
    },
    isInUserComponent: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    isSyncing() {
      return this.history.isSyncing === 1;
    },
    isShowSync() {
      return this.history.type === "拍照查询" && this.history.isSyncing !== 0;
    },
    syncStatus() {
      return this.isSyncing
        ? "正在同步最新CCC认证信息..."
        : "已同步最新CCC认证信息";
    },
    history() {
      if (this.loading) return {};
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
      if (this.loading) return;
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
        : [
            "productName",
            "specifications",
            "factory",
            "manufacturer",
            "distributor",
            "importer",
            "agent",
          ];

      let temp = this.filterData(fields, this.value);
      let val = encodeURIComponent(JSON.stringify(temp));
      let url =
        (isSearch
          ? "/pages/main/index?tab=search&&query="
          : `/pages/scan/result?historyId=${this.history.id}&&isSyncing=${this.history.isSyncing}&&query=`) +
        val;

      if (isSearch && this.isInUserComponent) {
        this.$emit("changeQuery", temp);
      } else {
        uni.navigateTo({
          url,
        });
      }
    },
  },
};
</script>

<style scoped lang="scss">
.history-item {
  background: white;
  padding: 36rpx 24rpx;
  border-radius: 4px;
  &.in-user {
    padding: 0;
    padding-top: 24rpx;
    padding-bottom: 6rpx;
  }
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28rpx;

    .type {
      line-height: 44rpx;
      font-size: 30rpx;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
    .sync {
      font-size: 24rpx;
      color: #999999;
      &.active {
        color: #355dee;
      }
    }
  }
  .tags {
    margin-right: -16rpx;
    margin-bottom: -18rpx;
    .tag {
      display: inline-block;
      margin-right: 16rpx;
      margin-bottom: 18rpx;
      padding: 0 16rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #292929;
      line-height: 48rpx;
      background-color: #f5f5f5;
      border-radius: 4rpx;
    }
  }
  .loading {
    $grey: #f5f5f5;
    position: relative;

    .tag {
      color: $grey;
      background: $grey;
    }
  }
}
</style>
