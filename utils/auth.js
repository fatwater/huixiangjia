/**
 * 认证工具
 */

/**
 * 保存用户信息
 */
export function setUserInfo(userInfo) {
  wx.setStorageSync('userInfo', userInfo)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return wx.getStorageSync('userInfo') || null
}

/**
 * 保存 token
 */
export function setToken(token) {
  wx.setStorageSync('token', token)
}

/**
 * 获取 token
 */
export function getToken() {
  return wx.getStorageSync('token') || ''
}

/**
 * 检查是否已登录
 */
export function isLoggedIn() {
  return !!getToken() && !!getUserInfo()
}

/**
 * 清除登录信息
 */
export function clearAuth() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
  wx.removeStorageSync('tenantId')
}

/**
 * 获取租户ID
 */
export function getTenantId() {
  return wx.getStorageSync('tenantId') || 1
}

/**
 * 保存租户ID
 */
export function setTenantId(tenantId) {
  wx.setStorageSync('tenantId', tenantId)
}

/**
 * 企业微信登录
 * @param {string} code 企业微信授权码
 */
export function loginWithWecom(code) {
  return post('/auth/login', { code })
}
