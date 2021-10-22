<template>
  <div
    class="result-item"
    :class="isInUser ? 'in-user' : isInCollect ? 'in-collect' : ''"
    @click="gotoDetail"
  >
    <div v-show="!loading">
      <div class="top">
        <uni-valid :status="result.status"></uni-valid>
        <div class="company">{{ result.clientName }}</div>
      </div>
      <div class="bottom">
        <div class="row" v-for="(item, index) in config" :key="index">
          <div class="name">{{ item.name }}</div>
          <div class="value">{{ getVal(item.type, result[item.id]) }}</div>
        </div>
      </div>
    </div>
    <div v-show="loading" class="loading">
      <div class="top">
        <uni-valid></uni-valid>
        <div class="company"></div>
      </div>
      <div class="bottom">
        <div class="row" v-for="(item, index) in config" :key="index">
          <div class="name"></div>
          <div class="value"></div>
        </div>
      </div>
      <div class="light"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    result: {
      type: Object,
      default: () => ({}),
    },
    isInUser: {
      type: Boolean,
      default: false,
    },
    isInCollect: {
      type: Boolean,
      default: false,
    },
    loading:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      config: [
        {
          id: "no",
          name: "证书编号",
        },
        {
          id: "productName",
          name: "产品名称",
        },
        {
          id: "specifications",
          name: "规格型号",
        },
        {
          id: "clientName",
          name: "认证委托人",
        },
        {
          id: "manufacturer",
          name: "制造商",
        },
        {
          id: "expireDate",
          name: "到期日期",
          type: "date",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    getVal(type, val) {
      if (type === "date") {
        return this.$formatDate(val);
      }
      return val;
    },
    gotoDetail() {
      if(this.loading) return
      let url = "/pages/certificate/detail?id=" + this.result.id;
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style scoped lang="scss">
$dark: rgba(0, 0, 0, 0.85);

.result-item {
  border-radius: 4px;
  padding-top: 32rpx;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 12rpx 0px rgba(0, 0, 0, 0.15);
  &.in-user {
    padding-top: 12rpx;
    box-shadow: none;
    border: none;
  }
  .top {
    display: flex;
    align-items: flex-end;
    .company {
      color: $dark;
      position: relative;
      top: 1px;
      line-height: 50rpx;
      // line-height: 44rpx;
      font-weight: 500;
      font-size: 32rpx;
    }
  }
  .bottom {
    padding: 22rpx;
    font-size: 28rpx;
    .row {
      display: flex;
      align-items: center;
      line-height: 56rpx;
      .name {
        min-width: 140rpx;
        margin-right: 24rpx;
        color: rgba(0, 0, 0, 0.65);
        font-weight: 400;
      }
      .value {
        font-weight: 500;
        color: $dark;
        text-align: left;
        word-break: break-all;
        // display: -webkit-box;
        overflow: hidden;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        display: -webkit-box;
        text-overflow: ellipsis;
      }
    }
  }
  .loading {
    $grey: #ededed;
    color: $grey;
    position: relative;
    .top {
      .company {
        background: $grey;
        flex: 1;
        height: 32rpx;
        margin: 9rpx 0;
        margin-right: 22rpx;
      }
    }
    .bottom {
      .row {
        margin: 28rpx 0;
        &:first-child {
          margin-top: 14rpx;
        }
        &:last-child {
          margin-bottom: 14rpx;
        }
        .name {
          background: $grey;
          height: 28rpx;
        }
        .value {
          background: $grey;
          flex: 1;
          height: 28rpx;
        }
      }
    }
  }
}
</style>
