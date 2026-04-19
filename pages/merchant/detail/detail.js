// pages/merchant/detail/detail.js
const { getMerchantDetail, favoriteMerchant, unfavoriteMerchant } = require('../../../api/merchant')
const { getMyFavorites } = require('../../../api/merchant')

Page({
  data: {
    id: null,
    merchant: null,
    isFavorited: false,
    loading: true,
    activeTab: 'info'
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: parseInt(options.id) })
      this.loadMerchant()
      this.checkFavorite()
    }
  },

  async loadMerchant() {
    const { id } = this.data
    if (!id) return

    this.setData({ loading: true })
    try {
      const merchant = await getMerchantDetail(id)
      this.setData({ merchant, loading: false })
    } catch (err) {
      console.error('加载商家详情失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  async checkFavorite() {
    const { id } = this.data
    try {
      const favorites = await getMyFavorites()
      const isFavorited = favorites.some(f => f.id === id)
      this.setData({ isFavorited })
    } catch (err) {
      console.error('检查收藏状态失败:', err)
    }
  },

  async toggleFavorite() {
    const { id, isFavorited } = this.data

    try {
      if (isFavorited) {
        await unfavoriteMerchant(id)
        this.setData({ isFavorited: false })
        wx.showToast({ title: '已取消收藏', icon: 'success' })
      } else {
        await favoriteMerchant(id)
        this.setData({ isFavorited: true })
        wx.showToast({ title: '收藏成功', icon: 'success' })
      }
    } catch (err) {
      console.error('收藏操作失败:', err)
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab })
  },

  onCall() {
    const { merchant } = this.data
    if (!merchant || !merchant.phone) return

    wx.makePhoneCall({
      phoneNumber: merchant.phone,
      fail: () => {
        wx.showToast({ title: '拨打失败', icon: 'none' })
      }
    })
  },

  onLocation() {
    const { merchant } = this.data
    if (!merchant || !merchant.address) return

    wx.openLocation({
      latitude: 0, // TODO: 需要真实经纬度
      longitude: 0,
      name: merchant.name,
      address: merchant.address,
      fail: () => {
        wx.showToast({ title: '打开地图失败', icon: 'none' })
      }
    })
  },

  onShareAppMessage() {
    const { merchant } = this.data
    return {
      title: merchant ? `${merchant.name} - 优惠信息` : '商家推荐',
      path: `/pages/merchant/detail/detail?id=${this.data.id}`
    }
  }
})
