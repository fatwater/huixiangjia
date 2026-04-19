/**
 * 周边商家 API
 */
import { get, post, del } from '../utils/request'
import { getTenantId } from '../utils/auth'

/**
 * 获取商家列表
 * @param {Object} params 查询参数
 */
export function getMerchants({ keyword, category, page = 1, pageSize = 10 } = {}) {
  return get('/merchants', {
    tenant_id: getTenantId(),
    keyword,
    category,
    page,
    pageSize
  })
}

/**
 * 获取商家详情
 * @param {number} id 商家ID
 */
export function getMerchantDetail(id) {
  return get(`/merchants/${id}`)
}

/**
 * 获取我的收藏
 */
export function getMyFavorites() {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return get('/merchants/favorites', { user_id: userInfo.id })
}

/**
 * 收藏商家
 * @param {number} id 商家ID
 */
export function favoriteMerchant(id) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return post(`/merchants/${id}/favorite`, { user_id: userInfo.id })
}

/**
 * 取消收藏
 * @param {number} id 商家ID
 */
export function unfavoriteMerchant(id) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return del(`/merchants/${id}/favorite`, { user_id: userInfo.id })
}
