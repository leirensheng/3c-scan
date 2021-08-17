import request,{baseUrl} from "./httpRequest.js";

export function searchCertificate(data) {
  return request({url:`/identify/searchCertificate`,data,method:"POST"});
}

export function getDetail(id) {
    let openId = uni.getStorageSync('openId')
    return request({url:`/identify/getDetail/${openId}/${id}`,});
  }
  

  export function toggleCollect(id,isCollect) {
    let doCollect = isCollect?1: 0 
    let openId = uni.getStorageSync('openId')
    return request({url:`/certificateCollection/collection/${openId}/${id}/${doCollect}`,});
  }
  

  export function getHistory(page=1) {
    let openId = uni.getStorageSync('openId')
    return request({url:`/certificateQuery/listPage/${openId}/${page}`,});
  }
  

  export function getCollection(page=1) {
    let openId = uni.getStorageSync('openId')
    return request({url:`/certificateCollection/listPage/${openId}/${page}`,});
  }
  


  export function uploadPic(src){
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: baseUrl + "/identify/getImageText",
        fileType: "image",
        filePath: src,
        name: "file",
        success: (res) => {
          resolve(res);
        },
        fail: (e) => {
          uni.showToast({
            icon: "none",
            title: "上传失败",
            duration: 2000,
          });
          reject(e);
        },
      });
    });
  }