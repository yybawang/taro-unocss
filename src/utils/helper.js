import Taro from "@tarojs/taro";
import api from "./api";
import storage from "./storage";


export function logger(...msg){
  if(import.meta.env.PROD){
    return false;
  }
  msg.map(item => console.info(typeof item, item));
}

/**
 * 模拟等待时间
 * @param timeout
 * @returns {Promise<unknown>}
 */
export function wait(timeout = 0){
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), timeout);
  });
}

/**
 * 按钮点击获取用户手机号并登录，同时返回用户数据对象
 * @param e
 * @returns {Promise<null|object>}
 */
export async function onGetPhoneNumber(e){
  return new Promise(async (resolve, reject) => {
    if(e.detail.errMsg === 'getPhoneNumber:ok'){
      const res = await Taro.login();
      const res2 = await api.post('/login/mobile', {login_code: res.code, ...e.detail});
      storage.setSync('token', res2.token);
      const res3 = await api.get('/info');
      resolve(res3.user);
    }
  });

}
