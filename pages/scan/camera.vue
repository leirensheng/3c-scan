<template>
  <view class="scan-page">
    <div class="scan" v-if="!src">
      <camera
        device-position="back"
        flash="auto"
        @error="error"
        class="camera"
      ></camera>
      <div class="bottom">
        <div class="desc">拍取产品名称／规格型号／制造商</div>
        <div class="pic-btn" @click="analyse"></div>
        <div class="local" @click="analyse('local')">
          <image class="pic" mode="widthFix" src="/static/camera.svg"></image>
          <span class="name">相册</span>
        </div>
      </div>
    </div>

    <!-- <view>预览</view> -->
    <div class="scaning" v-else>
      <image mode="widthFix" :src="src" class="preview"></image>
      <div class="loading" v-if="loading"></div>
    </div>
  </view>
</template>

<script>
import { uploadPic } from "@/api/identify.js";
export default {
  data() {
    return {
      src: "",
      loading: false,
      data: {},
    };
  },
  methods: {
    async analyse(type) {
      let src;
      if (type === "local") {
        src = await this.chooseImage();
      } else {
        src = await this.takePhoto();
      }
      this.src = src;
      this.loading = true;
      let res = await this.upload();
      this.loading = false;

      this.handleSuccess(res);
    },

    takePhoto() {
      return new Promise((resolve, reject) => {
        const ctx = uni.createCameraContext();
        ctx.takePhoto({
          quality: "high",
          success: (res) => {
            resolve(res.tempImagePath);
          },
          fail: (e) => {
            uni.showToast({
              icon: "none",
              title: "相机调用失败",
              duration: 2000,
            });
            reject(e);
          },
        });
      });
    },
    handleSuccess({ data }) {
      console.log(typeof data);
      let val = JSON.parse(data);
      let res = val.data;
      console.log(res);
      let keys = [
        "productName",
        "specifications",
        "factory",
        "manufacturer",
        "distributor",
        "importer",
        "agent",
      ];
      let isNoResult = keys.every((key) => !res[key]);
      if (isNoResult) {
        uni.navigateTo({
          url: "/pages/scan/noResult",
        });
      } else {
        let obj = keys.reduce((prev, cur) => {
          prev[cur] = res[cur];
          return prev;
        }, {});
        obj.imageText = res.imageText;
        uni.navigateTo({
          url:
            "/pages/scan/result?query=" +
            encodeURIComponent(JSON.stringify(obj)),
        });
      }
      this.src = "";
      this.loading = false;
    },
    async upload() {
      return await uploadPic(this.src);
    },
    chooseImage() {
      return new Promise((resolve, reject) => {
        uni.chooseImage({
          count: 1,
          sizeType: ["original", "compressed"],
          sourceType: ["album"], //这要注意，camera掉拍照，album是打开手机相册
          success: (res) => {
            resolve(res.tempFilePaths[0]);
          },
          fail: (e) => {
            reject(e);
          },
        });
      });
    },
    error(e) {
      uni.showToast({
        icon: "none",
        title: "请打开摄像头权限，再重新进入本页面",
        duration: 4000,
      });
      console.log(e.detail);
    },
  },
};
</script>

<style scoped lang="scss">
.scan-page {
  height: 100%;
  .scan {
    height: 100%;
    .camera {
      height: 100%;
      width: 100%;
    }

    .bottom {
      color: white;
      position: fixed;
      bottom: 0;
      right: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      padding-bottom: 54rpx;
      padding-right: 48rpx;
      // justify-content: center;
      align-items: center;
      .desc {
        font-weight: bold;
        font-size: 32rpx;
        margin-bottom: 24rpx;
      }
      .pic-btn {
        width: 118rpx;
        height: 118rpx;
        border-radius: 50%;
        background-color: white;
        border: 2px solid grey;
        position: relative;

        &:before {
          display: block;
          content: "";
          position: absolute;
          width: 144rpx;
          height: 144rpx;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          // background-color: red;
          background-color: rgba(255, 255, 255, 0.5);
        }
      }
      .local {
        position: absolute;
        right: 48rpx;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        width: 118rpx;
        height: 118rpx;

        background-color: rgba(161, 161, 161, 0.95);
        .pic {
          width: 45rpx;
        }
        .name {
          margin-top: 2px;
          font-size: 24rpx;
        }
      }
    }
  }
  .scaning {
    position: relative;
    .preview {
      width: 100%;
    }
    .loading {
      width: 100%;
      top: 0;
      position: absolute;
      height: 180rpx;
      background: linear-gradient(
        360deg,
        rgba(2, 193, 96, 0.3) 0%,
        rgba(2, 193, 96, 0) 100%
      );
      animation: mymove 3s linear infinite;
      @keyframes mymove {
        0% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(80vh);
        }
        100% {
          transform: translateY(0);
        }
      }
    }
  }
}
</style>
