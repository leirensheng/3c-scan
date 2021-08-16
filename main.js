import Vue from "vue";
import App from "./App";
import checkLogin from "@/utils/checkLogin.js";
Vue.config.productionTip = false;
Vue.prototype.$checkLogin = checkLogin;

Vue.prototype.$formatDate = (val) => {
  let date = val;
  if (typeof val !== "object") {
    date = new Date(val);
  }
  console.log(date, typeof val);
  let month = date.getMonth() + 1;
  month = month < 9 ? `0${month}` : month;
  let day = date.getDate();
  day = day < 9 ? `0${day}` : day;
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

Vue.prototype.$toLogin = ()=>{
    uni.navigateTo({url:'/pages/login/index'})
}


App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
