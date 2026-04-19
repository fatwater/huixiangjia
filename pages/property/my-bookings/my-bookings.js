// pages/property/my-bookings/my-bookings.js
const { getMyBookings, cancelBooking } = require('../../../api/property')
const { getUserInfo } = require('../../../utils/auth')

Page({
  data: {
    bookings: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    activeTab: 'all' // all, pending, approved, completed
  },

  onLoad() {
    this.loadBookings()
  },

  onShow() {
    this.loadBookings()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true })
    this.loadBookings().finally(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadBookings(true)
    }
  },

  async loadBookings(append = false) {
    const user = getUserInfo()
    if (!user) return

    if (!append) {
      this.setData({ loading: true })
    }

    try {
      const result = await getMyBookings()
      let list = result.list || result || []

      // 过滤
      if (this.data.activeTab !== 'all') {
        list = list.filter(b => b.status === this.data.activeTab)
      }

      // 按日期排序
      list.sort((a, b) => {
        const dateA = new Date(a.bookDate || a.book_date)
        const dateB = new Date(b.bookDate || b.book_date)
        return dateB - dateA
      })

      this.setData({
        bookings: append ? [...this.data.bookings, ...list] : list,
        hasMore: list.length >= this.data.pageSize,
        loading: false
      })
    } catch (err) {
      console.error('加载预约失败:', err)
      this.setData({ loading: false })
    }
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ activeTab: tab, page: 1, hasMore: true })
    this.loadBookings()
  },

  async onCancelBooking(e) {
    const { id } = e.currentTarget.dataset

    wx.showModal({
      title: '提示',
      content: '确定要取消该预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await cancelBooking(id)
            wx.showToast({ title: '已取消', icon: 'success' })
            this.loadBookings()
          } catch (err) {
            console.error('取消预约失败:', err)
            wx.showToast({ title: '取消失败', icon: 'none' })
          }
        }
      }
    })
  },

  getStatusText(status) {
    const map = {
      pending: '待审核',
      approved: '已通过',
      rejected: '已拒绝',
      completed: '已完成',
      cancelled: '已取消',
      '0': '已取消',
      '1': '待审核',
      '2': '已通过',
      '3': '已完成'
    }
    return map[status] || status
  },

  getStatusClass(status) {
    const map = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    }
    return map[status] || ''
  },

  formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]
    return `${month}月${day}日 ${weekDay}`
  },

  formatTime(startTime, endTime) {
    return `${startTime || ''} - ${endTime || ''}`
  }
})
