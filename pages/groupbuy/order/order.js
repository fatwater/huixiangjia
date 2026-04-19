// pages/groupbuy/order/order.js
const { getProductDetail, createOrder } = require('../../../api/groupbuy')
const { getTenantId, getUserInfo } = require('../../../utils/auth')

Page({
  data: {
    productId: null,
    product: null,
    loading: true,
    submitting: false,
    quantity: 1,
    showSuccessModal: false,
    orderNo: '',
    pickupCode: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ productId: parseInt(options.id) })
      this.loadProduct()
    }

    // 如果是查看订单
    if (options.orderNo) {
      this.setData({
        productId: parseInt(options.productId || 0),
        showSuccessModal: true,
        orderNo: options.orderNo,
        pickupCode: options.pickupCode || ''
      })
      this.loadProduct()
    }
  },

  async loadProduct() {
    const { productId } = this.data
    if (!productId) return

    this.setData({ loading: true })
    try {
      const product = await getProductDetail(productId)
      this.setData({ product, loading: false })
    } catch (err) {
      console.error('加载商品详情失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  onQuantityChange(e) {
    const { value } = e.detail
    const { product } = this.data
    const maxQuantity = product ? Math.min(product.stock || 99, 10) : 10
    const quantity = Math.max(1, Math.min(parseInt(value) || 1, maxQuantity))
    this.setData({ quantity })
  },

  decreaseQuantity() {
    const { quantity } = this.data
    if (quantity > 1) {
      this.setData({ quantity: quantity - 1 })
    }
  },

  increaseQuantity() {
    const { quantity, product } = this.data
    const maxQuantity = product ? Math.min(product.stock || 99, 10) : 10
    if (quantity < maxQuantity) {
      this.setData({ quantity: quantity + 1 })
    } else {
      wx.showToast({ title: '已达最大购买数量', icon: 'none' })
    }
  },

  async submitOrder() {
    const { product, quantity } = this.data

    if (!product) {
      wx.showToast({ title: '商品信息加载中', icon: 'none' })
      return
    }

    if (product.stock <= 0) {
      wx.showToast({ title: '商品已售罄', icon: 'none' })
      return
    }

    this.setData({ submitting: true })

    try {
      const result = await createOrder({
        product_id: product.id,
        quantity: quantity
      })

      // 生成提货码
      const pickupCode = this.generatePickupCode()

      this.setData({
        submitting: false,
        showSuccessModal: true,
        orderNo: result.order_no || result.orderNo || `ORD${Date.now()}`,
        pickupCode
      })

      wx.showToast({ title: '下单成功', icon: 'success' })
    } catch (err) {
      console.error('下单失败:', err)
      wx.showToast({ title: err.message || '下单失败', icon: 'none' })
      this.setData({ submitting: false })
    }
  },

  onCloseSuccessModal() {
    this.setData({ showSuccessModal: false })
  },

  goToMyOrders() {
    wx.navigateBack()
  },

  generatePickupCode() {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  },

  copyOrderNo() {
    wx.setClipboardData({
      data: this.data.orderNo,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  onShareAppMessage() {
    const { product } = this.data
    return {
      title: product ? `${product.title} - 团购优惠` : '公司团购',
      path: `/pages/groupbuy/order/order?id=${this.data.productId}`
    }
  }
})
