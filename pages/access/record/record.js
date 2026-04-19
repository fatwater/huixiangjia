// pages/access/record/record.js
const { getAccessRecords } = require('../../../api/access')
const { getUserInfo } = require('../../../utils/auth')

Page({
  data: {
    records: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true })
    this.loadRecords().finally(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadRecords(true)
    }
  },

  async loadRecords(append = false) {
    const user = getUserInfo()
    if (!user) return

    if (!append) {
      this.setData({ loading: true })
    }

    try {
      const result = await getAccessRecords({
        page: this.data.page,
        pageSize: this.data.pageSize
      })

      const list = result.list || []
      this.setData({
        records: append ? [...this.data.records, ...list] : list,
        hasMore: list.length >= this.data.pageSize,
        loading: false
      })
    } catch (err) {
      console.error('加载通行记录失败:', err)
      this.setData({ loading: false })
    }
  },

  formatTime(timeStr) {
    if (!timeStr) return ''
    const date = new Date(timeStr)
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${month}-${day} ${hours}:${minutes}`
  }
})
