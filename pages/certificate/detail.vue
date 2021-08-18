<template>
  <div class="certificate-detail">
    <div class="certificate">
      <div class="main">
        <div class="top">
          <uni-valid :status="result.status"></uni-valid>
          <div class="company">{{ result.clientName }}</div>
        </div>
        <div class="bottom">
          <key-value :data="result" :config="config"></key-value>
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

      <div class="org-info">
        <div class="hight-title">发证机构信息</div>
        <div class="wrap">
          <key-value
            :data="result"
            :config="config3"
            :valueWidth="400"
          ></key-value>
        </div>
      </div>
    </div>

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
      isFromCollect:false,
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
          id: "manufacturerArea",
          name: "所在国别地区",
        },

        {
          id: "manufacturerCode",
          name: "统一社会信用代码/组织机构代码",
          lightName: true,
          width: 220,
          //   width:''
        },
      ],

      config3: [
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
          width: 220,
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
  async onLoad({ id }) {
    this.isFromCollect = this.$getPrePath() === "pages/collect/index";
    uni.showLoading({
      title: "查询中",
    });
    try {
      this.result = await getDetail(id);
      this.id = id;
      this.isCollected = this.result.isCollect;
    } catch (e) {}
    uni.hideLoading();
  },
  async onShareAppMessage(res) {
    return {
      title: "证书详情",
      path: "/pages/certificate/detail?id=" + this.id,
    };
  },
  methods: {
    async toggleCollect() {
      uni.showLoading({
        title: "加载中",
      });
      let val = !this.isCollected;
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
  border: 1px solid transparent;
  padding-bottom: 150rpx;
  //   margin-bottom: 1px;
  .divider {
    height: 1px;
    margin: 20rpx 24rpx 32rpx 24rpx;
    border-bottom: 1px solid #d4d4d4;
  }
  .hight-title {
    font-size: 32rpx;
    color: #262626;
    padding-left: 12rpx;
    border-left: 8rpx solid #355dee;
  }
  .certificate {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    background-color: white;
    padding-bottom: 20rpx;
    .main {
      padding: 32rpx 0;
      padding-bottom: 0;
      .top {
        display: flex;
        align-items: center;
        .status {
          margin-right: 16rpx;
        }
        .company {
          color: $dark;
          line-height: 44rpx;
          font-weight: 500;
          font-size: 32rpx;
        }
      }
      .bottom {
        padding: 12rpx 56rpx 2rpx 22rpx;
      }
    }
    .wrap {
      padding-top: 12rpx;
      padding-bottom: 1px;
    }
    .weituoren,
    .org-info {
      padding: 0 24rpx;
    }
  }
  .fix-bottom {
    background-color: white;
    padding: 20rpx 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 22rpx;

    box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
    .bottom-btn {
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
      .icon {
        width: 32rpx;
      }
    }
  }
}
</style>
