let baseUrl = process.env.NODE_ENV === 'production'?'https://3c.gdcers.com/3c-identify':'https://3c.gdcers.com/3c-identify'
let http = (option) => {
  let { timeout = 16000, data, method = "get",url } = option;
  return new Promise((resolve, reject) => {
    uni.request({
      url: baseUrl + url,
      timeout,
      dataType: "json",

      data,
      method: method, //'GET','POST'

      header: {
        "custom-header": "hello", //自定义请求头信息
      },
      success: (res) => {
        let { msg, message, code, data } = res.data;
        if (code !== 0) {
          uni.showToast({
            icon: "none",
            title: (msg || message),
            duration: 2000,
          });
          reject(res.data);
          return;
        }
        resolve(data);
      },
      fail: (res) => {
        uni.showToast({
          icon: "none",
          title: '请求失败',
          duration: 2000,
        });
        // uni.toast("网络不给力，请稍后再试~");
        reject(res);
      },
      complete: () => {},
    });
  });
};
export {baseUrl}
export default http