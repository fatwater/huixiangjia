const api = require('../../../utils/api')
const auth = require('../../../utils/auth')
const dateUtil = require('../../../utils/date')

Page({
  data: {
    dateRange: [],
    selectedDate: '',
    rooms: [],
    loading: false,
    tenantId: null
  },

  onLoad() {
    const tenant = auth.getTenant()
    this.setData({
      dateRange: dateUtil.getDateRange(7),
      selectedDate: dateUtil.getToday(),
      tenantId: tenant?.id
    })
    this.loadRooms()
  },

  onShow() {
    this.loadRooms()
  },

  async loadRooms() {
    if (!this.data.tenantId) return

    this.setData({ loading: true })
    try {
      const rooms = await api.property.getMeetingRooms({
        tenant_id: this.data.tenantId,
        date: this.data.selectedDate
      })
      this.setData({ rooms })
    } catch (err) {
      console.error('加载会议室失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onDateChange(e) {
    const index = e.detail.value
    const date = this.data.dateRange[index].value
    this.setData({ selectedDate: date })
    this.loadRooms()
  },

  onRoomTap(e) {
    const { room } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/property/meeting-detail/meeting-detail?id=${room.id}&date=${this.data.selectedDate}`
    })
  }
})
