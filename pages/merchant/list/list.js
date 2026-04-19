// pages/merchant/list/list.js
const { getMerchants, getMyFavorites, favoriteMerchant, unfavoriteMerchant } = require('../../../api/merchant')

Page({
  data: {
    merchants: [],
    favorites: [],
    keyword: '',
    selectedCategory: '',
    categories: ['全部', '餐饮', '咖啡', '健身', '购物', '休闲'],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    showFilter: false
  },

  onLoad() {
    this.loadMerchants()
    this.loadFavorites()
  },

  onShow() {
    this.loadMerchants()
    this.loadFavorites()
  },

  onPullDownRefresh() {
    this.setData({ page: 1, hasMore: true })
    Promise.all([this.loadMerchants(), this.loadFavorites()])
      .finally(() => wx.stopPullDownRefresh())
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 })
      this.loadMerchants(true)
    }
  },

  /**
   * 加载商家列表
   */
  async loadMerchants(append = false) {
    if (!this.data.hasMore && append) return

    try {
      this.setData({ loading: true })
      const { keyword, selectedCategory, page, pageSize } = this.data
      const result = await getMerchants({
        keyword,
        category: selectedCategory === '全部' || !selectedCategory ? '' : selectedCategory,
        page,
        pageSize
      })

      const list = result.list || result || []
      this.setData({
        merchants: append ? [...this.data.merchants, ...list] : list,
        hasMore: list.length >= pageSize,
        loading: false
      })
    } catch (err) {
      console.error('加载商家失败:', err)
      this.setData({ loading: false })
    }
  },

  /**
   * 加载收藏列表
   */
  async loadFavorites() {
    try {
      const favorites = await getMyFavorites()
      this.setData({ favorites: Array.isArray(favorites) ? favorites : [] })
    } catch (err) {
      console.error('加载收藏失败:', err)
    }
  },

  /**
   * 搜索
   */
  onSearch(e) {
    const keyword = e.detail.value || ''
    this.setData({ keyword, page: 1, hasMore: true })
    this.loadMerchants()
  },

  /**
   * 选择分类
   */
  onCategoryChange(e) {
    const category = this.data.categories[e.detail.value]
    this.setData({ selectedCategory: category, page: 1, hasMore: true })
    this.loadMerchants()
  },

  /**
   * 查看商家详情
   */
  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/merchant/detail/detail?id=${id}` })
  },

  /**
   * 切换收藏状态
   */
  async toggleFavorite(e) {
    const id = e.currentTarget.dataset.id
    const isFavorited = this.isFavorited(id)

    try {
      if (isFavorited) {
        await unfavoriteMerchant(id)
      } else {
        await favoriteMerchant(id)
      }
      this.loadFavorites()
    } catch (err) {
      console.error('收藏操作失败:', err)
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  /**
   * 检查是否已收藏
   */
  isFavorited(id) {
    return this.data.favorites.some(f => f.merchantId === id || f.id === id)
  },

  /**
   * 展开/收起筛选
   */
  toggleFilter() {
    this.setData({ showFilter: !this.data.showFilter })
  }
})
