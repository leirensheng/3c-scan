<template>
  <div class="" v-if="isReady">
    <div class="row" v-for="(item, index) in config" :key="index">
      <div
        class="name"
        :style="{
          width: (item.width || (750-24-valueWidth)) + 'rpx',
          color: item.lightName ? '#999999' : 'rgba(0, 0, 0, 0.65)',
        }"
      >
        {{ item.name }}：
      </div>
      <div
        class="value"
        :style="{
            width: valueWidth+'rpx',
          color: item.lightName ? '#999999' : 'rgba(0, 0, 0, 0.85)',
          fontWeight: item.lightName ? '400' : '500',
        }"
      >
        {{ item.formatter(data[item.id]) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isReady: false,
    };
  },
  props: {
      valueWidth:{
          type:Number,
          default: 350,
      },
    config: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  created() {
    this.config.forEach((one) => {
      let formatter = (val) => val || "无";
      if(one.type==='date' || one.name.indexOf('日期')!==-1){
        formatter = this.$formatDate
      }
      one.formatter = formatter;
    });
    this.isReady = true;
  },
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20rpx 0;
  font-size: 28rpx;
  .name {
    line-height: 44rpx;
    // margin-right: 24rpx;
    font-weight: 400;
  }
  .value {
    word-break: break-all;
    flex-shrink: 0;
    flex-grow: 0;
    font-weight: 500;
    line-height: 1.8em;
    text-align: justify;
  }
}
</style>
