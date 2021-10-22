<template>
  <div class="certificate-detail">
    <div class="certificate">
      <div class="main">
        <div class="top">
          <uni-valid :status="result.status"></uni-valid>
          <div class="company">{{ result.clientName }}</div>
        </div>
        <div class="bottom">
          <key-value
            :data="result"
            :config="config"
            :valueWidth="420"
          ></key-value>
        </div>
      </div>
      <div class="divider" />
      <div class="weituoren">
        <div class="hight-title">认证委托人基本信息</div>
        <div class="wrap">
          <key-value
            :data="result"
            :config="config2"
            :valueWidth="400"
          ></key-value>
        </div>
      </div>
      <div class="divider" />

      <div class="productor">
        <div class="hight-title">生产者(制造商)基本信息</div>
        <div class="wrap">
          <key-value
            :data="result"
            :config="config3"
            :valueWidth="400"
          ></key-value>
        </div>
      </div>
      <div class="divider" />

      <div class="org-info">
        <div class="hight-title">发证机构信息</div>
        <div class="wrap">
          <key-value
            :data="result"
            :config="config4"
            :valueWidth="370"
          ></key-value>
        </div>
      </div>
    </div>

    <div class="safe-bottom">
      <div class="fix-bottom">
        <div class="bottom-btn" @click="toggleCollect">
          <image
            class="icon"
            v-show="!isCollected"
            mode="widthFix"
            src="/static/collect.svg"
          ></image>
          <image
            class="icon"
            v-show="isCollected"
            mode="widthFix"
            src="/static/collected.svg"
          ></image>

          <span>{{ collectName }}</span>
        </div>
        <button open-type="share" class="bottom-btn">
          <image
            style="width: 37rpx"
            class="icon"
            mode="widthFix"
            src="/static/share.svg"
          ></image>
          <span>转发</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getDetail, toggleCollect } from "@/api/identify.js";

