const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    records: [],
    loading: false
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    const user = auth.getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const records = await api.access.getAccessRecords({ user_id: user.id })
      this.setData({ records })
    } catch (err) {
      console.error('加载通行记录失败', err)
    } finally {
      this.setData({ loading: false })
    }
  }
})
