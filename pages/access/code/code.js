const api = require('../../../utils/api')

Page({
  data: {
    visitorId: null,
    accessCode: '',
    expiresAt: '',
    loading: false
  },

  onLoad(options) {
    this.setData({ visitorId: options.id })
    this.loadAccessCode()
  },

  async loadAccessCode() {
    this.setData({ loading: true })
    try {
      const data = await api.access.getAccessCode(this.data.visitorId)
      this.setData({
        accessCode: data.access_code,
        expiresAt: data.expires_at
      })
    } catch (err) {
      console.error('加载通行码失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onCopyCode() {
    wx.setClipboardData({
      data: this.data.accessCode,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  }
})
