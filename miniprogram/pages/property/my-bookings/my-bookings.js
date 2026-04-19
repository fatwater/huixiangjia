const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    bookings: [],
    loading: false
  },

  onLoad() {
    this.loadBookings()
  },

  onShow() {
    this.loadBookings()
  },

  async loadBookings() {
    const user = auth.getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const bookings = await api.property.getMyBookings({ user_id: user.id })
      this.setData({ bookings })
    } catch (err) {
      console.error('加载预约失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  async onCancel(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.property.cancelBooking(id)
            wx.showToast({ title: '已取消', icon: 'success' })
            this.loadBookings()
          } catch (err) {
            wx.showToast({ title: '取消失败', icon: 'none' })
          }
        }
      }
    })
  }
})
