const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    products: [],
    loading: false,
    tenantId: null
  },

  onLoad() {
    const tenant = auth.getTenant()
    this.setData({ tenantId: tenant?.id })
    this.loadProducts()
  },

  onShow() {
    this.loadProducts()
  },

  async loadProducts() {
    if (!this.data.tenantId) return

    this.setData({ loading: true })
    try {
      const products = await api.groupbuy.getProducts({
        tenant_id: this.data.tenantId,
        status: 1
      })
      this.setData({ products })
    } catch (err) {
      console.error('加载商品失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onProductTap(e) {
    const { product } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/groupbuy/order/order?id=${product.id}`
    })
  }
})
