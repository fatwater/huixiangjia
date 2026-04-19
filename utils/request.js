/**
 * 请求封装
 * 基于微信 wx.request API
 */

// 配置
const BASE_URL = 'http://localhost:3000/api/v1'
const TIMEOUT = 10000

/**
 * 获取存储的 token
 */
function getToken() {
  return wx.getStorageSync('token') || ''
}

/**
 * 请求拦截
 */
function requestInterceptor(options) {
  const token = getToken()
  if (token) {
    options.header = options.header || {}
    options.header['Authorization'] = `Bearer ${token}`
  }
  return options
}

/**
 * 响应拦截
 */
function responseInterceptor(response) {
  const { statusCode, data } = response

  if (statusCode === 200) {
    // 统一处理业务错误
    if (data.code && data.code !== 0) {
      wx.showToast({
        title: data.message || '请求失败',
        icon: 'none'
      })
      return Promise.reject(data)
    }
    return data.data !== undefined ? data.data : data
  }

  if (statusCode === 401) {
    // token 过期，清除登录状态
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.redirectTo({ url: '/pages/index/index' })
    return Promise.reject({ message: '登录已过期' })
  }

  wx.showToast({
    title: '网络请求失败',
    icon: 'none'
  })
  return Promise.reject(response)
}

/**
 * 请求封装
 * @param {Object} options 请求配置
 */
export function request(options) {
  return new Promise((resolve, reject) => {
    const mergedOptions = requestInterceptor({
      url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
      timeout: TIMEOUT,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      ...options
    })

    wx.request({
      ...mergedOptions,
      success: (res) => {
        resolve(responseInterceptor(res))
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

/**
 * GET 请求
 */
export function get(url, data, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  })
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  })
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  })
}

/**
 * DELETE 请求
 */
export function del(url, data, options = {}) {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  })
}
