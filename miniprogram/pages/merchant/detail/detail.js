const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    merchant: null,
    loading: false,
    isFavorited: false,
    userId: null
  },

  onLoad(options) {
    this.setData({ userId: auth.getUserInfo()?.id })
    this.loadMerchantDetail(options.id)
  },

  async loadMerchantDetail(id) {
    this.setData({ loading: true })
    try {
      const merchant = await api.merchant.getMerchantDetail(id)
      this.setData({ merchant })
    } catch (err) {
      console.error('加载商家详情失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  async onFavoriteTap() {
    const { merchant, isFavorited, userId } = this.data
    if (!userId) return

    try {
      if (isFavorited) {
        await api.merchant.unfavoriteMerchant(merchant.id, userId)
      } else {
        await api.merchant.favoriteMerchant(merchant.id, userId)
      }
      this.setData({ isFavorited: !isFavorited })
      wx.showToast({
        title: isFavorited ? '已取消收藏' : '已收藏',
        icon: 'success'
      })
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  onPhoneTap() {
    const { merchant } = this.data
    if (merchant.phone) {
      wx.makePhoneCall({ phoneNumber: merchant.phone })
    }
  }
})
