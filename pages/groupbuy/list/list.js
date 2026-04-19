// pages/groupbuy/list/list.js
const { getProducts } = require('../../../api/groupbuy')

Page({
  data: {
    products: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    activeTab: 'all', // all-全部, ongoing-进行中, upcoming-即将开始
    statusMap: {
      'all': '',
      'ongoing': 1,
      'upcoming': 1
    }
  },

  onLoad() {
    this.loadProducts()
  },

  onShow() {
    this.loadProducts()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true })
    this.loadProducts().finally(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadProducts(true)
    }
  },

  /**
   * 加载商品列表
   */
  async loadProducts(append = false) {
    if (!this.data.hasMore && append) return

    try {
      this.setData({ loading: true })
      const { page, pageSize, activeTab } = this.data

      // 进行中: 当前时间在 start_time 和 end_time 之间
      // 即将开始: start_time > 当前时间

      const result = await getProducts({
        status: 1, // 只获取上架商品
        page,
        pageSize
      })

      let list = result.list || result || []

      // 根据 tab 筛选
      if (activeTab === 'ongoing') {
        const now = new Date().getTime()
        list = list.filter(p => {
          const start = p.start_time ? new Date(p.start_time).getTime() : 0
          const end = p.end_time ? new Date(p.end_time).getTime() : Infinity
          return now >= start && now <= end
        })
      } else if (activeTab === 'upcoming') {
        const now = new Date().getTime()
        list = list.filter(p => {
          const start = p.start_time ? new Date(p.start_time).getTime() : 0
          return start > now
        })
      }

      this.setData({
        products: append ? [...this.data.products, ...list] : list,
        hasMore: list.length >= pageSize,
        loading: false
      })
    } catch (err) {
      console.error('加载商品失败:', err)
      this.setData({ loading: false })
    }
  },

  /**
   * Tab 切换
   */
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      activeTab: tab,
      page: 1,
      hasMore: true
    })
    this.loadProducts()
  },

  /**
   * 查看商品详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/groupbuy/order/order?id=${id}` })
  },

  /**
   * 计算折扣
   */
  calcDiscount(originalPrice, groupbuyPrice) {
    if (!originalPrice || !groupbuyPrice) return 0
    return Math.round((1 - groupbuyPrice / originalPrice) * 100)
  }
})
