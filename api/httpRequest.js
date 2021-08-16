let baseUrl = process.env.NODE_ENV === 'production'?'':'http://192.168.2.4:38080/3c-identify'
let http = (option) => {
  let { timeout = 6000, data, method = "get",url } = option;
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
        console.log(res.data);
        let { msg, message, code, data } = res.data;
        if (code !== 0) {
          uni.showToast(msg || message);
          reject(res.data);
          return;
        }
        resolve(data);
      },
      fail: (res) => {
        console.log(res);
        uni.showToast("");

        // uni.toast("网络不给力，请稍后再试~");
        reject(res);
      },
      complete: () => {},
    });
  });
};

export default http