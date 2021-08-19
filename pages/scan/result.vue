<template>
  <div class="wrap">
    <div class="scan-result">
      <div class="top">
        <div class="row" v-for="item in data" :key="item.id">
          <label class="label" :for="item.id">{{ item.name }}：</label>
          <input
            :name="item.id"
            class="input"
            v-model="form[item.id]"
            placeholder="未显示"
          />

          <div v-if="imageTextSplits.length" class="right" @click="showDailog(item.id)">
            <image mode="widthFix" class="icon" src="/static/down.svg" />
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="btn-primary" @click="toCamera">重新拍照</div>
        <div class="btn" @click="search">确认</div>
      </div>
    </div>

    <my-dialog v-model="dialogShow">
      <select-word
        @close="dialogShow = false"
        @confirm="setValue"
        :value="imageTextSplits"
      ></select-word>
    </my-dialog>
  </div>
</template>

<script>
import { searchCertificate } from "@/api/identify.js";

export default {
  data() {
    return {
      imageTextSplits: [],
      dialogShow: false,
      data: [
        {
          name: "产品名称",
          id: "productName",
        },
        {
          name: "规格型号",
          id: "specifications",
        },
        {
          name: "生产商",
          id: "factory",
        },
        {
          name: "制造商",
          id: "manufacturer",
        },
        {
          name: "经销商",
          id: "distributor",
        },
        {
          name: "进口商",
          id: "importer",
        },
        {
          name: "代理商",
          id: "agent",
        },
      ],
      form: {},
    };
  },
  onLoad({ query }) {
    console.log(query);
    if (!query) {
      this.form = this.data.reduce((prev, cur) => {
        prev[cur.id] = "";
        return prev;
      }, {});
    } else {
      let val = JSON.parse(decodeURIComponent(query));
      this.imageTextSplits = val.imageTextSplits;
      this.form = { ...val };
      delete this.form.imageText;
      delete this.form.imageTextSplits;
    }
    // console.log(this.imageTextSplits)

    // this.imageTextSplits = [
    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "发范德萨发非人非微软"],

    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],
    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司45558"],

    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],
    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],

    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],
    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],

    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],
    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],

    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],
    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],

    //   ["经销商", "：", "迪士尼", "商贸", "(", "上海", ")", "有限公司"],
    // ];
  },
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    setValue(val) {
      this.form[this.editingId] = val;
    },
    showDailog(id) {
      this.editingId = id;
      this.dialogShow = true;
    },
    toCamera() {
      uni.navigateTo({
        url: "/pages/scan/camera",
      });
    },
    async search() {
      if (!this.form.specifications) {
        uni.showToast({
          icon: "none",
          title: "请输入规格型号",
          duration: 2000,
        });
        return;
      }

      uni.showLoading({
        title: "查询中",
      });
      try {
        let params = {
          ...this.form,
          searchType: 1,
          openId: uni.getStorageSync("openId"),
        };
        let res = await searchCertificate(params);

        res.certificate = res.certificates ? res.certificates[0] : null;

        if (res.certificate) {
          let val = encodeURIComponent(JSON.stringify(res.certificate));

          uni.navigateTo({ url: "/pages/scan/match?query=" + val });
        } else if (res.recommendCertificates) {
          uni.setStorageSync("recommend", res.recommendCertificates);
        } else {
          uni.removeStorageSync("recommend");
        }
        uni.navigateTo({
          url: "/pages/scan/noMatch",
        });
        if (this.$getPrePath() === "pages/history/index") {
          uni.setStorageSync("needRefresh", 1);
        }
      } catch (e) {
        console.log(e);
      }
      uni.hideLoading();
    },
    bindPickerChange(item, val) {
      console.log(item, val);
      this.form[item.id] = val;
    },
  },
};
</script>

<style scoped lang="scss">
.wrap {
  height: 100%;
}
.scan-result {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    background-color: white;
    padding: 24rpx 24rpx 48rpx 24rpx;
    .row {
      position: relative;
      border-bottom: 1px solid #d4d4d4;
      padding: 30rpx 0;
      padding-left: 24rpx;
      display: flex;
      align-items: center;
      font-size: 30rpx;
      .label {
        margin-right: 48rpx;
      }
      :nth-child(2) {
        flex: 1;
        margin-right: 60rpx;
      }
      .right {
        position: absolute;
        right: 0;
        z-index: 99;
        padding: 10rpx;
        .icon {
          width: 29rpx;
        }
        // height: 16rpx;
      }
    }
  }
  .bottom {
    background-color: white;
    display: flex;
    padding: 20rpx 24rpx;
    gap: 0 24rpx;
    > * {
      width: 340rpx;
    }
  }
}
</style>
