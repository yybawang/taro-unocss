export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/message/index',
    'pages/more/index',
    'pages/more/info',
    'pages/address/index',
    'pages/address/edit',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '小程序名称',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    "selectedColor": "#3670EE",
    "backgroundColor": "#FFFFFF",
    "color": "#999999",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "./images/tabbar/home.png",
        "selectedIconPath": "./images/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/message/index",
        "text": "消息",
        "iconPath": "./images/tabbar/message.png",
        "selectedIconPath": "./images/tabbar/message-active.png"
      },
      {
        "pagePath": "pages/more/index",
        "text": "更多",
        "iconPath": "./images/tabbar/more.png",
        "selectedIconPath": "./images/tabbar/more-active.png"
      }
    ]
  },
})
