const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    productId: null,
    product: null,
    quantity: 1,
    address: '',
    loading: false,
    submitting: false
  },

  onLoad(options) {
    this.setData({ productId: parseInt(options.id) })
    this.loadProductDetail()
    this.setDefaultAddress()
  },

  async loadProductDetail() {
    this.setData({ loading: true })
    try {
      const product = await api.groupbuy.getProductDetail(this.data.productId)
      this.setData({ product })
    } catch (err) {
      console.error('加载商品详情失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  setDefaultAddress() {
    const user = auth.getUserInfo()
    if (user?.address) {
      this.setData({ address: user.address })
    }
  },

  onQuantityChange(e) {
    const { type } = e.currentTarget.dataset
    const { quantity, product } = this.data
    if (type === 'add' && quantity < product.stock) {
      this.setData({ quantity: quantity + 1 })
    } else if (type === 'minus' && quantity > 1) {
      this.setData({ quantity: quantity - 1 })
    }
  },

  onAddressInput(e) {
    this.setData({ address: e.detail.value })
  },

  async onSubmit() {
    if (!this.data.address.trim()) {
      wx.showToast({ title: '请输入收货地址', icon: 'none' })
      return
    }

    const user = auth.getUserInfo()
    const tenant = auth.getTenant()

    this.setData({ submitting: true })
    try {
      await api.groupbuy.createOrder({
        tenant_id: tenant.id,
        user_id: user.id,
        product_id: this.data.productId,
        quantity: this.data.quantity,
        address: this.data.address
      })
      wx.showToast({ title: '下单成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      wx.showToast({ title: err.message || '下单失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  }
})
