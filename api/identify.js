import request, { baseUrl } from "./httpRequest.js";
import env from './getEnv.js'
export function searchCertificate(data) {
  return request({ url: `/identify/searchCertificate`, data, method: "POST" });
}

export function getDetail(id) {
  let openId = uni.getStorageSync("openId");
  return request({ url: `/identify/getDetail/${openId}/${id}` });
}

export function toggleCollect(id, isCollect) {
  let doCollect = isCollect ? 1 : 0;
  let openId = uni.getStorageSync("openId");
  return request({
    url: `/certificateCollection/collection/${openId}/${id}/${doCollect}`,
  });
}

export function getHistory(page = 1) {
  let openId = uni.getStorageSync("openId");
  return request({ url: `/certificateQuery/listPage/${openId}/${page}` });
}

export function removeHistory(id) {
  let openId = uni.getStorageSync("openId");
  return request({ url: `/certificateQuery/delete/${openId}/${id}` });
}

export function getCollection(page = 1) {
  let openId = uni.getStorageSync("openId");
  return request({ url: `/certificateCollection/listPage/${openId}/${page}` });
}

export function uploadPic(src) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: baseUrl + "/identify/getImageText",
      fileType: "image",
      filePath: src,
      name: "file",
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res);
        } else {
          uni.showToast({
            icon: "none",
            title: "上传失败",
            duration: 2000,
          });
          reject();
        }
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

export function subscribe(historyId) {
  let envValue =  ["develop","trial"].includes(env) ? 0 : 1;
  return request({ url: `/identify/subscribe/${historyId}/${envValue}` });
}

export function getCertificateByHistory(historyId) {
  return request({ url: `/identify/searchCertificate/${historyId}` });
}

export function finishSync(historyId) {
  return request({ url: `/identify/finishSync/${historyId}` });
}
