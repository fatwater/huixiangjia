// pages/access/code/code.js
const { getAccessCode } = require('../../../api/access')

Page({
  data: {
    visitorId: null,
    accessCode: '',
    expiresAt: '',
    loading: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ visitorId: parseInt(options.id) })
      this.loadAccessCode()
    }
  },

  async loadAccessCode() {
    const { visitorId } = this.data
    if (!visitorId) return

    this.setData({ loading: true })
    try {
      const data = await getAccessCode(visitorId)
      this.setData({
        accessCode: data.qr_code || data.access_code || '',
        expiresAt: data.expires_at || data.expiresAt || '',
        loading: false
      })
    } catch (err) {
      console.error('加载通行码失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  onCopyCode() {
    const { accessCode } = this.data
    if (!accessCode) return

    wx.setClipboardData({
      data: accessCode,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  onSaveImage() {
    wx.showToast({ title: '功能开发中', icon: 'none' })
  }
})
