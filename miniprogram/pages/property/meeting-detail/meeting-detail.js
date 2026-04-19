const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    roomId: null,
    date: '',
    room: null,
    timeSlots: [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
      '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'
    ],
    selectedSlot: '',
    bookedSlots: [],
    purpose: '',
    loading: false,
    submitting: false
  },

  onLoad(options) {
    this.setData({
      roomId: options.id,
      date: options.date
    })
    this.loadRoomDetail()
  },

  async loadRoomDetail() {
    this.setData({ loading: true })
    try {
      const room = await api.property.getMeetingRoomDetail(this.data.roomId)
      this.setData({
        room,
        bookedSlots: room.bookings?.map(b => b.time_slot) || []
      })
    } catch (err) {
      console.error('加载会议室详情失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onSlotSelect(e) {
    const { slot } = e.currentTarget.dataset
    if (this.data.bookedSlots.includes(slot)) {
      wx.showToast({ title: '该时段已被预约', icon: 'none' })
      return
    }
    this.setData({ selectedSlot: slot })
  },

  onPurposeInput(e) {
    this.setData({ purpose: e.detail.value })
  },

  async onSubmit() {
    if (!this.data.selectedSlot) {
      wx.showToast({ title: '请选择时间段', icon: 'none' })
      return
    }
    if (!this.data.purpose.trim()) {
      wx.showToast({ title: '请输入会议用途', icon: 'none' })
      return
    }

    const user = auth.getUserInfo()
    const tenant = auth.getTenant()

    this.setData({ submitting: true })
    try {
      await api.property.createBooking({
        tenant_id: tenant.id,
        user_id: user.id,
        room_id: this.data.roomId,
        date: this.data.date,
        time_slot: this.data.selectedSlot,
        purpose: this.data.purpose
      })
      wx.showToast({ title: '预约成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      wx.showToast({ title: err.message || '预约失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  }
})
