<template>
  <div class="scan-match">
    <image
      class="pic"
      v-if="value.status === '有效'"
      mode="widthFix"
      src="/static/scanMatch1.png"
    ></image>
    <image
      class="pic"
      v-else
      mode="widthFix"
      src="/static/scanMatch2.png"
    ></image>

    <div class="title">{{ title }}</div>
    <div class="sub-title">{{ subTitle }}</div>

    <div class="detail">
      <result-item :result="value" :loading="loading"></result-item>
    </div>
  </div>
</template>

<script>
import { getCertificateByHistory } from "@/api/identify.js";

export default {
  data() {
    return {
      value: {},
      loading: false,
    };
  },
  computed: {
    title() {
      return this.value.status === "有效" ? "3C认证有效" : "已匹配到对应证书";
    },
    subTitle() {
      return `为您查询到该证书处于${this.value.status}状态`;
    },
  },
  async onLoad({ query, historyId }) {
    if (historyId) {
      uni.showLoading({
        title: "查询中",
      });

      try {
        this.loading = true;
        let res = await getCertificateByHistory(historyId);
        this.value = res.certificates[0];
        this.loading = false;
      } catch (e) {
        console.log(e);
      }
      uni.hideLoading();
    } else {
      this.value = JSON.parse(decodeURIComponent(query));
    }
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.scan-match {
  padding-top: 94rpx;
  height: 100%;
  background-color: white;
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  text-align: center;
  .pic {
    width: 562rpx;
  }
  .title {
    font-size: 60rpx;
    line-height: 84rpx;
    margin-top: 44rpx;
    font-weight: bold;
    color: black;
    margin-bottom: 12rpx;
  }
  .sub-title {
    font-size: 28rpx;
    line-height: 40rpx;
    color: #262626;
    margin-bottom: 66rpx;
  }
  .detail {
    padding: 0 24rpx;
    padding-bottom: 24rpx;
  }
}
</style>
