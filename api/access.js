/**
 * 公司门禁 API
 */
import { get, post } from '../utils/request'
import { getTenantId } from '../utils/auth'

/**
 * 创建访客预约
 * @param {Object} data 访客数据
 */
export function createVisitor(data) {
  return post('/access/visitors', {
    ...data,
    tenant_id: getTenantId()
  })
}

/**
 * 获取我的访客预约
 * @param {string} status 可选，状态筛选
 */
export function getMyVisitors(status) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return get('/access/visitors', {
    user_id: userInfo.id,
    status
  })
}

/**
 * 获取通行码
 * @param {number} id 访客预约ID
 */
export function getAccessCode(id) {
  return get(`/access/visitors/${id}/code`)
}

/**
 * 获取通行记录
 * @param {Object} params 查询参数
 */
export function getAccessRecords({ startDate, endDate, page = 1, pageSize = 20 } = {}) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return get('/access/records', {
    user_id: userInfo.id,
    start_date: startDate,
    end_date: endDate,
    page,
    pageSize
  })
}
