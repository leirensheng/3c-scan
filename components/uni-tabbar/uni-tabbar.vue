<template>
  <view class="bottom">
    <div class="center" @click="scan">
      <image class="bg" mode="widthFix" src="/static/circle.png"></image>
      <div class="circle">
        <image class="camera" mode="widthFix" src="/static/camera.png"></image>
      </div>
    </div>
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
    defaultTab: {
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
      this.changeTab(this.defaultTab);
    }
  },
  methods: {
    async scan() {
      if(!this.isLogin){
        this.$toLogin()
        return
      }
      uni.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["camera", "album"], //这要注意，camera掉拍照，album是打开手机相册
        success: (res) => {
          console.log(res);
          const tempFilePaths = res.tempFilePaths;
          //  uni.previewImage({
          //   urls: res.tempFilePaths,
          //   longPressActions: {
          //       itemList: ['发送给朋友', '保存图片', '收藏'],
          //       success: function(data) {
          //           console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
          //       },
          //       fail: function(err) {
          //           console.log(err.errMsg);
          //       }
          //   }
        // });
        },
      });
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
      this.$emit("change", tab);
      if (!this.isInIndex) {
        this.changeTab(tab);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 140rpx;
  .center {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: 200rpx;
    z-index: 6;
    .bg {
      position: absolute;
      width: 200rpx;
      // left: 5rpx;
      top: -12rpx;
    }
    .circle {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      margin-top: 8rpx;
      position: relative;
      z-index: 2;
      width: 120rpx;
      height: 120rpx;
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
  .content {
    background-color: white;

    box-shadow: 0px -1px 2px 0px rgba(0, 21, 41, 0.18);
    position: absolute;
    bottom: 0;
    height: 76%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 100rpx;
    .left,
    .right {
      .icon {
        width: 54rpx;
        height: 54rpx;
      }
      .name {
        font-size: 24rpx;
        &.active {
          color: #355dee;
        }
      }
      width: 100rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
