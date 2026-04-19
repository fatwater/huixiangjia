// pages/index/index.js
const { getProducts } = require('../../api/groupbuy')
const { getMerchants } = require('../../api/merchant')
const { getMeetingRooms } = require('../../api/property')
const { isLoggedIn } = require('../../utils/auth')

Page({
  data: {
    hasUserInfo: false,
    greeting: '',
    meetingRooms: [],
    hotProducts: [],
    nearbyMerchants: [],
    loading: true
  },

  onLoad() {
    // 设置问候语
    const hour = new Date().getHours()
    let greeting = '晚上好'
    if (hour < 12) greeting = '早上好'
    else if (hour < 18) greeting = '下午好'
    this.setData({ greeting })

    // 检查登录状态
    const hasUserInfo = isLoggedIn()
    this.setData({ hasUserInfo })

    if (!hasUserInfo) {
      this.doWecomLogin()
    } else {
      this.loadHomeData()
    }
  },

  onShow() {
    if (this.data.hasUserInfo) {
      this.loadHomeData()
    }
  },

  onPullDownRefresh() {
    this.loadHomeData().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 企业微信登录
   */
  async doWecomLogin() {
    try {
      // 显示 loading
      wx.showLoading({ title: '登录中...' })

      // 获取企业微信授权码
      const loginRes = await wx.login()

      // 调用后端登录接口
      const { login } = require('../../api/auth')
      const result = await login(loginRes.code)

      // 处理登录成功
      const { handleLoginSuccess } = require('../../api/auth')
      handleLoginSuccess(result)

      this.setData({ hasUserInfo: true })
      this.loadHomeData()
    } catch (err) {
      console.error('登录失败:', err)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 加载首页数据
   */
  async loadHomeData() {
    try {
      this.setData({ loading: true })

      // 并行请求多个接口
      const [products, merchants, rooms] = await Promise.all([
        getProducts({ page: 1, pageSize: 3 }).catch(() => []),
        getMerchants({ page: 1, pageSize: 6 }).catch(() => []),
        getMeetingRooms().catch(() => [])
      ])

      this.setData({
        hotProducts: Array.isArray(products.list) ? products.list : [],
        nearbyMerchants: Array.isArray(merchants.list) ? merchants.list : [],
        meetingRooms: Array.isArray(rooms) ? rooms : [],
        loading: false
      })
    } catch (err) {
      console.error('加载数据失败:', err)
      this.setData({ loading: false })
    }
  },

  /**
   * 跳转到会议室页面
   */
  goToMeeting() {
    wx.switchTab({ url: '/pages/property/meeting/meeting' })
  },

  /**
   * 跳转到商家列表
   */
  goToMerchants() {
    wx.switchTab({ url: '/pages/merchant/list/list' })
  },

  /**
   * 跳转到团购页面
   */
  goToGroupbuy() {
    wx.switchTab({ url: '/pages/groupbuy/list/list' })
  },

  /**
   * 跳转到门禁页面
   */
  goToAccess() {
    wx.navigateTo({ url: '/pages/access/code/code' })
  },

  /**
   * 查看更多会议室
   */
  goToMoreMeetings() {
    wx.navigateTo({ url: '/pages/property/meeting/meeting' })
  },

  /**
   * 查看更多商品
   */
  goToMoreProducts() {
    wx.navigateTo({ url: '/pages/groupbuy/list/list' })
  },

  /**
   * 查看更多商家
   */
  goToMoreMerchants() {
    wx.navigateTo({ url: '/pages/merchant/list/list' })
  }
})
