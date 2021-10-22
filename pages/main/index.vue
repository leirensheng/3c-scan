<template>
  <div class="main">
    <search
      :isLogin="isLogin"
      v-if="isReady"
      v-show="tab === 'search'"
      :query="query"
    ></search>
    <user
      :user="user"
      v-if="isReady"
      v-show="tab === 'user'"
      :isShow="isShow"
      @changeQuery="handleChangeQuery"
    />
    <uni-tabbar
      :isLogin="isLogin"
      v-if="tab"
      v-model="tab"
      :isInIndex="false"
      @change="handleTabChane"
    ></uni-tabbar>
  </div>
</template>


<script>
export default {
  components: {},
  data() {
    return {
      map: {
        search: "CCC认证证书检索",
        user: "我的",
      },
      user: null,
      isLogin: false,
      tab: "",
      query: null,
      isReady: false,
      isShow: false,
    };
  },
  created() {},

  onLoad({ tab, query }) {
    this.tab = tab;
    if (query) {
      this.query = JSON.parse(decodeURIComponent(query));
    }
    uni.setNavigationBarTitle({
      title: this.map[tab],
    });
    this.isReady = true;
  },
  watch:{
    tab(val){
      uni.setNavigationBarTitle({
        title: this.map[val],
      });
    }
  },
  async onShow() {
    this.isLogin = await this.$checkLogin();
    this.user = uni.getStorageSync("user");
    this.isShow = true;
  },

  onHide() {
    this.isShow = false;
  },

  mounted() {},
  methods: {
    handleChangeQuery(query){
      this.tab = 'search'
      this.query = query
    },
  },
};
</script>

<style scoped lang="scss">
</style>
