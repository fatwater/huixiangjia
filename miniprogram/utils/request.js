// miniprogram/utils/request.js

const baseURL = 'https://api.huixiangjia.com/api/v1'

class Request {
  constructor() {
    this.baseURL = baseURL
    this.timeout = 10000
  }

  request(options) {
    const { url, method = 'GET', data, header = {} } = options

    return new Promise((resolve, reject) => {
      // 显示加载提示
      if (options.showLoading !== false) {
        wx.showLoading({ title: '加载中...', mask: true })
      }

      wx.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`,
          ...header
        },
        timeout: this.timeout,
        success: (res) => {
          wx.hideLoading()

          if (res.statusCode === 200) {
            if (res.data.code === 200) {
              resolve(res.data.data)
            } else if (res.data.code === 401) {
              // token 过期，跳转登录
              this.handleAuthError()
              reject(res.data)
            } else {
              wx.showToast({
                title: res.data.message || '请求失败',
                icon: 'none'
              })
              reject(res.data)
            }
          } else {
            wx.showToast({
              title: '网络错误',
              icon: 'none'
            })
            reject(res.data)
          }
        },
        fail: (err) => {
          wx.hideLoading()
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          })
          reject(err)
        }
      })
    })
  }

  handleAuthError() {
    wx.removeStorageSync('token')
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('tenant')
    wx.showModal({
      title: '提示',
      content: '登录已过期，请重新登录',
      showCancel: false,
      success: () => {
        // 触发登录
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        currentPage.onLoginSuccess && currentPage.onLoginSuccess()
      }
    })
  }

  get(url, params, options = {}) {
    let queryString = ''
    if (params) {
      queryString = '?' + Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')
    }
    return this.request({
      url: `${url}${queryString}`,
      method: 'GET',
      ...options
    })
  }

  post(url, data, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  put(url, data, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  delete(url, data, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }
}

module.exports = new Request()
