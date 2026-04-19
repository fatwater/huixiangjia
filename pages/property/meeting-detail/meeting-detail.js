// pages/property/meeting-detail/meeting-detail.js
const { getMeetingRoomDetail, getMeetingRooms } = require('../../../api/property')

Page({
  data: {
    roomId: null,
    room: null,
    loading: true,
    selectedDate: '',
    availableSlots: [],
    selectedSlot: '',
    showBookingModal: false,
    bookingForm: {
      title: '',
      purpose: ''
    }
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ roomId: parseInt(options.id) })
      this.loadRoomDetail()
    }
  },

  async loadRoomDetail() {
    const { roomId } = this.data
    if (!roomId) return

    this.setData({ loading: true })
    try {
      const room = await getMeetingRoomDetail(roomId)
      this.setData({
        room,
        loading: false,
        selectedDate: this.formatDate(new Date())
      })
      this.loadAvailableSlots()
    } catch (err) {
      console.error('加载会议室详情失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  async loadAvailableSlots() {
    const { roomId, selectedDate } = this.data
    if (!roomId || !selectedDate) return

    try {
      const rooms = await getMeetingRooms(selectedDate)
      const targetRoom = Array.isArray(rooms) ? rooms.find(r => r.id === roomId) : null

      if (targetRoom && targetRoom.bookings) {
        const bookedSlots = targetRoom.bookings.map(b => b.timeSlot || b.startTime)
        const allSlots = this.generateTimeSlots()
        const availableSlots = allSlots.map(slot => ({
          time: slot,
          available: !bookedSlots.includes(slot)
        }))
        this.setData({ availableSlots })
      } else {
        const allSlots = this.generateTimeSlots()
        const availableSlots = allSlots.map(time => ({
          time,
          available: true
        }))
        this.setData({ availableSlots })
      }
    } catch (err) {
      console.error('加载可用时段失败:', err)
    }
  },

  onDateChange(e) {
    const date = e.detail.value
    this.setData({ selectedDate: date })
    this.loadAvailableSlots()
  },

  onSlotSelect(e) {
    const slot = e.currentTarget.dataset.slot
    if (!slot.available) {
      wx.showToast({ title: '该时段已被预约', icon: 'none' })
      return
    }
    this.setData({ selectedSlot: slot.time })
  },

  onShowBookingModal() {
    const { selectedSlot } = this.data
    if (!selectedSlot) {
      wx.showToast({ title: '请先选择时段', icon: 'none' })
      return
    }

    this.setData({
      showBookingModal: true,
      bookingForm: {
        title: '',
        purpose: ''
      }
    })
  },

  onCloseModal() {
    this.setData({ showBookingModal: false })
  },

  onFormInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`bookingForm.${field}`]: value })
  },

  async onSubmitBooking() {
    const { roomId, selectedDate, selectedSlot, bookingForm } = this.data

    if (!bookingForm.title) {
      wx.showToast({ title: '请输入会议主题', icon: 'none' })
      return
    }

    try {
      const { createBooking } = require('../../../api/property')
      await createBooking({
        room_id: roomId,
        title: bookingForm.title,
        book_date: selectedDate,
        start_time: selectedSlot,
        end_time: this.getEndTime(selectedSlot),
        purpose: bookingForm.purpose
      })

      wx.showToast({ title: '预约成功', icon: 'success' })
      this.onCloseModal()
      this.loadAvailableSlots()
    } catch (err) {
      console.error('预约失败:', err)
      wx.showToast({ title: err.message || '预约失败', icon: 'none' })
    }
  },

  generateTimeSlots() {
    const slots = []
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`)
    }
    return slots
  },

  getEndTime(startTime) {
    const [hour] = startTime.split(':')
    const endHour = parseInt(hour) + 1
    return `${String(endHour).padStart(2, '0')}:00`
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  },

  onShareAppMessage() {
    const { room } = this.data
    return {
      title: room ? `${room.name} - 会议室预约` : '会议室',
      path: `/pages/property/meeting-detail/meeting-detail?id=${this.data.roomId}`
    }
  }
})
