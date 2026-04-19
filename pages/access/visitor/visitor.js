const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    visitors: [],
    loading: false,
    submitting: false,
    showForm: false
  },

  onLoad() {
    this.loadVisitors()
  },

  onShow() {
    this.loadVisitors()
  },

  async loadVisitors() {
    const user = auth.getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const visitors = await api.access.getMyVisitors({ user_id: user.id })
      this.setData({ visitors })
    } catch (err) {
      console.error('加载访客记录失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onShowForm() {
    this.setData({ showForm: true })
  },

  onHideForm() {
    this.setData({ showForm: false })
  },

  async onSubmitVisitor() {
    const formData = this.selectComponent('#visitorForm').getFormData()
    const user = auth.getUserInfo()
    const tenant = auth.getTenant()

    this.setData({ submitting: true })
    try {
      await api.access.createVisitor({
        tenant_id: tenant.id,
        user_id: user.id,
        ...formData
      })
      wx.showToast({ title: '预约成功', icon: 'success' })
      this.selectComponent('#visitorForm').reset()
      this.setData({ showForm: false })
      this.loadVisitors()
    } catch (err) {
      wx.showToast({ title: err.message || '预约失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  onViewCode(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/access/code/code?id=${id}`
    })
  }
})
