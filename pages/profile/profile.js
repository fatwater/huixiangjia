// pages/profile/profile.js
const { logout } = require('../../api/auth')
const { getMyBookings } = require('../../api/property')
const { getMyOrders } = require('../../api/groupbuy')
const { getMyVisitors } = require('../../api/access')
const { getUserInfo as getLocalUserInfo, clearAuth } = require('../../utils/auth')

Page({
  data: {
    userInfo: null,
    tenantInfo: null,
    stats: {
      bookings: 0,
      orders: 0,
      visitors: 0
    },
    menuItems: [
      { id: 'meetings', icon: 'calendar', label: '我的预约', path: '/pages/property/my-bookings/my-bookings' },
      { id: 'orders', icon: 'shopping-cart', label: '我的订单', path: '/pages/groupbuy/order/order' },
      { id: 'visitors', icon: 'team', label: '我的访客', path: '/pages/access/visitor/visitor' },
      { id: 'records', icon: 'file-text', label: '通行记录', path: '/pages/access/record/record' }
    ]
  },

  onLoad() {
    this.loadUserInfo()
  },

  onShow() {
    this.loadUserInfo()
    this.loadStats()
  },

  /**
   * 加载用户信息
   */
  loadUserInfo() {
    const userInfo = getLocalUserInfo()
    if (userInfo) {
      this.setData({
        userInfo,
        tenantInfo: wx.getStorageSync('tenantInfo') || null
      })
    }
  },

  /**
   * 加载统计数据
   */
  async loadStats() {
    try {
      const [bookings, orders, visitors] = await Promise.all([
        getMyBookings().catch(() => []),
        getMyOrders().catch(() => []),
        getMyVisitors().catch(() => [])
      ])

      this.setData({
        stats: {
          bookings: Array.isArray(bookings.list) ? bookings.list.length : (Array.isArray(bookings) ? bookings.length : 0),
          orders: Array.isArray(orders.list) ? orders.list.length : (Array.isArray(orders) ? orders.length : 0),
          visitors: Array.isArray(visitors.list) ? visitors.list.length : (Array.isArray(visitors) ? visitors.length : 0)
        }
      })
    } catch (err) {
      console.error('加载统计数据失败:', err)
    }
  },

  /**
   * 菜单点击
   */
  onMenuClick(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({ url: path })
  },

  /**
   * 查看个人信息
   */
  goToProfile() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  /**
   * 设置
   */
  goToSettings() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  },

  /**
   * 退出登录
   */
  async onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await logout()
          } catch (err) {
            // 忽略错误
          }
          clearAuth()
          wx.redirectTo({ url: '/pages/index/index' })
        }
      }
    })
  },

  /**
   * 联系客服
   */
  contactService() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  }
})