export default {
  computed: {
    collectName() {
      return this.isCollected ? "取消收藏" : "收藏";
    },
  },
  data() {
    return {
      id: "",
      isFromCollect: false,
      isCollected: false,
      config: [
        {
          id: "no",
          name: "证书编号",
        },
        {
          id: "status",
          name: "证书状态",
        },
        {
          id: "category",
          name: "产品类别",
        },
        {
          id: "productName",
          name: "产品名称及单位(主)",
          width: 143,
        },
        {
          id: "productSubName",
          width: 143,
          name: "产品名称及单位(次)",
        },
        {
          id: "specifications",
          name: "规格型号",
        },
        {
          id: "mode",
          name: "认证模式",
        },
        {
          id: "issueDate",
          name: "颁证日期",
        },
        {
          id: "firstIssueDate",
          name: "初次获证",
          type: "date",
        },
        {
          id: "expireDate",
          name: "证书到期日期",
        },
        {
          id: "submitDate",
          name: "信息上报日期",
          lightName: true,
        },

        {
          id: "standard",
          name: "认证标准和技术要求",
          width: 203,
          lightName: true,
        },
      ],
      config2: [
        {
          id: "clientName",
          name: "组织名称",
        },
        {
          id: "clientArea",
          name: "所在国别地区",
        },

        {
          id: "clientCode",
          name: "统一社会信用代码/组织机构代码",
          lightName: true,
          width: 220,
          //   width:''
        },
      ],
      config3: [
        {
          id: "manufacturer",
          name: "组织名称",
        },
        {
          id: "manufacturerArea",
          name: "所在国别地区",
        },
        {
          id: "manufacturerCode",
          lightName: true,
          width: 220,
          name: "统一社会信用代码/组织机构代码",
        },
      ],
      config4: [
        {
          id: "issueOrgName",
          name: "发证机构名称",
          lightName: true,
        },
        {
          id: "issueOrgNo",
          name: "机构批准号",
          lightName: true,
        },
        {
          id: "issueOrgStatus",
          lightName: true,

          name: "机构状态",
        },
        {
          id: "issueOrgExpire",
          name: "发证机构有效期",
          width: 230,
          type: "date",
          lightName: true,
        },

        {
          id: "issueOrgWeb",
          name: "发证机构网址",
          lightName: true,

          //   width:''
        },
        {
          id: "issueOrgAddress",
          name: "发证机构地址",
          //   width:''
          lightName: true,
        },
      ],

      result: {},
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    if (this.isFromCollect && !this.isCollected) {
      uni.setStorageSync("collect_remove", this.id);
    }
  },
  async onShow() {
    await this.getDetail();
  },
  async onLoad({ id }) {
    this.id = id;
    this.isFromCollect = this.$getPrePath() === "pages/collect/index";
    uni.showLoading({
      title: "加载中",
    });
    let isLogin = await this.$checkLogin();
    if (!isLogin) {
      uni.hideLoading();
      this.$toLogin();
    }
  },
  async onShareAppMessage(res) {
    return {
      title: "证书详情",
      path: "/pages/certificate/detail?id=" + this.id,
    };
  },
  methods: {
    async getDetail() {
      let openId = uni.getStorageSync("openId");
      if (!openId) {
        return;
      }
      uni.showLoading({
        title: "加载中",
      });
      try {
        this.result = await getDetail(this.id);
        this.isCollected = this.result.isCollect;
      } catch (e) {}
      uni.hideLoading();
    },
    async toggleCollect() {
      let val = !this.isCollected;
      let title = val ? "收藏中" : "取消收藏中";
      uni.showLoading({
        title,
      });
      await toggleCollect(this.id, val);
      this.isCollected = val;
      uni.hideLoading();
    },
    getStyle(val) {
      return {
        width: (val || 168) + "rpx",
      };
    },
  },
};
</script>

<style scoped lang="scss">
$dark: rgba(0, 0, 0, 0.85);

.certificate-detail {
  padding: 32rpx 24rpx;
  border: 1rpx solid transparent;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 150rpx);
  padding-bottom: calc(env(safe-area-inset-bottom) + 150rpx);
  //   margin-bottom: 1rpx;
  .divider {
    height: 1rpx;
    margin: 20rpx 24rpx 38rpx 24rpx;
    border-bottom: 1rpx solid #d4d4d4;
  }
  .hight-title {
    font-size: 32rpx;
    color: #262626;
    padding-left: 12rpx;
    border-left: 8rpx solid #355dee;
    line-height: 1;
    font-weight: bold;
  }
  .certificate {
    box-shadow: 0px 0px 12rpx 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background-color: white;
    padding-bottom: 20rpx;
    .main {
      padding: 32rpx 0;
      padding-bottom: 0;
      .top {
        display: flex;
        align-items: flex-end;

        .company {
          margin-left: 16rpx;
          color: $dark;
          line-height: 44rpx;
          font-weight: 500;
          font-size: 32rpx;
        }
      }
      .bottom {
        padding: 12rpx 32rpx 2rpx 32rpx;
      }
    }
    .wrap {
      padding-top: 12rpx;
      padding-bottom: 1rpx;
    }
    .weituoren,
    .productor,
    .org-info {
      padding: 0 24rpx;
    }
  }
  .safe-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    .fix-bottom {
      background-color: white;
      padding: 20rpx;
      display: flex;
      justify-content: space-between;
      box-shadow: 0px -2rpx 3rpx 0px rgba(0, 0, 0, 0.15);
      .bottom-btn {
        width: 48% !important;
        line-height: 0;
        margin: 0;
        font-size: 30rpx;
        width: 340rpx;
        border: 1px solid #355dee;
        color: #355dee;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 12rpx;
        padding: 20rpx 0;
        background-color: white;
        .icon {
          width: 32rpx;
        }
      }
    }
  }
}
</style>
