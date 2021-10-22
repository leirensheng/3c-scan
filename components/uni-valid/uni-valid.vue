<template>
  <div class="status">
    <image
      class="pic"
      :src="src"
      mode="widthFix"
      :class="name === 'expired' && 'longer'"
    ></image>

    <div class="name">{{ status }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    status: {
      type: [String],
      default: '',
    },
  },
  computed: {
   
    style() {
      return {
        width: "100rpx",
        //   width: this.status==='expired'?'148rpx':'100rpx'
      };
    },
    name(){
       let name = 'cancel'
       if(this.status===''){
         name = 'loading-valid'
       }
      else if(this.status==='有效'){
        name= 'valid'
      }else if(this.status.length>2){
        name="expired"
      }
      return name
    },


    src() {
      
      return `/static/${this.name}.svg`;
    },
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.status {
  color: white;
  font-size: 26rpx;
  // line-height: 40rpx;
  position: relative;
  .pic {
    display: block;
    width: 104rpx;
    position: relative;
    left: -10rpx;
    &.longer {
      width: 152rpx;
    }
  }
  .name {
    word-break: none;
    position: absolute;
    top: 57.62%;
    transform: translateY(-50%);
    line-height: 1;
    left: 16rpx;
  }
}
</style>
