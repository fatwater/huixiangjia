/**
 * 物业会议室 API
 */
import { get, post, put, del } from '../utils/request'
import { getTenantId } from '../utils/auth'

/**
 * 获取会议室列表
 * @param {string} date 可选，筛选日期
 */
export function getMeetingRooms(date) {
  return get('/property/meeting-rooms', { tenant_id: getTenantId(), date })
}

/**
 * 获取会议室详情
 * @param {number} id 会议室ID
 */
export function getMeetingRoomDetail(id) {
  return get(`/property/meeting-rooms/${id}`)
}

/**
 * 创建会议室（管理端）
 */
export function createMeetingRoom(data) {
  return post('/property/meeting-rooms', { ...data, tenant_id: getTenantId() })
}

/**
 * 更新会议室
 */
export function updateMeetingRoom(id, data) {
  return put(`/property/meeting-rooms/${id}`, data)
}

/**
 * 删除会议室
 */
export function deleteMeetingRoom(id) {
  return del(`/property/meeting-rooms/${id}`)
}

/**
 * 获取我的预约
 * @param {string} status 可选，状态筛选
 */
export function getMyBookings(status) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return get('/property/bookings', {
    user_id: userInfo.id,
    status
  })
}

/**
 * 创建会议室预约
 */
export function createBooking(data) {
  const userInfo = wx.getStorageSync('userInfo') || {}
  return post('/property/bookings', {
    ...data,
    tenant_id: getTenantId(),
    user_id: userInfo.id
  })
}

/**
 * 取消预约
 */
export function cancelBooking(id) {
  return del(`/property/bookings/${id}`)
}
