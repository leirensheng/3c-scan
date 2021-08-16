<template>
  <div class="result">
    <div class="one-item" v-for="(item, index) in data" :key="index">
      <result-item :result="item"></result-item>
    </div>
    <load-more v-if="!noMore"></load-more>
    <div class="no-more" v-else>没有更多了</div>
  </div>
</template>

<script>
import { searchCertificate } from "@/api/identify.js";

export default {
  data() {
    return {
      loading: false,
      noMore:false,
      data: [],
      params: {},
    };
  },
  computed: {},
  created() {
    this.data = uni.getStorageSync("result");
    this.noMore = this.data.length<10
    this.params = uni.getStorageSync("resultParams");
  },
  async onReachBottom() {
    if (this.noMore|| this.loading) return;
    this.loading = true;
    try {
      let { certificates, scrollId } = await searchCertificate(this.params);
      if (!certificates.length) {
        this.noMore = true;
      }
      this.params.scrollId = scrollId;
      this.data.push(...certificates);
    } catch (e) {}
    this.loading = false;
  },
  beforeDestroy() {
    uni.removeStorageSync("result");
    uni.removeStorageSync("resultParams");
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.result {
  padding: 32rpx 24rpx;
  .one-item {
    margin-top: 32rpx;
    &:first-child {
      margin-top: 0;
    }
  }
}
</style>
