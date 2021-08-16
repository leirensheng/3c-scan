import { checkLoginStatus } from "@/api/login.js";

export default async ()=>{
    let jsCode = uni.getStorageSync("jsCode")
    if(!jsCode){
      uni.clearStorage()
      return false
    }
    try{
      await checkLoginStatus(jsCode)
      return true
    }catch(e){
      uni.clearStorage()
      return false
    }
}