<template>
  <div class="search">
    <div class="row" v-for="item in data" :key="item.id">
      <label class="label" :for="item.id">{{ item.name }}：</label>
      <input
        v-if="item.type === 'input'"
        :name="item.id"
        class="uni-input"
        v-model="form[item.id]"
        :placeholder="'请输入' + item.name"
      />
      <picker
        v-else
        @change="(e) => bindPickerChange(item, e.detail.value)"
        :value="form[item.id]"
        :range="item.options"
      >
        <view>{{ item.options[form[item.id]] }}</view>
      </picker>
      <image
        mode="widthFix"
        v-if="item.type === 'select'"
        class="icon"
        src="/static/down.svg"
      />
    </div>
    <div class="btn" @click="search">查询</div>
  </div>
</template>

<script>
let statusOptions = ["全部", "有效", "暂停", "过期失效", "撤销", "注销"];
let categoryOptions = ["全部", "2202：玩具", "2201：童车类产品"];
import { searchCertificate } from "@/api/identify.js";
export default {
  data() {
    return {
      data: [
        {
          name: "证书编号",
          id: "no",
          type: "input",
        },
        {
          name: "企业名称",
          id: "clientName",
          type: "input",
        },
        {
          name: "产品名称",
          id: "productName",
          type: "input",
        },
        {
          name: "规格型号",
          id: "specifications",
          type: "input",
        },
        {
          name: "产品类别",
          id: "category",
          type: "select",
          value: 0,
          options: categoryOptions,
        },
        {
          name: "证书状态",
          id: "status",
          value: 0,
          options: statusOptions,
          type: "select",
        },
      ],
      form: {},
    };
  },
  created() {
    if (!this.query) {
      this.form = this.data.reduce((prev, cur) => {
        prev[cur.id] = cur.type === "select" ? 0 : "";
        return prev;
      }, {});
    } else {
      let { status, category } = this.query;
      let statusIndex = statusOptions.findIndex((one) => one === status);
      let categoryIndex = categoryOptions.findIndex((one) => one === category);

      // let status =
      this.form = {
        ...this.query,
        status: statusIndex === -1 ? 0 : statusIndex,
        category: categoryIndex === -1 ? 0 : categoryIndex,
      };
    }
  },
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
    query: {
      type: Object,
      default: () => null,
    },
  },

  methods: {
    checkParams() {
      let fields = ["no", "clientName", "productName", "specifications"];
      return !fields.every((key) => this.form[key] === "");
    },
    async search() {
      if (!this.isLogin) {
        this.$toLogin();
        return;
      }
      if (!this.checkParams()) {
        uni.showToast({
          icon: "none",
          title: "请输入查询信息",
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
          searchType: 2,
          openId: uni.getStorageSync("openId"),
          status: this.form.status === 0 ? "" : statusOptions[this.form.status],
          category:
            this.form.category === 0 ? "" : categoryOptions[this.form.category],
        };

        let { certificates, scrollId } = await searchCertificate(params);
        if (certificates.length) {
          uni.setStorageSync("resultParams", { ...params, scrollId });
          uni.setStorageSync("result", certificates);
          uni.navigateTo({ url: "/pages/search/result" });
        } else {
          uni.navigateTo({ url: "/pages/search/noResult" });
        }
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
      this.form[item.id] = Number(val);
    },
  },
};
</script>

<style scoped lang="scss">
.search {
  background-color: white;
  padding: 24rpx 24rpx 48rpx 24rpx;
  .row {
    position: relative;
    border-bottom: 1px solid #d4d4d4;
    padding: 30rpx 0;
    display: flex;
    align-items: center;
    font-size: 30rpx;
    .label {
      margin-right: 48rpx;
    }
    :nth-child(2) {
      flex: 1;
    }
    .icon {
      position: absolute;
      right: 0;
      width: 29rpx;
      // height: 16rpx;
    }
  }
  .btn {
    margin-top: 48rpx;
  }
}
</style>
