<template>
  <view class="bottom">
      <image class="bg" mode="widthFix" src="/static/circle.png"></image>
    <div class="content">
      <div class="left" @click="switchTab('search')">
        <img
          v-if="isActiveSearch"
          class="icon"
          src="/static/search-active.svg"
          alt=""
        />
        <img v-else class="icon" src="/static/search.svg" alt="" />

        <span class="name" :class="isActiveSearch && 'active'">CCC查询</span>
      </div>
      <div class="middle" @click="scan">
        <image class="camera" mode="widthFix" src="/static/camera2.svg"></image>
      </div>
      <div class="right" @click="switchTab('user')">
        <img
          v-if="isActiveUser"
          class="icon"
          src="/static/user-active.svg"
          alt=""
        />
        <image v-else class="icon" src="/static/user.svg" alt="" mode="widthFix" ></image>
        <span class="name" :class="isActiveUser && 'active'">我的</span>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
      isActiveUser: true,
      isActiveSearch: false,
    };
  },
  props: {
    isLogin:{
      type:Boolean,
      default:false,
    },
    isInIndex: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      default: "user",
    },
  },
 async mounted(){
  //  console.log(2222,res)
    // console.log(res)
      //  this.ctx=uni.createCameraContext()

 },
  created() {
    if (this.isInIndex) {
      this.isActiveUser = this.isActiveSearch = true;
    } else {
      this.changeTab(this.value);
    }
  },
  watch:{
    value(){
      this.changeTab(this.value)
    },
  },
  methods: {
    async scan() {
      if(!this.isLogin){
        this.$toLogin()
        return
      }
      uni.navigateTo({
        url:'/pages/scan/camera'
      })
      return

    },
    changeTab(tab) {
      if (tab === "user") {
        this.isActiveUser = true;
        this.isActiveSearch = false;
      } else {
        this.isActiveUser = false;
        this.isActiveSearch = true;
      }
    },
    switchTab(tab) {
      this.$emit("input", tab);
      if (this.isInIndex) {
         this.$emit('tabClick',tab)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom {
  position: fixed;
  bottom: 0;
  box-sizing: content-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  width: 100%;
  height: 140rpx;

    .bg {
          position: absolute;
    left: 0;
    top: 0;
    z-index: 6;
      position: absolute;
      width: 750rpx;
      top: -13rpx;
    }

  
  .content {
    z-index: 7;
    background-color: white;
    position: absolute;
    bottom: 0;
    height: 76%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .left{
      margin-left: 80rpx;
    }
    .right{
      margin-right: 80rpx;
    }
    .left,
    .right {
      .icon {
        width: 54rpx;
        height: 54rpx;
      }
      .name {
        font-size: 24rpx;
        color: #999999;
        &.active {
          color: #355dee;
        }
      }
      width: 120rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .middle {
      position: relative;
      top: -14%;
      z-index: 2;
      width: 115rpx;
      height: 115rpx;
      border-radius: 50%;
      background-color: #355dee;
      display: flex;
      justify-content: center;
      align-items: center;
      .camera {
        width: 60rpx;
      }
    }
  }
}
</style>
