<template>
  <div class="my-tab">
    <div class="left" @click="change(0)">
      <div class="name" :class="active === 0 && 'active'">按同一企业推荐</div>
    </div>
    <div class="left-angle" v-if="active === 0"></div>
    <div class="right-angle" v-else></div>

    <div class="right" @click="change(1)">
      <div class="name" :class="active === 1 && 'active'">按同一型号推荐</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
    };
  },
  created() {},
  mounted() {},
  methods: {
    change(i) {
      this.active = i;
      this.$emit("change", i);
    },
  },
};
</script>

<style scoped lang="scss">
.left-angle {
  flex-shrink: 0;
  flex-grow: 0;
  width: 0;
  height: 0;
  border-bottom: 76rpx solid #f5f5f5;
  border-right: 76rpx solid transparent;
}
.right-angle {
  flex-shrink: 0;
  flex-grow: 0;
  width: 0;
  height: 0;
  border-bottom: 76rpx solid #f5f5f5;
  border-left: 76rpx solid transparent;
}
.my-tab {
  display: flex;
  .left,
  .right {
      flex:1;
    // width: 50%;
    // display: flex;
    .name {
      flex: 1;
      color: #999999;
      line-height: 76rpx;
      &.active {
        color: #292929;
        background-color: #f5f5f5;
      }
    }
  }
//   .right {
//     justify-content: space-between;
//   }
}
</style>
