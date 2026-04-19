// pages/access/visitor/visitor.js
const { getMyVisitors, createVisitor } = require('../../../api/access')
const { getUserInfo, getTenantId } = require('../../../utils/auth')

Page({
  data: {
    visitors: [],
    loading: false,
    submitting: false,
    showAddModal: false,
    formData: {
      visitorName: '',
      visitorPhone: '',
      visitorCompany: '',
      visitPurpose: '',
      visitDate: '',
      startTime: '',
      endTime: ''
    }
  },

  onLoad() {
    this.loadVisitors()
  },

  onShow() {
    this.loadVisitors()
  },

  onPullDownRefresh() {
    this.loadVisitors().finally(() => wx.stopPullDownRefresh())
  },

  async loadVisitors() {
    const user = getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const visitors = await getMyVisitors()
      this.setData({
        visitors: Array.isArray(visitors) ? visitors : [],
        loading: false
      })
    } catch (err) {
      console.error('加载访客记录失败:', err)
      this.setData({ loading: false })
    }
  },

  onShowAddModal() {
    const today = this.formatDate(new Date())
    this.setData({
      showAddModal: true,
      formData: {
        visitorName: '',
        visitorPhone: '',
        visitorCompany: '',
        visitPurpose: '',
        visitDate: today,
        startTime: '09:00',
        endTime: '18:00'
      }
    })
  },

  onCloseModal() {
    this.setData({ showAddModal: false })
  },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`formData.${field}`]: value })
  },

  async onSubmit() {
    const { formData } = this.data

    if (!formData.visitorName || !formData.visitorPhone || !formData.visitDate) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    try {
      await createVisitor({
        visitor_name: formData.visitorName,
        visitor_phone: formData.visitorPhone,
        visitor_company: formData.visitorCompany,
        visit_purpose: formData.visitPurpose,
        visit_date: formData.visitDate,
        start_time: formData.startTime,
        end_time: formData.endTime
      })
      wx.showToast({ title: '预约成功', icon: 'success' })
      this.onCloseModal()
      this.loadVisitors()
    } catch (err) {
      console.error('预约失败:', err)
      wx.showToast({ title: '预约失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  onViewCode(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({ url: `/pages/access/code/code?id=${id}` })
  },

  onViewRecords() {
    wx.navigateTo({ url: '/pages/access/record/record' })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
})
