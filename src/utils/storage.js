import Taro from '@tarojs/taro'

const HISTORY_MAX = 10
const TOKEN_KEY = 'access_token'
const USER_KEY = 'user_info'
const SEARCH_HISTORY_KEY = 'search_history'

// 基础存储方法
const storage = {
  // 同步方法
  getSync: (key) => {
    try {
      const value = Taro.getStorageSync(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('Storage getSync error:', e)
      return null
    }
  },

  setSync: (key, value) => {
    Taro.setStorageSync(key, JSON.stringify(value))
  },

  removeSync: (key) => {
    Taro.removeStorageSync(key)
  },

  // 异步方法
  get: async (key) => {
    try {
      const { data } = await Taro.getStorage({ key })
      return JSON.parse(data)
    } catch (e) {
      return null
    }
  },

  set: async (key, value) => {
    await Taro.setStorage({ key, data: JSON.stringify(value) })
  },

  remove: async (key) => {
    await Taro.removeStorage({ key })
  },

  clear: async () => {
    await Taro.clearStorage()
  }
}

// 用户登录态管理
export const auth = {
  setToken: (token) => storage.setSync(TOKEN_KEY, token),
  getToken: () => storage.getSync(TOKEN_KEY),
  removeToken: () => storage.removeSync(TOKEN_KEY),

  setUser: (user) => storage.setSync(USER_KEY, user),
  getUser: () => storage.getSync(USER_KEY),
  removeUser: () => storage.removeSync(USER_KEY),

  clearAuth: () => {
    storage.removeSync(TOKEN_KEY)
    storage.removeSync(USER_KEY)
  }
}

// 搜索历史管理
export const history = {
  get: () => storage.getSync(SEARCH_HISTORY_KEY) || [],

  add: (keyword) => {
    const historyList = storage.getSync(SEARCH_HISTORY_KEY) || []
    const index = historyList.findIndex(item => item === keyword)
    
    if (index > -1) historyList.splice(index, 1)
    historyList.unshift(keyword)
    
    if (historyList.length > HISTORY_MAX) historyList.pop()
    storage.setSync(SEARCH_HISTORY_KEY, historyList)
  },

  clear: () => storage.removeSync(SEARCH_HISTORY_KEY)
}

export default storage