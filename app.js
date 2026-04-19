const { createApp } = require('glass-easel')

const app = createApp({
  onLaunch() {
    // 检查登录状态
    this.checkLogin()
  },

  async checkLogin() {
    const token = wx.getStorageSync('token')
    if (!token) {
      // 触发登录流程
      this.globalData.needLogin = true
    } else {
      // 验证 token 有效性
      try {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
          this.globalData.userInfo = userInfo
          this.globalData.tenant = wx.getStorageSync('tenant')
        }
      } catch (e) {
        console.error('读取用户信息失败', e)
      }
    }
  },

  globalData: {
    userInfo: null,
    tenant: null,
    needLogin: false
  }
})

app.init()
module.exports = app
