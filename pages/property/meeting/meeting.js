// pages/property/meeting/meeting.js
const { getMeetingRooms } = require('../../../api/property')
const { getMyBookings, createBooking } = require('../../../api/property')

Page({
  data: {
    selectedDate: '',
    selectedTime: '',
    rooms: [],
    bookings: [],
    loading: false,
    showBookingModal: false,
    selectedRoom: null,

    // 预约表单
    bookingForm: {
      title: '',
      date: '',
      startTime: '',
      endTime: ''
    }
  },

  onLoad() {
    // 默认选中今天
    const today = this.formatDate(new Date())
    this.setData({
      'bookingForm.date': today,
      selectedDate: today
    })
    this.loadRooms()
    this.loadMyBookings()
  },

  onShow() {
    this.loadRooms()
    this.loadMyBookings()
  },

  /**
   * 加载会议室列表
   */
  async loadRooms() {
    try {
      this.setData({ loading: true })
      const rooms = await getMeetingRooms(this.data.selectedDate)
      this.setData({
        rooms: Array.isArray(rooms) ? rooms : [],
        loading: false
      })
    } catch (err) {
      console.error('加载会议室失败:', err)
      this.setData({ loading: false })
    }
  },

  /**
   * 加载我的预约
   */
  async loadMyBookings() {
    try {
      const bookings = await getMyBookings()
      this.setData({
        bookings: Array.isArray(bookings.list) ? bookings.list : []
      })
    } catch (err) {
      console.error('加载预约失败:', err)
    }
  },

  /**
   * 选择日期
   */
  onDateChange(e) {
    const date = e.detail.value
    this.setData({
      selectedDate: date,
      'bookingForm.date': date
    })
    this.loadRooms()
  },

  /**
   * 选择时间
   */
  onTimeChange(e) {
    this.setData({ selectedTime: e.detail.value })
  },

  /**
   * 选择会议室
   */
  selectRoom(e) {
    const room = e.currentTarget.dataset.room
    this.setData({
      selectedRoom: room,
      showBookingModal: true,
      'bookingForm.title': '',
      'bookingForm.startTime': '09:00',
      'bookingForm.endTime': '10:00'
    })
  },

  /**
   * 关闭预约弹窗
   */
  closeBookingModal() {
    this.setData({ showBookingModal: false, selectedRoom: null })
  },

  /**
   * 预约表单输入
   */
  onFormInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`bookingForm.${field}`]: value
    })
  },

  /**
   * 提交预约
   */
  async submitBooking() {
    const { bookingForm, selectedRoom } = this.data

    if (!bookingForm.title) {
      wx.showToast({ title: '请输入会议主题', icon: 'none' })
      return
    }

    try {
      wx.showLoading({ title: '提交中...' })
      await createBooking({
        room_id: selectedRoom.id,
        title: bookingForm.title,
        book_date: bookingForm.date,
        start_time: bookingForm.startTime,
        end_time: bookingForm.endTime
      })

      wx.showToast({ title: '预约成功' })
      this.closeBookingModal()
      this.loadRooms()
      this.loadMyBookings()
    } catch (err) {
      console.error('预约失败:', err)
      wx.showToast({ title: '预约失败，请重试', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  /**
   * 查看会议室详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/property/meeting-detail/meeting-detail?id=${id}` })
  },

  /**
   * 查看我的预约
   */
  goToMyBookings() {
    wx.navigateTo({ url: '/pages/property/my-bookings/my-bookings' })
  },

  /**
   * 格式化日期
   */
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
})
