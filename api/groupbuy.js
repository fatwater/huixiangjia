/**
 * 公司团购 API
 */
import { get, post, put } from '../utils/request'
import { getTenantId } from '../utils/auth'

/**
 * 获取团购商品列表
 * @param {Object} params 查询参数
 */
export function getProducts({ status = 1, page = 1, pageSize = 10 } = {}) {
  return get('/groupbuy/products', {
    tenant_id: getTenantId(),
    status,
    page,
    pageSize
  })
}

/**
 * 获取商品详情
 * @param {number} id 商品ID
 */
export function getProductDetail(id) {
  return get(`/groupbuy/products/${id}`)
}

/**
 * 获取我的订单
 * @param {Object} params 查询参数
 */
export function getMyOrders({ status, page = 1, pageSize = 10 } = {}) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return get('/groupbuy/orders', {
    user_id: userInfo.id,
    status,
    page,
    pageSize
  })
}

/**
 * 创建订单
 * @param {Object} data 订单数据
 */
export function createOrder(data) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return post('/groupbuy/orders', {
    ...data,
    tenant_id: getTenantId(),
    user_id: userInfo.id
  })
}

/**
 * 取消订单
 * @param {number} id 订单ID
 */
export function cancelOrder(id) {
  return put(`/groupbuy/orders/${id}/cancel`)
}
