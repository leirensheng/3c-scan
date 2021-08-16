<script>
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
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
    font-size: 28rpx;
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
    font-size: 28rpx;
    // width: 702rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .no-more{
    display: block;
    text-align: center;
    line-height: 3em;
    font-size: 28rpx;
    color: rgb(175, 174, 174);
  }
// .down{
// 	position: relative;
// 	&:after{
// 		position: absolute;
// 		right: 0;
// 		display: block;
// 		width: 72rpx;
// 		height: 16rpx;
// 		content: '';
// // background-size:cover;
// 		background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYZJREFUWEftlb9KxEAQxmf2UcTOd7HTO8F2/+QFbL1rxT5syBMoFoogWAiCgiBYCCooCBaCYCFYCBbJyh6bEHKbTJKLXJO02ZnvN99mviAs+cEl68MAMDgwOJA7oLU+QcQVY8xUSnn4H+uptd4AgD1jzLVSattqzADCMJwwxnYLopt9Qzjxg0wjTdNpEASTGUAcx6tJkryUpu4NoixudYwxa0qpx+IVWHtyQgezMIRHPEHEkRDiKL+CbHIfKQB0hvD0+2WMjTjnx5nm3Br2BeHp8+MmPy1etTcHFoXw1H8j4lgIcVbersog6grhqfsCgLGU8ty32rVJ2BaifB4RP+3knPOLqlwho7gphOfch7P9si7USABbTEF43r8726+oRG0EUAfhBPL8QMQ3Z/sNJT6XA1RBhRN5mTHmlTFmv/ZbqldlDlCFNRDPALAlpbyjepA5QDXwQDzZyTnn91Rt4xygGkVRtA4AOwBgf2L7QogHqqZ1DnRp2Lam8Ra0bdz0/AAwODA48AfiqKchOV4HqwAAAABJRU5ErkJggg==')
// 	}
// }
</style>
