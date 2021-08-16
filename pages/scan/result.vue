<template>
  <div class="scan-result">
    <div class="top">
      <div class="row" v-for="item in data" :key="item.id">
        <label class="label" :for="item.id">{{ item.name }}：</label>
        <input
          :name="item.id"
          class="uni-input"
          v-model="form[item.id]"
          placeholder="未显示"
        />

        <image
          mode="widthFix"
          class="icon"
          src="/static/down.svg"
          @click="showDailog"
        />
      </div>
    </div>
    <div class="bottom">
      <div class="btn-primary" @click="back">重新拍照</div>
      <div class="btn" @click="search">确认</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogShow: false,
      data: [
        {
          name: "产品名称",
          id: "productName",
        },
        {
          name: "规格型号",
          id: "specifications",
        },
        {
          name: "生产商",
          id: "no",
        },
        {
          name: "制造商",
          id: "clientName",
        },
        {
          name: "经销商",
          id: "clientName",
        },
        {
          name: "进口商",
          id: "clientName",
        },
        {
          name: "代理商",
          id: "clientName",
        },
      ],
      form: {},
    };
  },
  created() {
    if (!this.query) {
      this.form = this.data.reduce((prev, cur) => {
        prev[cur.id] = "";
        return prev;
      }, {});
    } else {
      this.form = { ...this.query };
    }
    console.log(this.form);
  },
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    showDailog() {
      this.dialogShow = true;
    },
    back() {
      uni.navigateBack();
      // setTimeout(() => {

      // }, 1000);
    },
    search() {
      uni.showLoading({
        title: "查询中",
      });
      try {
        let params = {
          ...this.form,
          searchType: 2,
        };
        let res = {
          agent: "string",
          category: "string",
          certificates: [
            // {
            //   category: "分类",
            //   clientName: "string",
            //   expireDate: "2021-08-05T07:30:06.497Z",
            //   id: 0,
            //   manufacturer: "管理封建士大夫",
            //   no: "55454",
            //   productName: "反政府的",
            //   productSubName: "发范德萨发",
            //   specifications: "天太热特",
            //   status: "暂停",
            //   statusIndex: 1,
            // },
          ],
          clientName: "string",
          distributor: "string",
          factory: "string",
          imageText: "string",
          importer: "string",
          manufacturer: "string",
          no: "string",
          openId: "string",
          productName: "string",
          program: "string",
          recommendCertificates: {
            enList: [
              {
                category: "分类",
                clientName: "string",
                expireDate: "2021-08-05T07:30:06.497Z",
                id: 0,
                manufacturer: "管理封建士大夫",
                no: "55454",
                productName: "反政府的",
                productSubName: "发范德萨发",
                specifications: "天太热特",
                status: "string",
                statusIndex: 0,
              },
            ],
            specList: [
              {
                category: "string",
                clientName: "string",
                expireDate: "2021-08-05T07:30:06.497Z",
                id: 0,
                manufacturer: "string",
                no: "string",
                productName: "string",
                productSubName: "string",
                specifications: "string",
                status: "string",
                statusIndex: 0,
              },
               {
                category: "string",
                clientName: "string",
                expireDate: "2021-08-05T07:30:06.497Z",
                id: 0,
                manufacturer: "string",
                no: "string",
                productName: "string",
                productSubName: "string",
                specifications: "string",
                status: "string",
                statusIndex: 0,
              },
            ],
          },
          scrollId: "string",
          searchType: 0,
          specifications: "string",
          status: "string",
        };

        res.certificate = res.certificates ? res.certificates[0] : null;

        if (res.certificate) {
          let val = encodeURIComponent(JSON.stringify(res.certificate));

          uni.navigateTo({ url: "/pages/scan/match?query=" + val });
        } else if (res.recommendCertificates) {
           uni.setStorageSync(
            "recommend",
            res.recommendCertificates
          );
        } else {
          uni.removeStorageSync("recommend");
        }
        uni.navigateTo({
          url: "/pages/scan/noMatch",
        });
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
.scan-result {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .top {
    background-color: white;
    padding: 24rpx 24rpx 48rpx 24rpx;
    .row {
      position: relative;
      border-bottom: 1px solid #d4d4d4;
      padding: 30rpx 0;
      padding-left: 24rpx;
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
  }
  .bottom {
    background-color: white;
    display: flex;
    padding: 20rpx 24rpx;
    gap: 0 24rpx;
    > * {
      width: 340rpx;
    }
  }
}
</style>
