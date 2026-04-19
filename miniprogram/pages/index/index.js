const app = getApp()
const auth = require('../../utils/auth')
const api = require('../../utils/api')

Page({
  data: {
    userInfo: null,
    tenant: null,
    modules: [
      { id: 'property', title: '办公物业', icon: '🏢', color: '#1890ff', path: '/pages/property/meeting/meeting' },
      { id: 'merchant', title: '周边商家', icon: '🏪', color: '#52c41a', path: '/pages/merchant/list/list' },
      { id: 'groupbuy', title: '公司团购', icon: '🛒', color: '#faad14', path: '/pages/groupbuy/list/list' },
      { id: 'access', title: '公司门禁', icon: '🚪', color: '#722ed1', path: '/pages/access/visitor/visitor' }
    ],
    quickActions: [
      { id: 'bookings', icon: '📅', text: '我的预约', path: '/pages/property/my-bookings/my-bookings' },
      { id: 'visitors', icon: '👤', text: '访客邀请', path: '/pages/access/visitor/visitor' },
      { id: 'orders', icon: '📦', text: '我的订单', path: '/pages/groupbuy/order/order' },
      { id: 'records', icon: '🚪', text: '开门记录', path: '/pages/access/record/record' }
    ],
    showLogin: false
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const userInfo = auth.getUserInfo()
    const tenant = auth.getTenant()

    if (userInfo && tenant) {
      this.setData({ userInfo, tenant })
    } else {
      this.setData({ showLogin: true })
    }
  },

  onLoginSuccess() {
    this.checkLoginStatus()
  },

  async handleLogin() {
    try {
      wx.showLoading({ title: '登录中...' })
      await auth.login()
      wx.hideLoading()
      this.setData({ showLogin: false })
      this.checkLoginStatus()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  },

  onModuleTap(e) {
    const { module } = e.currentTarget.dataset
    if (!auth.isLoggedIn()) {
      this.setData({ showLogin: true })
      return
    }
    wx.navigateTo({ url: module.path })
  },

  onActionTap(e) {
    const { action } = e.currentTarget.dataset
    if (!auth.isLoggedIn()) {
      this.setData({ showLogin: true })
      return
    }
    wx.navigateTo({ url: action.path })
  }
})
