// 获取当前帐号信息
const accountInfo = wx.getAccountInfoSync();
// env类型
var env = ""
//当手机处于低版本的情况下,直接将地址写成开发版的
if (!accountInfo.miniProgram.envVersion) {
  env = 'release'
} else {
  env = accountInfo.miniProgram.envVersion
}
console.log(1,env)
export default env;