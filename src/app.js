import React from 'react';
import { useLaunch } from '@tarojs/taro'

import './app.scss'
import 'virtual:uno.css';
import {UserContext} from "./utils/const";
import api from "./utils/api";

function App({ children }) {
  const [user, setUser] = React.useState(null);

  useLaunch(async () => {
    // 获取启动参数
  })

  // 小程序全局用户信息 Context，按需改接口地址
  async function getUser(){
    // const res = await api.get('/info');
    // setUser(res.user);
  }

  // children 是将要会渲染的页面
  return <UserContext.Provider value={[user, setUser, getUser]}>
    {children}
  </UserContext.Provider>
}



export default App
