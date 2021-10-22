<script>
export default {
  onLaunch: function () {
    // console.log("App Launch");
  },
  onShow: function () {
    // console.log("App Show");
  },
  onHide: function () {
    // console.log("App Hide");
  },
};
</script>

<style lang="scss" >
page {
  height: 100%;
  background-color: #f5f5f5;
}

/*每个页面公共css */
view,
text,
span,
div {
  box-sizing: border-box;
  font-family: 微软雅黑;
}
.btn {
  border-radius: 4px;
  background-color: #355dee;
  height: 80rpx;
  font-size: 32rpx;
  width: 100%;
  // width: 702rpx;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn-primary {
  width: 100%;
  border-radius: 4px;
  border: 1px solid #355dee;
  color: #355dee;
  height: 80rpx;
  font-size: 32rpx;
  // width: 702rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.no-more {
  display: block;
  text-align: center;
  line-height: 3em;
  font-size: 28rpx;
  color: rgb(175, 174, 174);
}
.safe-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: white;
}
.light {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    100deg,
    rgba(255, 255, 255, 0) 48%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 52%
  );
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 1.5s loading ease-in-out infinite;
}
@keyframes loading {
  to {
    background-position-x: -20%;
  }
}
</style>
