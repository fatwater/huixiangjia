/**
 * 认证 API
 */
import { post, get } from '../utils/request'
import { setToken, setUserInfo, setTenantId } from '../utils/auth'

/**
 * 企业微信登录
 * @param {string} code 企业微信授权码
 */
export function login(code) {
  return post('/auth/login', { code })
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  return get('/auth/userinfo')
}

/**
 * 登出
 */
export function logout() {
  return post('/auth/logout')
}

/**
 * 处理登录成功
 */
export function handleLoginSuccess(data) {
  setToken(data.token)
  setUserInfo(data.user)
  if (data.tenant) {
    setTenantId(data.tenant.id)
  }
}
