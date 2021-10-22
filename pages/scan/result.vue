<template>
  <div class="wrap">
    <div class="scan-result">
      <div class="top">
        <div class="desc">
          <image mode="widthFix" class="left" src="/static/leftQuo.png"></image>
          <image mode="widthFix" class="right" src="/static/right.svg"></image>
          <div class="content">
            <div class="title">请注意核对识别出的内容</div>
            <div class="sub-title">
              如需修改可点击箭头选择识别的文本，或点击文本直接修改
            </div>
          </div>
        </div>
        <div class="row" v-for="item in data" :key="item.id">
          <label
            class="label"
            :class="item.required && 'required'"
            :for="item.id"
            >{{ item.name }}：</label
          >
          <!-- <input
            :name="item.id"
            class="input"
            v-model="form[item.id]"
            placeholder="未显示"
          /> -->
          <div class="textarea-wrap">
            <textarea
              :maxlength="-1"
              auto-height
              class="textarea"
              v-model="form[item.id]"
              :name="item.id"
              :disabled="isSyncing !== 0"
              placeholder="未显示"
            />
          </div>

          <div
            v-if="imageTextSplits.length"
            class="right"
            @click="showDailog(item.id)"
          >
            <image mode="widthFix" class="icon" src="/static/down.svg" />
          </div>
        </div>
      </div>
    </div>
    <div class="safe-bottom">
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
      historyId: "",
      isSyncing: 0,
      dialogShow: false,
      data: [
        {
          name: "产品名称",
          id: "productName",
        },
        {
          name: "规格型号",
          id: "specifications",
          required: true,
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
  onLoad({ query, historyId, isSyncing }) {
    if (!query) {
      this.form = this.data.reduce((prev, cur) => {
        prev[cur.id] = "";
        return prev;
      }, {});
    } else {
      let val = JSON.parse(decodeURIComponent(query));
      this.historyId = historyId;
      this.isSyncing = Number(isSyncing||'');
      this.imageTextSplits = val.imageTextSplits;
      this.form = { ...val };
      delete this.form.imageText;
      delete this.form.imageTextSplits;
    }
  },
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    checkParams() {
      if (this.form.specifications === "") {
        uni.showToast({
          icon: "none",
          title: "请输入规格型号",
          duration: 2000,
        });
        return false;
      }
      let fields = [
        "factory",
        "manufacturer",
        "distributor",
        "importer",
        "agent",
      ];
      let isOk = !fields.every((key) => this.form[key] === "");
      if (!isOk) {
        uni.showToast({
          icon: "none",
          title: "生产商、制造商、经销商、进口商、代理商至少填入一个",
          duration: 2000,
        });
      }
      return isOk;
    },
    setValue(val) {
      this.form[this.editingId] = val;
    },
    showDailog(id) {
      this.editingId = id;
      this.dialogShow = true;
    },
    toCamera() {
      if (this.$getPrePath() === "pages/scan/camera") {
        uni.navigateBack();
      } else {
        uni.navigateTo({
          url: "/pages/scan/camera",
        });
      }
    },
    async search() {
      uni.removeStorageSync("recommend");
      if (!this.checkParams()) {
        return;
      }

      if (this.$getPrePath() === "pages/history/index") {
        uni.setStorageSync("needRefresh", 1);
      }

      uni.showLoading({
        title: "查询中",
      });
      try {
        let params = {
          ...this.form,
          searchType: 1,
          openId: uni.getStorageSync("openId"),
          isSyncing: this.isSyncing,
        };
        if (this.isSyncing !== 0) {
          params.historyId = this.historyId;
        }
        let res = await searchCertificate(params);
        res.certificate = res.certificates ? res.certificates[0] : null;

        if (res.showTipsType === 1) {
          uni.navigateTo({
            url: "/pages/sync/index?historyId=" + res.historyId,
          });
          return;
        }

        if (res.certificate) {
          let val = encodeURIComponent(JSON.stringify(res.certificate));

          uni.navigateTo({ url: "/pages/scan/match?query=" + val });
          uni.hideLoading();
          return;
        } else if (res.recommendCertificates) {
          uni.setStorageSync("recommend", res.recommendCertificates);
          uni.navigateTo({
            url: "/pages/scan/noMatch",
          });
        } else {
          uni.navigateTo({
            url: "/pages/scan/noMatch",
          });
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
  padding-bottom: calc(constant(safe-area-inset-bottom) + 140rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 140rpx);
}
.scan-result {
  .top {
    background-color: white;
    padding: 24rpx 24rpx 0 24rpx;
    .desc {
      margin-bottom: 30rpx;
      width: 702rpx;
      height: 148rpx;
      border-radius: 4rpx;
      background: linear-gradient(225deg, #f5f7ff 0%, #e6ebff 100%);
      position: relative;
      .left {
        position: absolute;
        left: 38rpx;
        bottom: 10rpx;
        width: 36rpx;
      }
      .right {
        position: absolute;
        right: 0;
        width: 174rpx;
        top: 0;
      }
      .content {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title {
          font-weight: bold;
          font-size: 36rpx;
          line-height: 1;
        }
        .sub-title {
          margin-top: 16rpx;
          font-size: 24rpx;
          line-height: 1;
        }
      }
    }
    .row {
      position: relative;
      border-bottom: 1rpx solid #d4d4d4;
      padding: 20rpx 0;
      padding-left: 24rpx;
      display: flex;
      align-items: center;
      font-size: 32rpx;
      .label {
        margin-right: 10rpx;
        width: 160rpx;
        &.required {
          position: relative;
          &::before {
            position: absolute;
            left: -18rpx;
            content: "*";
            color: red;
            display: block;
          }
        }
      }
      :nth-child(2) {
        flex: 1;
        margin-right: 60rpx;
        line-height: 1.4;
        max-height: 140rpx;
        overflow: auto;
        .textarea {
          width: 100%;
        }
      }
      &:last-child {
        border-bottom: none;
      }
      .right {
        position: absolute;
        right: 0;
        z-index: 99;
        padding: 15rpx 15rpx 15rpx 25rpx;
        .icon {
          width: 29rpx;
        }
        // height: 16rpx;
      }
    }
  }
}
.safe-bottom {
  z-index: 3;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  .bottom {
    background-color: white;
    display: flex;
    padding: 20rpx 24rpx;
    justify-content: space-between;
    .btn,
    .btn-primary {
      width: 48% !important;
    }
  }
}
</style>
