const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    merchants: [],
    loading: false,
    keyword: '',
    category: '',
    categories: ['全部', '餐饮', '超市', '水果', '药店', '干洗', '家政'],
    tenantId: null
  },

  onLoad() {
    const tenant = auth.getTenant()
    this.setData({ tenantId: tenant?.id })
    this.loadMerchants()
  },

  onShow() {
    this.loadMerchants()
  },

  async loadMerchants() {
    if (!this.data.tenantId) return

    this.setData({ loading: true })
    try {
      const merchants = await api.merchant.getMerchants({
        tenant_id: this.data.tenantId,
        keyword: this.data.keyword,
        category: this.data.category === '全部' ? '' : this.data.category
      })
      this.setData({ merchants })
    } catch (err) {
      console.error('加载商家失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.loadMerchants()
  },

  onCategoryChange(e) {
    const index = e.detail.value
    this.setData({ category: this.data.categories[index] })
    this.loadMerchants()
  },

  onMerchantTap(e) {
    const { merchant } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/merchant/detail/detail?id=${merchant.id}`
    })
  }
})
