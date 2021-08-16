<template>
  <div class="main">
    <search
      :isLogin="isLogin"
      v-if="isReady && tab === 'search'"
      :query="query"
    ></search>
    <user :user="user" v-if="isReady && tab === 'user'" :isShow="isShow" />
    <uni-tabbar
      :isLogin="isLogin"
      v-if="defaultTab"
      :defaultTab="defaultTab"
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
      user:null,
      isLogin: false,
      tab: "",
      query: null,
      defaultTab: "",
      isReady: false,
      isShow:false,
    };
  },
  created() {},

  onLoad({ tab, query }) {
    let map = {
      search: "CCC认证证书检索",
      user: "我的",
    };
    this.defaultTab = tab;
    this.tab = tab;
    if (query) {
      this.query = JSON.parse(decodeURIComponent(query));
    }
    uni.setNavigationBarTitle({
      title: map[tab],
    });
    this.isReady = true;
  },
  async onShow() {
    this.isLogin = await this.$checkLogin();
    this.user = uni.getStorageSync('user')
    this.isShow = true
  },

  onHide(){
    this.isShow = false
  },

  mounted() {},
  methods: {
    handleTabChane(tab) {
      this.tab = tab;
    },
  },
};
</script>

<style scoped lang="scss">
</style>
