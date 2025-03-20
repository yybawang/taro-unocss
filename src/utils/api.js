import Taro from '@tarojs/taro'
import {API_DOMAIN} from './const'
import storage from "./storage";
import {logger} from "./helper";

const BASE_URL = API_DOMAIN;

const request = async ({ url, method = 'GET', data = {}, header = {} }) => {
  // 请求拦截：添加通用请求头
  const token = storage.getSync('token');
  const commonHeader = {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
    ...header
  }

  try {
    const res = await Taro.request({
      url: `${BASE_URL}/api${url}`,
      method,
      data,
      header: commonHeader,
      timeout: 10000
    })

    // 响应拦截
    if (res.statusCode >= 200 && res.statusCode < 300) {
      return res.data
    } else {
      throw new Error(res.data?.message || '请求失败')
    }
  } catch (error) {
    Taro.showToast({
      title: error.message || '网络异常',
      icon: 'none'
    })
    throw error
  }
}

// 文件下载特殊处理
const downloadFile = (url) => {
  return Taro.downloadFile({
    url: `${BASE_URL}${url}`,
    header: {
      Authorization: Taro.getStorageSync('token') ? `Bearer ${Taro.getStorageSync('token')}` : ''
    },
    responseType: 'arraybuffer'
  })
}

// 文件上传方法
const uploadFile = async (filePath, formData = {}, name = 'file') => {
  await Taro.showLoading({title: '上传中..'});
  try {
    const res = await Taro.uploadFile({
      url: `${BASE_URL}/api/upload`,
      filePath,
      name,
      formData: {
        ...formData,
        Authorization: Taro.getStorageSync('token') ? `Bearer ${Taro.getStorageSync('token')}` : ''
      },
      header: {
        'Content-Type': 'multipart/form-data'
      }
    })

    // 处理响应数据
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try{Taro.hideLoading()}catch (e) {}
      return res.data;
    }
  } catch (error) {
    Taro.showToast({
      title: error.message || '上传异常',
      icon: 'none'
    })
  }
  try{Taro.hideLoading()}catch (e) {}
}

export default {
  get: (url, params) => request({ url, method: 'GET', data: params }),
  post: (url, data) => request({ url, method: 'POST', data }),
  put: (url, data) => request({ url, method: 'PUT', data }),
  delete: (url) => request({ url, method: 'DELETE' }),
  download: downloadFile,
  upload: uploadFile
}
