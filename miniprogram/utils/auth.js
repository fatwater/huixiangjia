// miniprogram/utils/auth.js

const api = require('./api')

async function login() {
  return new Promise((resolve, reject) => {
    // 调用企业微信登录
    wx.qy.login({
      success: async (res) => {
        if (res.code) {
          try {
            // 调用后端登录接口
            const data = await api.auth.login(res.code)

            // 保存 token 和用户信息
            wx.setStorageSync('token', data.token)
            wx.setStorageSync('userInfo', data.user)
            wx.setStorageSync('tenant', data.tenant)

            resolve(data)
          } catch (err) {
            reject(err)
          }
        } else {
          reject(new Error('企业微信登录失败'))
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

function logout() {
  wx.removeStorageSync('token')
  wx.removeStorageSync('userInfo')
  wx.removeStorageSync('tenant')
}

function getUserInfo() {
  return wx.getStorageSync('userInfo')
}

function getTenant() {
  return wx.getStorageSync('tenant')
}

function isLoggedIn() {
  return !!wx.getStorageSync('token')
}

function checkAndLogin() {
  if (!isLoggedIn()) {
    return login()
  }
  return Promise.resolve(getUserInfo())
}

module.exports = {
  login,
  logout,
  getUserInfo,
  getTenant,
  isLoggedIn,
  checkAndLogin
}
