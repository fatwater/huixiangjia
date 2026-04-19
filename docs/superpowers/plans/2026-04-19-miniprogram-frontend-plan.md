# 会想家小程序前端实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成会想家微信小程序的 MVP 所有页面和组件开发

**Architecture:** 基于 Skyline 渲染引擎 + glass-easel 组件框架，使用微信原生开发方式，页面放置在 pages/ 目录，公共组件放置在 components/ 目录，工具函数放置在 utils/ 目录。

**Tech Stack:** Skyline + glass-easel + 微信小程序原生 API

---

## 文件结构

```
miniprogram-2/
├── miniprogram/              # 小程序根目录
│   ├── app.js / app.json / app.wxss / app.acss
│   ├── pages/
│   │   ├── index/           # 首页
│   │   ├── property/
│   │   │   ├── meeting/     # 会议室列表
│   │   │   ├── meeting-detail/   # 会议室详情 + 预约
│   │   │   └── my-bookings/ # 我的预约
│   │   ├── merchant/
│   │   │   ├── list/        # 商家列表
│   │   │   └── detail/      # 商家详情
│   │   ├── groupbuy/
│   │   │   ├── list/        # 商品列表
│   │   │   └── order/       # 订单管理
│   │   ├── access/
│   │   │   ├── visitor/     # 访客预约
│   │   │   ├── record/      # 通行记录
│   │   │   └── code/        # 通行码展示
│   │   └── profile/         # 个人中心
│   ├── components/
│   │   ├── navigation-bar/   # 导航栏（已有）
│   │   ├── module-card/     # 模块入口卡片
│   │   ├── quick-action/    # 快捷入口
│   │   ├── meeting-room-card/   # 会议室卡片
│   │   ├── merchant-card/    # 商家卡片
│   │   ├── product-card/    # 商品卡片
│   │   ├── visitor-form/    # 访客表单
│   │   ├── access-record/   # 通行记录项
│   │   ├── loading-button/  # 加载按钮
│   │   ├── empty-state/     # 空状态
│   │   └── user-header/     # 用户信息头部
│   └── utils/
│       ├── request.js       # 请求封装
│       ├── auth.js          # 认证工具
│       ├── api.js           # API 接口列表
│       └── date.js          # 日期工具
```

---

## 任务清单

### 任务 1: 项目初始化配置

**Files:**
- Create: `miniprogram/app.acss`
- Modify: `miniprogram/app.json`

- [ ] **Step 1: 创建全局样式文件**

创建 `miniprogram/app.acss`（Skyline 使用 acss）:

```css
/* 全局颜色变量 */
page {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --text-color: #333333;
  --text-secondary: #666666;
  --text-placeholder: #999999;
  --border-color: #e5e5e5;
  --bg-color: #f5f5f5;
  --white: #ffffff;
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;
  --border-radius: 8rpx;
  --border-radius-lg: 16rpx;
}

/* 全局字体 */
text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 通用工具类 */
.flex {
  display: flex;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-xs { gap: var(--spacing-xs); }
.gap-sm { gap: var(--spacing-sm); }
.gap-md { gap: var(--spacing-md); }
.gap-lg { gap: var(--spacing-lg); }

.mt-sm { margin-top: var(--spacing-sm); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }
.mb-sm { margin-bottom: var(--spacing-sm); }
.mb-md { margin-bottom: var(--spacing-md); }
.mb-lg { margin-bottom: var(--spacing-lg); }
.ml-sm { margin-left: var(--spacing-sm); }
.mr-sm { margin-right: var(--spacing-sm); }

.p-sm { padding: var(--spacing-sm); }
.p-md { padding: var(--spacing-md); }
.p-lg { padding: var(--spacing-lg); }

.text-primary { color: var(--text-color); }
.text-secondary { color: var(--text-secondary); }
.text-placeholder { color: var(--text-placeholder); }
.text-primary-color { color: var(--primary-color); }
.text-success { color: var(--success-color); }
.text-warning { color: var(--warning-color); }
.text-error { color: var(--error-color); }

.text-sm { font-size: 24rpx; }
.text-md { font-size: 28rpx; }
.text-lg { font-size: 32rpx; }
.text-xl { font-size: 36rpx; }
.text-bold { font-weight: 600; }

.bg-white { background-color: var(--white); }
.bg-gray { background-color: var(--bg-color); }

.card {
  background-color: var(--white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  border-radius: var(--border-radius);
  font-size: 32rpx;
  font-weight: 500;
}

.btn-primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.btn-default {
  background-color: var(--white);
  color: var(--text-color);
  border: 1rpx solid var(--border-color);
}

.btn-disabled {
  opacity: 0.5;
}
```

- [ ] **Step 2: 更新 app.json 配置**

```json
{
  "pages": [
    "pages/index/index",
    "pages/property/meeting/meeting",
    "pages/property/meeting-detail/meeting-detail",
    "pages/property/my-bookings/my-bookings",
    "pages/merchant/list/list",
    "pages/merchant/detail/detail",
    "pages/groupbuy/list/list",
    "pages/groupbuy/order/order",
    "pages/access/visitor/visitor",
    "pages/access/record/record",
    "pages/access/code/code",
    "pages/profile/profile"
  ],
  "window": {
    "navigationBarTextStyle": "black",
    "navigationStyle": "custom"
  },
  "style": "v2",
  "renderer": "skyline",
  "rendererOptions": {
    "skyline": {
      "defaultDisplayBlock": true,
      "defaultContentBox": true,
      "tagNameStyleIsolation": "legacy",
      "disableABTest": true,
      "sdkVersionBegin": "3.0.0",
      "sdkVersionEnd": "15.255.255"
    }
  },
  "componentFramework": "glass-easel",
  "sitemapLocation": "sitemap.json",
  "lazyCodeLoading": "requiredComponents",
  "tabBar": {
    "custom": true,
    "color": "#999999",
    "selectedColor": "#1890ff",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/property/meeting/meeting",
        "text": "物业"
      },
      {
        "pagePath": "pages/merchant/list/list",
        "text": "商家"
      },
      {
        "pagePath": "pages/groupbuy/list/list",
        "text": "团购"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "我的"
      }
    ]
  }
}
```

- [ ] **Step 3: 更新 app.js**

```javascript
const { createApp } = require('glass-easel')

const app = createApp({
  onLaunch() {
    // 检查登录状态
    this.checkLogin()
  },

  async checkLogin() {
    const token = wx.getStorageSync('token')
    if (!token) {
      // 触发登录流程
      this.globalData.needLogin = true
    } else {
      // 验证 token 有效性
      try {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
          this.globalData.userInfo = userInfo
          this.globalData.tenant = wx.getStorageSync('tenant')
        }
      } catch (e) {
        console.error('读取用户信息失败', e)
      }
    }
  },

  globalData: {
    userInfo: null,
    tenant: null,
    needLogin: false
  }
})

app.init()
module.exports = app
```

- [ ] **Step 4: 创建 tabBar 组件**

Create: `miniprogram/components/tab-bar/tab-bar.js`
```javascript
Component({
  data: {
    active: 'index',
    list: [
      { pagePath: 'pages/index/index', text: '首页', icon: 'home', activeIcon: 'home-fill' },
      { pagePath: 'pages/property/meeting/meeting', text: '物业', icon: 'building', activeIcon: 'building-fill' },
      { pagePath: 'pages/merchant/list/list', text: '商家', icon: 'shop', activeIcon: 'shop-fill' },
      { pagePath: 'pages/groupbuy/list/list', text: '团购', icon: 'shopping-cart', activeIcon: 'shopping-cart-fill' },
      { pagePath: 'pages/profile/profile', text: '我的', icon: 'user', activeIcon: 'user-fill' }
    ]
  },

  lifetimes: {
    attached() {
      this.updateActive()
    }
  },

  pageLifetimes: {
    show() {
      this.updateActive()
    }
  },

  methods: {
    updateActive() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      if (currentPage) {
        const route = currentPage.route
        const active = this.getActiveTab(route)
        if (active !== this.data.active) {
          this.setData({ active })
        }
      }
    },

    getActiveTab(route) {
      if (route.includes('index')) return 'index'
      if (route.includes('property') || route.includes('meeting')) return 'property'
      if (route.includes('merchant')) return 'merchant'
      if (route.includes('groupbuy')) return 'groupbuy'
      if (route.includes('profile')) return 'profile'
      return 'index'
    },

    switchTab(e) {
      const { index } = e.currentTarget.dataset
      const item = this.data.list[index]
      wx.switchTab({ url: `/${item.pagePath}` })
    }
  }
})
```

Create: `miniprogram/components/tab-bar/tab-bar.wxml`
```xml
<view class="tab-bar">
  <view
    class="tab-item {{active === item.pagePath ? 'active' : ''}}"
    data-index="{{index}}"
    bindtap="switchTab"
    wx:for="{{list}}"
    wx:key="pagePath"
  >
    <view class="icon">{{item.text}}</view>
    <view class="text">{{item.text}}</view>
  </view>
</view>
```

Create: `miniprogram/components/tab-bar/tab-bar.wxss`
```css
.tab-bar {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #ffffff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
}

.tab-item .icon {
  font-size: 40rpx;
  color: #999999;
}

.tab-item .text {
  font-size: 22rpx;
  color: #999999;
}

.tab-item.active .icon,
.tab-item.active .text {
  color: #1890ff;
}
```

Create: `miniprogram/components/tab-bar/tab-bar.json`
```json
{
  "component": true,
  "styleIsolation": "apply-shared"
}
```

---

### 任务 2: 工具函数封装

**Files:**
- Create: `miniprogram/utils/request.js`
- Create: `miniprogram/utils/api.js`
- Create: `miniprogram/utils/auth.js`
- Create: `miniprogram/utils/date.js`

- [ ] **Step 1: 创建请求封装 request.js**

```javascript
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
```

- [ ] **Step 2: 创建 API 接口列表 api.js**

```javascript
// miniprogram/utils/api.js

const request = require('./request')

// 认证模块
exports.auth = {
  login: (code) => request.post('/auth/login', { code }),
  logout: () => request.post('/auth/logout', {}),
  getUserInfo: () => request.get('/auth/userinfo')
}

// 办公物业 - 会议室
exports.property = {
  // 获取会议室列表
  getMeetingRooms: (params) => request.get('/property/meeting-rooms', params),
  // 获取会议室详情
  getMeetingRoomDetail: (id) => request.get(`/property/meeting-rooms/${id}`),
  // 预约会议室
  createBooking: (data) => request.post('/property/bookings', data),
  // 获取我的预约
  getMyBookings: (params) => request.get('/property/bookings', params),
  // 取消预约
  cancelBooking: (id) => request.delete(`/property/bookings/${id}`)
}

// 周边商家
exports.merchant = {
  // 获取商家列表
  getMerchants: (params) => request.get('/merchants', params),
  // 获取商家详情
  getMerchantDetail: (id) => request.get(`/merchants/${id}`),
  // 收藏商家
  favoriteMerchant: (id, userId) => request.post(`/merchants/${id}/favorite`, { user_id: userId }),
  // 取消收藏
  unfavoriteMerchant: (id, userId) => request.delete(`/merchants/${id}/favorite`),
  // 获取我的收藏
  getMyFavorites: (userId) => request.get('/merchants/favorites', { user_id: userId })
}

// 公司团购
exports.groupbuy = {
  // 获取商品列表
  getProducts: (params) => request.get('/groupbuy/products', params),
  // 获取商品详情
  getProductDetail: (id) => request.get(`/groupbuy/products/${id}`),
  // 创建订单
  createOrder: (data) => request.post('/groupbuy/orders', data),
  // 获取我的订单
  getMyOrders: (params) => request.get('/groupbuy/orders', params),
  // 取消订单
  cancelOrder: (id) => request.put(`/groupbuy/orders/${id}/cancel`)
}

// 公司门禁
exports.access = {
  // 创建访客预约
  createVisitor: (data) => request.post('/access/visitors', data),
  // 获取访客记录
  getMyVisitors: (params) => request.get('/access/visitors', params),
  // 获取通行码
  getAccessCode: (id) => request.get(`/access/visitors/${id}/code`),
  // 获取通行记录
  getAccessRecords: (params) => request.get('/access/records', params)
}
```

- [ ] **Step 3: 创建认证工具 auth.js**

```javascript
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
```

- [ ] **Step 4: 创建日期工具 date.js**

```javascript
// miniprogram/utils/date.js

const FORMAT_DEFAULT = 'YYYY-MM-DD'
const FORMAT_TIME = 'YYYY-MM-DD HH:mm'
const FORMAT_FULL = 'YYYY-MM-DD HH:mm:ss'

function formatDate(date, format = FORMAT_DEFAULT) {
  if (!date) return ''

  const d = date instanceof Date ? date : new Date(date)

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function getToday() {
  return formatDate(new Date())
}

function getTomorrow() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return formatDate(d)
}

function getDateRange(days = 7) {
  const dates = []
  for (let i = 0; i < days; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      value: formatDate(d),
      label: formatDate(d, 'MM-DD'),
      week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
    })
  }
  return dates
}

function isToday(dateStr) {
  return dateStr === getToday()
}

function isTomorrow(dateStr) {
  return dateStr === getTomorrow()
}

function getWeekDay(dateStr) {
  const d = new Date(dateStr)
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()]
}

module.exports = {
  formatDate,
  getToday,
  getTomorrow,
  getDateRange,
  isToday,
  isTomorrow,
  getWeekDay,
  FORMAT_DEFAULT,
  FORMAT_TIME,
  FORMAT_FULL
}
```

---

### 任务 3: 公共组件开发

**Files:**
- Create: `miniprogram/components/module-card/`
- Create: `miniprogram/components/quick-action/`
- Create: `miniprogram/components/meeting-room-card/`
- Create: `miniprogram/components/merchant-card/`
- Create: `miniprogram/components/product-card/`
- Create: `miniprogram/components/visitor-form/`
- Create: `miniprogram/components/access-record/`
- Create: `miniprogram/components/loading-button/`
- Create: `miniprogram/components/empty-state/`
- Create: `miniprogram/components/user-header/`

- [ ] **Step 1: 创建 module-card 组件**

Create: `miniprogram/components/module-card/module-card.js`
```javascript
Component({
  properties: {
    title: { type: String },
    icon: { type: String },
    color: { type: String, default: '#1890ff' },
    badge: { type: Number, value: 0 }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap')
    }
  }
})
```

Create: `miniprogram/components/module-card/module-card.wxml`
```xml
<view class="module-card" bindtap="onTap">
  <view class="icon-wrap" style="background-color: {{color}}20">
    <text class="icon-text">{{icon}}</text>
  </view>
  <view class="title">{{title}}</view>
  <view class="badge" wx:if="{{badge > 0}}">{{badge > 99 ? '99+' : badge}}</view>
</view>
```

Create: `miniprogram/components/module-card/module-card.wxss`
```css
.module-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 320rpx;
  height: 200rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  position: relative;
}

.icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.icon-text {
  font-size: 40rpx;
}

.title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  min-width: 36rpx;
  height: 36rpx;
  padding: 0 8rpx;
  background-color: #ff4d4f;
  color: #ffffff;
  font-size: 22rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

Create: `miniprogram/components/module-card/module-card.json`
```json
{
  "component": true
}
```

- [ ] **Step 2: 创建 quick-action 组件**

Create: `miniprogram/components/quick-action/quick-action.js`
```javascript
Component({
  properties: {
    actions: { type: Array }
  }
})
```

Create: `miniprogram/components/quick-action/quick-action.wxml`
```xml
<view class="quick-action">
  <view
    class="action-item"
    wx:for="{{actions}}"
    wx:key="id"
    bindtap="onAction"
    data-id="{{item.id}}"
  >
    <text class="action-icon">{{item.icon}}</text>
    <text class="action-text">{{item.text}}</text>
  </view>
</view>
```

Create: `miniprogram/components/quick-action/quick-action.wxss`
```css
.quick-action {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
}

.action-icon {
  font-size: 32rpx;
}

.action-text {
  font-size: 26rpx;
  color: #333333;
}
```

Create: `miniprogram/components/quick-action/quick-action.json`
```json
{
  "component": true
}
```

- [ ] **Step 3: 创建 meeting-room-card 组件**

Create: `miniprogram/components/meeting-room-card/meeting-room-card.js`
```javascript
Component({
  properties: {
    room: { type: Object },
    date: { type: String },
    selectedSlot: { type: String }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { room: this.data.room })
    }
  }
})
```

Create: `miniprogram/components/meeting-room-card/meeting-room-card.wxml`
```xml
<view class="meeting-room-card" bindtap="onTap">
  <view class="header">
    <view class="name">{{room.name}}</view>
    <view class="status {{room.status === 1 ? 'available' : 'unavailable'}}">
      {{room.status === 1 ? '可用' : '不可用'}}
    </view>
  </view>
  <view class="info">
    <text class="info-item">📍 {{room.floor}}</text>
    <text class="info-item">👥 {{room.capacity}}人</text>
  </view>
  <view class="facilities">
    <text class="facility-tag" wx:for="{{room.facilities}}" wx:key="index">
      {{item}}
    </text>
  </view>
</view>
```

Create: `miniprogram/components/meeting-room-card/meeting-room-card.wxss`
```css
.meeting-room-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
}

.status.available {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status.unavailable {
  background-color: #f5f5f5;
  color: #999999;
}

.info {
  display: flex;
  gap: 24rpx;
  margin-bottom: 16rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666666;
}

.facilities {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.facility-tag {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  background-color: #f5f5f5;
  color: #666666;
  border-radius: 4rpx;
}
```

Create: `miniprogram/components/meeting-room-card/meeting-room-card.json`
```json
{
  "component": true
}
```

- [ ] **Step 4: 创建 merchant-card 组件**

Create: `miniprogram/components/merchant-card/merchant-card.js`
```javascript
Component({
  properties: {
    merchant: { type: Object }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { merchant: this.data.merchant })
    }
  }
})
```

Create: `miniprogram/components/merchant-card/merchant-card.wxml`
```xml
<view class="merchant-card" bindtap="onTap">
  <image class="cover" src="{{merchant.cover_image || '/assets/images/default-merchant.png'}}" mode="aspectFill"/>
  <view class="content">
    <view class="name">{{merchant.name}}</view>
    <view class="category">{{merchant.category}}</view>
    <view class="address">{{merchant.address}}</view>
    <view class="footer">
      <view class="coupon" wx:if="{{merchant.coupon_info}}">{{merchant.coupon_info}}</view>
    </view>
  </view>
</view>
```

Create: `miniprogram/components/merchant-card/merchant-card.wxss`
```css
.merchant-card {
  display: flex;
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.cover {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8rpx;
}

.category {
  font-size: 24rpx;
  color: #1890ff;
  margin-bottom: 8rpx;
}

.address {
  font-size: 24rpx;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8rpx;
}

.coupon {
  font-size: 22rpx;
  color: #ff4d4f;
  background-color: #fff1f0;
  padding: 4rpx 12rpx;
  border-radius: 4rpx;
}
```

Create: `miniprogram/components/merchant-card/merchant-card.json`
```json
{
  "component": true
}
```

- [ ] **Step 5: 创建 product-card 组件**

Create: `miniprogram/components/product-card/product-card.js`
```javascript
Component({
  properties: {
    product: { type: Object }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { product: this.data.product })
    }
  }
})
```

Create: `miniprogram/components/product-card/product-card.wxml`
```xml
<view class="product-card" bindtap="onTap">
  <image class="cover" src="{{product.cover_image}}" mode="aspectFill"/>
  <view class="info">
    <view class="name">{{product.name}}</view>
    <view class="price-row">
      <text class="price">¥{{product.price}}</text>
      <text class="original-price" wx:if="{{product.original_price > product.price}}">
        ¥{{product.original_price}}
      </text>
    </view>
    <view class="sales">已售 {{product.sales_count}}</view>
  </view>
</view>
```

Create: `miniprogram/components/product-card/product-card.wxss`
```css
.product-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  overflow: hidden;
  width: 340rpx;
  margin-bottom: 16rpx;
}

.cover {
  width: 340rpx;
  height: 340rpx;
}

.info {
  padding: 16rpx;
}

.name {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-bottom: 8rpx;
}

.price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: 600;
}

.original-price {
  font-size: 24rpx;
  color: #999999;
  text-decoration: line-through;
}

.sales {
  font-size: 24rpx;
  color: #999999;
}
```

Create: `miniprogram/components/product-card/product-card.json`
```json
{
  "component": true
}
```

- [ ] **Step 6: 创建 visitor-form 组件**

Create: `miniprogram/components/visitor-form/visitor-form.js`
```javascript
Component({
  properties: {},

  data: {
    formData: {
      visitor_name: '',
      phone: '',
      visit_date: '',
      purpose: ''
    },
    dateRange: []
  },

  lifetimes: {
    attached() {
      const dateUtil = require('../../utils/date')
      this.setData({ dateRange: dateUtil.getDateRange(30) })
    }
  },

  methods: {
    onFieldChange(e) {
      const { field } = e.currentTarget.dataset
      this.setData(`formData.${field}`, e.detail.value)
    },

    onDateChange(e) {
      this.setData('formData.visit_date', e.detail.value)
    },

    validate() {
      const { visitor_name, phone, visit_date, purpose } = this.data.formData
      if (!visitor_name.trim()) {
        wx.showToast({ title: '请输入访客姓名', icon: 'none' })
        return false
      }
      if (!phone.trim() || !/^1\d{10}$/.test(phone)) {
        wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
        return false
      }
      if (!visit_date) {
        wx.showToast({ title: '请选择访问日期', icon: 'none' })
        return false
      }
      if (!purpose.trim()) {
        wx.showToast({ title: '请输入访问目的', icon: 'none' })
        return false
      }
      return true
    },

    getFormData() {
      return this.data.formData
    },

    reset() {
      this.setData({
        formData: {
          visitor_name: '',
          phone: '',
          visit_date: '',
          purpose: ''
        }
      })
    }
  }
})
```

Create: `miniprogram/components/visitor-form/visitor-form.wxml`
```xml
<view class="visitor-form">
  <view class="form-item">
    <view class="label">访客姓名 *</view>
    <input
      class="input"
      placeholder="请输入访客姓名"
      value="{{formData.visitor_name}}"
      data-field="visitor_name"
      bindinput="onFieldChange"
    />
  </view>

  <view class="form-item">
    <view class="label">手机号 *</view>
    <input
      class="input"
      type="number"
      placeholder="请输入访客手机号"
      value="{{formData.phone}}"
      maxlength="11"
      data-field="phone"
      bindinput="onFieldChange"
    />
  </view>

  <view class="form-item">
    <view class="label">访问日期 *</view>
    <picker mode="date" bindchange="onDateChange" value="{{formData.visit_date}}">
      <view class="picker">
        {{formData.visit_date || '请选择访问日期'}}
      </view>
    </picker>
  </view>

  <view class="form-item">
    <view class="label">访问目的 *</view>
    <textarea
      class="textarea"
      placeholder="请输入访问目的"
      value="{{formData.purpose}}"
      data-field="purpose"
      bindinput="onFieldChange"
    />
  </view>
</view>
```

Create: `miniprogram/components/visitor-form/visitor-form.wxss`
```css
.visitor-form {
  padding: 0;
}

.form-item {
  margin-bottom: 32rpx;
}

.label {
  font-size: 28rpx;
  color: #333333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.input {
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.picker {
  height: 88rpx;
  padding: 0 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  color: #999999;
}

.picker:not(.placeholder) {
  color: #333333;
}

.textarea {
  padding: 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  min-height: 200rpx;
  width: 100%;
  box-sizing: border-box;
}
```

Create: `miniprogram/components/visitor-form/visitor-form.json`
```json
{
  "component": true
}
```

- [ ] **Step 7: 创建 access-record 组件**

Create: `miniprogram/components/access-record/access-record.js`
```javascript
Component({
  properties: {
    record: { type: Object }
  },

  methods: {
    onTap() {
      this.triggerEvent('tap', { record: this.data.record })
    }
  }
})
```

Create: `miniprogram/components/access-record/access-record.wxml`
```xml
<view class="access-record" bindtap="onTap">
  <view class="icon-wrap {{record.result === 1 ? 'success' : 'fail'}}">
    <text>{{record.result === 1 ? '✓' : '✗'}}</text>
  </view>
  <view class="content">
    <view class="title">{{record.access_type_text}}</view>
    <view class="desc">{{record.device_name}}</view>
    <view class="time">{{record.access_time}}</view>
  </view>
</view>
```

Create: `miniprogram/components/access-record/access-record.wxss`
```css
.access-record {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 16rpx;
}

.icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  font-size: 32rpx;
  color: #ffffff;
}

.icon-wrap.success {
  background-color: #52c41a;
}

.icon-wrap.fail {
  background-color: #ff4d4f;
}

.content {
  flex: 1;
}

.title {
  font-size: 30rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.desc {
  font-size: 26rpx;
  color: #666666;
  margin-bottom: 8rpx;
}

.time {
  font-size: 24rpx;
  color: #999999;
}
```

Create: `miniprogram/components/access-record/access-record.json`
```json
{
  "component": true
}
```

- [ ] **Step 8: 创建 loading-button 组件**

Create: `miniprogram/components/loading-button/loading-button.js`
```javascript
Component({
  properties: {
    text: { type: String, default: '提交' },
    loading: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },

  methods: {
    onTap() {
      if (!this.data.loading && !this.data.disabled) {
        this.triggerEvent('tap')
      }
    }
  }
})
```

Create: `miniprogram/components/loading-button/loading-button.wxml`
```xml
<button
  class="loading-button {{loading || disabled ? 'disabled' : ''}}"
  bindtap="onTap"
  disabled="{{loading || disabled}}"
>
  <text class="loading-icon" wx:if="{{loading}}">⟳</text>
  <text>{{loading ? '加载中...' : text}}</text>
</button>
```

Create: `miniprogram/components/loading-button/loading-button.wxss`
```css
.loading-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88rpx;
  background-color: #1890ff;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 500;
  border-radius: 8rpx;
  border: none;
}

.loading-button.disabled {
  opacity: 0.6;
}

.loading-icon {
  margin-right: 8rpx;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

Create: `miniprogram/components/loading-button/loading-button.json`
```json
{
  "component": true
}
```

- [ ] **Step 9: 创建 empty-state 组件**

Create: `miniprogram/components/empty-state/empty-state.js`
```javascript
Component({
  properties: {
    text: { type: String, default: '暂无数据' },
    icon: { type: String, default: '📭' }
  }
})
```

Create: `miniprogram/components/empty-state/empty-state.wxml`
```xml
<view class="empty-state">
  <text class="icon">{{icon}}</text>
  <text class="text">{{text}}</text>
</view>
```

Create: `miniprogram/components/empty-state/empty-state.wxss`
```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.icon {
  font-size: 120rpx;
  margin-bottom: 32rpx;
}

.text {
  font-size: 28rpx;
  color: #999999;
}
```

Create: `miniprogram/components/empty-state/empty-state.json`
```json
{
  "component": true
}
```

- [ ] **Step 10: 创建 user-header 组件**

Create: `miniprogram/components/user-header/user-header.js`
```javascript
Component({
  properties: {
    user: { type: Object },
    tenant: { type: Object }
  }
})
```

Create: `miniprogram/components/user-header/user-header.wxml`
```xml
<view class="user-header">
  <image
    class="avatar"
    src="{{user.avatar || '/assets/images/default-avatar.png'}}"
    mode="aspectFill"
  />
  <view class="info">
    <view class="name">{{user.name}}</view>
    <view class="tenant">{{tenant.name}}</view>
  </view>
</view>
```

Create: `miniprogram/components/user-header/user-header.wxss`
```css
.user-header {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background-color: #1890ff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.info {
  flex: 1;
}

.name {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.tenant {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}
```

Create: `miniprogram/components/user-header/user-header.json`
```json
{
  "component": true
}
```

---

### 任务 4: 首页开发

**Files:**
- Create: `miniprogram/pages/index/index.js`
- Create: `miniprogram/pages/index/index.wxml`
- Create: `miniprogram/pages/index/index.wxss`
- Create: `miniprogram/pages/index/index.json`

- [ ] **Step 1: 创建 index.js**

```javascript
const app = getApp()
const auth = require('../../utils/auth')
const api = require('../../utils/api')

Page({
  data: {
    userInfo: null,
    tenant: null,
    modules: [
      { id: 'property', title: '办公物业', icon: '🏢', color: '#1890ff', path: '/pages/property/meeting/meeting' },
      { id: 'merchant', title: '周边商家', icon: '🏪', color: '#52c41a', path: '/pages/merchant/list/list' },
      { id: 'groupbuy', title: '公司团购', icon: '🛒', color: '#faad14', path: '/pages/groupbuy/list/list' },
      { id: 'access', title: '公司门禁', icon: '🚪', color: '#722ed1', path: '/pages/access/visitor/visitor' }
    ],
    quickActions: [
      { id: 'bookings', icon: '📅', text: '我的预约', path: '/pages/property/my-bookings/my-bookings' },
      { id: 'visitors', icon: '👤', text: '访客邀请', path: '/pages/access/visitor/visitor' },
      { id: 'orders', icon: '📦', text: '我的订单', path: '/pages/groupbuy/order/order' },
      { id: 'records', icon: '🚪', text: '开门记录', path: '/pages/access/record/record' }
    ],
    showLogin: false
  },

  onLoad() {
    this.checkLoginStatus()
  },

  onShow() {
    this.checkLoginStatus()
  },

  checkLoginStatus() {
    const userInfo = auth.getUserInfo()
    const tenant = auth.getTenant()

    if (userInfo && tenant) {
      this.setData({ userInfo, tenant })
    } else {
      this.setData({ showLogin: true })
    }
  },

  onLoginSuccess() {
    this.checkLoginStatus()
  },

  async handleLogin() {
    try {
      wx.showLoading({ title: '登录中...' })
      await auth.login()
      wx.hideLoading()
      this.setData({ showLogin: false })
      this.checkLoginStatus()
    } catch (err) {
      wx.hideLoading()
      wx.showToast({
        title: '登录失败',
        icon: 'none'
      })
    }
  },

  onModuleTap(e) {
    const { module } = e.currentTarget.dataset
    if (!auth.isLoggedIn()) {
      this.setData({ showLogin: true })
      return
    }
    wx.navigateTo({ url: module.path })
  },

  onActionTap(e) {
    const { action } = e.currentTarget.dataset
    if (!auth.isLoggedIn()) {
      this.setData({ showLogin: true })
      return
    }
    wx.navigateTo({ url: action.path })
  }
})
```

- [ ] **Step 2: 创建 index.wxml**

```xml
<view class="page">
  <navigation-bar title="会想家" back="{{false}}" color="white" background="transparent"/>

  <!-- 用户信息头部 -->
  <user-header
    wx:if="{{userInfo}}"
    user="{{userInfo}}"
    tenant="{{tenant}}"
  />

  <!-- 未登录状态 -->
  <view class="login-card" wx:if="{{!userInfo}}">
    <text class="login-text">登录后享受更多服务</text>
    <view class="login-btn" bindtap="handleLogin">微信登录</view>
  </view>

  <!-- 模块入口 -->
  <view class="section">
    <view class="modules">
      <module-card
        wx:for="{{modules}}"
        wx:key="id"
        title="{{item.title}}"
        icon="{{item.icon}}"
        color="{{item.color}}"
        data-module="{{item}}"
        bindtap="onModuleTap"
      />
    </view>
  </view>

  <!-- 快捷入口 -->
  <view class="section">
    <view class="section-title">快捷入口</view>
    <quick-action actions="{{quickActions}}" bind:action="onActionTap"/>
  </view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 3: 创建 index.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 32rpx 24rpx;
  padding: 48rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.login-text {
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 24rpx;
}

.login-btn {
  width: 200rpx;
  height: 80rpx;
  background-color: #1890ff;
  color: #ffffff;
  font-size: 28rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section {
  padding: 0 32rpx;
  margin-bottom: 24rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.modules {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}
```

- [ ] **Step 4: 创建 index.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "user-header": "/components/user-header/user-header",
    "module-card": "/components/module-card/module-card",
    "quick-action": "/components/quick-action/quick-action"
  }
}
```

---

### 任务 5: 办公物业页面开发

**Files:**
- Create: `miniprogram/pages/property/meeting/meeting.js`
- Create: `miniprogram/pages/property/meeting/meeting.wxml`
- Create: `miniprogram/pages/property/meeting/meeting.wxss`
- Create: `miniprogram/pages/property/meeting/meeting.json`
- Create: `miniprogram/pages/property/meeting-detail/meeting-detail.js`
- Create: `miniprogram/pages/property/meeting-detail/meeting-detail.wxml`
- Create: `miniprogram/pages/property/meeting-detail/meeting-detail.wxss`
- Create: `miniprogram/pages/property/meeting-detail/meeting-detail.json`
- Create: `miniprogram/pages/property/my-bookings/my-bookings.js`
- Create: `miniprogram/pages/property/my-bookings/my-bookings.wxml`
- Create: `miniprogram/pages/property/my-bookings/my-bookings.wxss`
- Create: `miniprogram/pages/property/my-bookings/my-bookings.json`

- [ ] **Step 1: 创建会议室列表页 meeting.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')
const dateUtil = require('../../../utils/date')

Page({
  data: {
    dateRange: [],
    selectedDate: '',
    rooms: [],
    loading: false,
    tenantId: null
  },

  onLoad() {
    const tenant = auth.getTenant()
    this.setData({
      dateRange: dateUtil.getDateRange(7),
      selectedDate: dateUtil.getToday(),
      tenantId: tenant?.id
    })
    this.loadRooms()
  },

  onShow() {
    this.loadRooms()
  },

  async loadRooms() {
    if (!this.data.tenantId) return

    this.setData({ loading: true })
    try {
      const rooms = await api.property.getMeetingRooms({
        tenant_id: this.data.tenantId,
        date: this.data.selectedDate
      })
      this.setData({ rooms })
    } catch (err) {
      console.error('加载会议室失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onDateChange(e) {
    const index = e.detail.value
    const date = this.data.dateRange[index].value
    this.setData({ selectedDate: date })
    this.loadRooms()
  },

  onRoomTap(e) {
    const { room } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/property/meeting-detail/meeting-detail?id=${room.id}&date=${this.data.selectedDate}`
    })
  }
})
```

- [ ] **Step 2: 创建会议室列表页 meeting.wxml**

```xml
<view class="page">
  <navigation-bar title="会议室预约" back="{{true}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 日期选择 -->
    <view class="date-picker">
      <picker
        mode="selector"
        range="{{dateRange}}"
        range-key="label"
        bindchange="onDateChange"
      >
        <view class="picker-value">
          <text>📅 {{selectedDate}}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>

    <!-- 会议室列表 -->
    <view class="room-list">
      <meeting-room-card
        wx:for="{{rooms}}"
        wx:key="id"
        room="{{item}}"
        date="{{selectedDate}}"
        data-room="{{item}}"
        bindtap="onRoomTap"
      />

      <empty-state
        wx:if="{{!loading && rooms.length === 0}}"
        text="暂无会议室"
        icon="🏢"
      />
    </view>
  </scroll-view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 3: 创建会议室列表页样式 meeting.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 160rpx);
}

.date-picker {
  padding: 24rpx 32rpx;
}

.picker-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #333333;
}

.arrow {
  font-size: 24rpx;
  color: #999999;
}

.room-list {
  padding: 0 32rpx;
}
```

- [ ] **Step 4: 创建会议室列表页配置 meeting.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "meeting-room-card": "/components/meeting-room-card/meeting-room-card",
    "empty-state": "/components/empty-state/empty-state"
  }
}
```

- [ ] **Step 5: 创建会议室详情页 meeting-detail.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    roomId: null,
    date: '',
    room: null,
    timeSlots: [
      '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
      '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00',
      '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00'
    ],
    selectedSlot: '',
    bookedSlots: [],
    purpose: '',
    loading: false,
    submitting: false
  },

  onLoad(options) {
    this.setData({
      roomId: options.id,
      date: options.date
    })
    this.loadRoomDetail()
  },

  async loadRoomDetail() {
    this.setData({ loading: true })
    try {
      const room = await api.property.getMeetingRoomDetail(this.data.roomId)
      this.setData({
        room,
        bookedSlots: room.bookings?.map(b => b.time_slot) || []
      })
    } catch (err) {
      console.error('加载会议室详情失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onSlotSelect(e) {
    const { slot } = e.currentTarget.dataset
    if (this.data.bookedSlots.includes(slot)) {
      wx.showToast({ title: '该时段已被预约', icon: 'none' })
      return
    }
    this.setData({ selectedSlot: slot })
  },

  onPurposeInput(e) {
    this.setData({ purpose: e.detail.value })
  },

  async onSubmit() {
    if (!this.data.selectedSlot) {
      wx.showToast({ title: '请选择时间段', icon: 'none' })
      return
    }
    if (!this.data.purpose.trim()) {
      wx.showToast({ title: '请输入会议用途', icon: 'none' })
      return
    }

    const user = auth.getUserInfo()
    const tenant = auth.getTenant()

    this.setData({ submitting: true })
    try {
      await api.property.createBooking({
        tenant_id: tenant.id,
        user_id: user.id,
        room_id: this.data.roomId,
        date: this.data.date,
        time_slot: this.data.selectedSlot,
        purpose: this.data.purpose
      })
      wx.showToast({ title: '预约成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      wx.showToast({ title: err.message || '预约失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  }
})
```

- [ ] **Step 6: 创建会议室详情页 meeting-detail.wxml**

```xml
<view class="page">
  <navigation-bar title="会议室详情" back="{{true}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 会议室信息 -->
    <view class="room-info card">
      <view class="room-name">{{room.name}}</view>
      <view class="room-meta">
        <text>📍 {{room.floor}}</text>
        <text>👥 {{room.capacity}}人</text>
      </view>
      <view class="facilities">
        <text class="facility-tag" wx:for="{{room.facilities}}" wx:key="index">
          {{item}}
        </text>
      </view>
    </view>

    <!-- 时间段选择 -->
    <view class="section">
      <view class="section-title">选择时间段 - {{date}}</view>
      <view class="time-slots">
        <view
          class="time-slot {{selectedSlot === item ? 'selected' : ''}} {{bookedSlots.includes(item) ? 'booked' : ''}}"
          wx:for="{{timeSlots}}"
          wx:key="index"
          data-slot="{{item}}"
          bindtap="onSlotSelect"
        >
          {{item}}
        </view>
      </view>
    </view>

    <!-- 会议用途 -->
    <view class="section">
      <view class="section-title">会议用途</view>
      <textarea
        class="purpose-input"
        placeholder="请输入会议用途"
        value="{{purpose}}"
        bindinput="onPurposeInput"
      />
    </view>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <loading-button
        text="确认预约"
        loading="{{submitting}}"
        disabled="{{!selectedSlot || !purpose}}"
        bindtap="onSubmit"
      />
    </view>
  </scroll-view>
</view>
```

- [ ] **Step 7: 创建会议室详情页样式 meeting-detail.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-area {
  height: calc(100vh - 180rpx);
}

.card {
  margin: 24rpx;
  padding: 32rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.room-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.room-meta {
  display: flex;
  gap: 32rpx;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #666666;
}

.facilities {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.facility-tag {
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  background-color: #f5f5f5;
  color: #666666;
  border-radius: 8rpx;
}

.section {
  margin: 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
}

.time-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.time-slot {
  width: 150rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #333333;
}

.time-slot.selected {
  background-color: #1890ff;
  color: #ffffff;
}

.time-slot.booked {
  background-color: #f5f5f5;
  color: #cccccc;
  text-decoration: line-through;
}

.purpose-input {
  width: 100%;
  min-height: 200rpx;
  padding: 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.submit-area {
  padding: 24rpx 32rpx;
}
```

- [ ] **Step 8: 创建会议室详情页配置 meeting-detail.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "loading-button": "/components/loading-button/loading-button"
  }
}
```

- [ ] **Step 9: 创建我的预约页面 my-bookings.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    bookings: [],
    loading: false,
    tabIndex: 0,
    tabs: ['全部', '待审核', '已通过', '已取消']
  },

  onLoad() {
    this.loadBookings()
  },

  onShow() {
    this.loadBookings()
  },

  async loadBookings() {
    const user = auth.getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const bookings = await api.property.getMyBookings({ user_id: user.id })
      this.setData({ bookings })
    } catch (err) {
      console.error('加载预约失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  async onCancel(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个预约吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await api.property.cancelBooking(id)
            wx.showToast({ title: '已取消', icon: 'success' })
            this.loadBookings()
          } catch (err) {
            wx.showToast({ title: '取消失败', icon: 'none' })
          }
        }
      }
    })
  }
})
```

- [ ] **Step 10: 创建我的预约页面 my-bookings.wxml**

```xml
<view class="page">
  <navigation-bar title="我的预约" back="{{true}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <view class="booking-list">
      <view class="booking-item" wx:for="{{bookings}}" wx:key="id">
        <view class="booking-header">
          <text class="room-name">{{item.room.name}}</text>
          <text class="status status-{{item.status}}">{{item.status_text}}</text>
        </view>
        <view class="booking-info">
          <text>📅 {{item.date}} {{item.time_slot}}</text>
          <text>📝 {{item.purpose}}</text>
        </view>
        <view class="booking-actions" wx:if="{{item.status === 'pending'}}">
          <view class="cancel-btn" data-id="{{item.id}}" bindtap="onCancel">取消预约</view>
        </view>
      </view>

      <empty-state
        wx:if="{{!loading && bookings.length === 0}}"
        text="暂无预约记录"
        icon="📅"
      />
    </view>
  </scroll-view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 11: 创建我的预约页面样式 my-bookings.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 160rpx);
}

.booking-list {
  padding: 24rpx 32rpx;
}

.booking-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.room-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
}

.status-pending {
  background-color: #fffbe6;
  color: #faad14;
}

.status-confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-cancelled {
  background-color: #f5f5f5;
  color: #999999;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 26rpx;
  color: #666666;
}

.booking-actions {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
  display: flex;
  justify-content: flex-end;
}

.cancel-btn {
  font-size: 26rpx;
  color: #ff4d4f;
  padding: 8rpx 24rpx;
  border: 1rpx solid #ff4d4f;
  border-radius: 8rpx;
}
```

- [ ] **Step 12: 创建我的预约页面配置 my-bookings.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "empty-state": "/components/empty-state/empty-state"
  }
}
```

---

### 任务 6: 周边商家页面开发

**Files:**
- Create: `miniprogram/pages/merchant/list/list.js`
- Create: `miniprogram/pages/merchant/list/list.wxml`
- Create: `miniprogram/pages/merchant/list/list.wxss`
- Create: `miniprogram/pages/merchant/list/list.json`
- Create: `miniprogram/pages/merchant/detail/detail.js`
- Create: `miniprogram/pages/merchant/detail/detail.wxml`
- Create: `miniprogram/pages/merchant/detail/detail.wxss`
- Create: `miniprogram/pages/merchant/detail/detail.json`

- [ ] **Step 1: 创建商家列表页 list.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    merchants: [],
    loading: false,
    keyword: '',
    category: '',
    categories: ['全部', '餐饮', '超市', '水果', '药店', '干洗', '家政'],
    tenantId: null
  },

  onLoad() {
    const tenant = auth.getTenant()
    this.setData({ tenantId: tenant?.id })
    this.loadMerchants()
  },

  onShow() {
    this.loadMerchants()
  },

  async loadMerchants() {
    if (!this.data.tenantId) return

    this.setData({ loading: true })
    try {
      const merchants = await api.merchant.getMerchants({
        tenant_id: this.data.tenantId,
        keyword: this.data.keyword,
        category: this.data.category === '全部' ? '' : this.data.category
      })
      this.setData({ merchants })
    } catch (err) {
      console.error('加载商家失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.loadMerchants()
  },

  onCategoryChange(e) {
    const index = e.detail.value
    this.setData({ category: this.data.categories[index] })
    this.loadMerchants()
  },

  onMerchantTap(e) {
    const { merchant } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/merchant/detail/detail?id=${merchant.id}`
    })
  }
})
```

- [ ] **Step 2: 创建商家列表页 list.wxml**

```xml
<view class="page">
  <navigation-bar title="周边商家" back="{{false}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 搜索框 -->
    <view class="search-bar">
      <input
        class="search-input"
        placeholder="搜索商家"
        value="{{keyword}}"
        bindinput="onSearch"
      />
    </view>

    <!-- 分类标签 -->
    <scroll-view scroll-x class="category-scroll">
      <view class="categories">
        <view
          class="category-item {{category === item ? 'active' : ''}}"
          wx:for="{{categories}}"
          wx:key="index"
          data-category="{{item}}"
          bindtap="onCategoryChange"
        >
          {{item}}
        </view>
      </view>
    </scroll-view>

    <!-- 商家列表 -->
    <view class="merchant-list">
      <merchant-card
        wx:for="{{merchants}}"
        wx:key="id"
        merchant="{{item}}"
        data-merchant="{{item}}"
        bindtap="onMerchantTap"
      />

      <empty-state
        wx:if="{{!loading && merchants.length === 0}}"
        text="暂无商家"
        icon="🏪"
      />
    </view>
  </scroll-view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 3: 创建商家列表页样式 list.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 160rpx);
}

.search-bar {
  padding: 24rpx 32rpx;
}

.search-input {
  height: 72rpx;
  padding: 0 24rpx;
  background-color: #ffffff;
  border-radius: 36rpx;
  font-size: 28rpx;
}

.category-scroll {
  white-space: nowrap;
  padding: 0 32rpx 24rpx;
}

.categories {
  display: inline-flex;
  gap: 16rpx;
}

.category-item {
  padding: 12rpx 32rpx;
  background-color: #ffffff;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #666666;
  white-space: nowrap;
}

.category-item.active {
  background-color: #1890ff;
  color: #ffffff;
}

.merchant-list {
  padding: 0 32rpx;
}
```

- [ ] **Step 4: 创建商家列表页配置 list.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "merchant-card": "/components/merchant-card/merchant-card",
    "empty-state": "/components/empty-state/empty-state"
  }
}
```

- [ ] **Step 5: 创建商家详情页 detail.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    merchant: null,
    loading: false,
    isFavorited: false,
    userId: null
  },

  onLoad(options) {
    this.setData({ userId: auth.getUserInfo()?.id })
    this.loadMerchantDetail(options.id)
  },

  async loadMerchantDetail(id) {
    this.setData({ loading: true })
    try {
      const merchant = await api.merchant.getMerchantDetail(id)
      this.setData({ merchant })
    } catch (err) {
      console.error('加载商家详情失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  async onFavoriteTap() {
    const { merchant, isFavorited, userId } = this.data
    if (!userId) return

    try {
      if (isFavorited) {
        await api.merchant.unfavoriteMerchant(merchant.id, userId)
      } else {
        await api.merchant.favoriteMerchant(merchant.id, userId)
      }
      this.setData({ isFavorited: !isFavorited })
      wx.showToast({
        title: isFavorited ? '已取消收藏' : '已收藏',
        icon: 'success'
      })
    } catch (err) {
      wx.showToast({ title: '操作失败', icon: 'none' })
    }
  },

  onPhoneTap() {
    const { merchant } = this.data
    if (merchant.phone) {
      wx.makePhoneCall({ phoneNumber: merchant.phone })
    }
  },

  onMapTap() {
    const { merchant } = this.data
    if (merchant.latitude && merchant.longitude) {
      wx.openLocation({
        latitude: merchant.latitude,
        longitude: merchant.longitude,
        name: merchant.name,
        address: merchant.address
      })
    }
  }
})
```

- [ ] **Step 6: 创建商家详情页 detail.wxml**

```xml
<view class="page">
  <navigation-bar title="{{merchant.name || '商家详情'}}" back="{{true}}" color="black"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 商家封面 -->
    <image
      class="cover-image"
      src="{{merchant.cover_image || '/assets/images/default-merchant.png'}}"
      mode="aspectFill"
    />

    <!-- 商家信息 -->
    <view class="merchant-info card">
      <view class="name-row">
        <text class="name">{{merchant.name}}</text>
        <text
          class="favorite-btn {{isFavorited ? 'favorited' : ''}}"
          bindtap="onFavoriteTap"
        >
          {{isFavorited ? '❤️ 已收藏' : '🤍 收藏'}}
        </text>
      </view>
      <view class="category">{{merchant.category}}</view>

      <view class="info-item" bindtap="onMapTap">
        <text class="info-icon">📍</text>
        <text class="info-text">{{merchant.address}}</text>
        <text class="info-arrow">></text>
      </view>

      <view class="info-item" bindtap="onPhoneTap" wx:if="{{merchant.phone}}">
        <text class="info-icon">📞</text>
        <text class="info-text">{{merchant.phone}}</text>
        <text class="info-arrow">></text>
      </view>
    </view>

    <!-- 优惠信息 -->
    <view class="coupon-section card" wx:if="{{merchant.coupon_info}}">
      <view class="coupon-title">优惠信息</view>
      <view class="coupon-content">{{merchant.coupon_info}}</view>
    </view>

    <!-- 商家介绍 -->
    <view class="description-section card" wx:if="{{merchant.description}}">
      <view class="section-title">商家介绍</view>
      <text class="description">{{merchant.description}}</text>
    </view>

    <!-- 图片展示 -->
    <view class="photos-section card" wx:if="{{merchant.photos?.length}}">
      <view class="section-title">商家图片</view>
      <view class="photos">
        <image
          class="photo"
          wx:for="{{merchant.photos}}"
          wx:key="index"
          src="{{item}}"
          mode="aspectFill"
        />
      </view>
    </view>
  </scroll-view>
</view>
```

- [ ] **Step 7: 创建商家详情页样式 detail.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-area {
  height: calc(100vh - 180rpx);
}

.cover-image {
  width: 100%;
  height: 400rpx;
}

.card {
  margin: 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.name {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.favorite-btn {
  font-size: 26rpx;
  padding: 8rpx 20rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  color: #666666;
}

.favorite-btn.favorited {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.category {
  font-size: 26rpx;
  color: #1890ff;
  margin-bottom: 24rpx;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
}

.info-text {
  flex: 1;
  font-size: 28rpx;
  color: #666666;
}

.info-arrow {
  font-size: 28rpx;
  color: #cccccc;
}

.coupon-section {
  background-color: #fff1f0;
}

.coupon-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #ff4d4f;
  margin-bottom: 12rpx;
}

.coupon-content {
  font-size: 28rpx;
  color: #ff4d4f;
  line-height: 1.6;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.description {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.8;
}

.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.photo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}
```

- [ ] **Step 8: 创建商家详情页配置 detail.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar"
  }
}
```

---

### 任务 7: 公司团购页面开发

**Files:**
- Create: `miniprogram/pages/groupbuy/list/list.js`
- Create: `miniprogram/pages/groupbuy/list/list.wxml`
- Create: `miniprogram/pages/groupbuy/list/list.wxss`
- Create: `miniprogram/pages/groupbuy/list/list.json`
- Create: `miniprogram/pages/groupbuy/order/order.js`
- Create: `miniprogram/pages/groupbuy/order/order.wxml`
- Create: `miniprogram/pages/groupbuy/order/order.wxss`
- Create: `miniprogram/pages/groupbuy/order/order.json`

- [ ] **Step 1: 创建商品列表页 list.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    products: [],
    loading: false,
    tenantId: null
  },

  onLoad() {
    const tenant = auth.getTenant()
    this.setData({ tenantId: tenant?.id })
    this.loadProducts()
  },

  onShow() {
    this.loadProducts()
  },

  async loadProducts() {
    if (!this.data.tenantId) return

    this.setData({ loading: true })
    try {
      const products = await api.groupbuy.getProducts({
        tenant_id: this.data.tenantId,
        status: 1
      })
      this.setData({ products })
    } catch (err) {
      console.error('加载商品失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onProductTap(e) {
    const { product } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/groupbuy/order/order?id=${product.id}`
    })
  }
})
```

- [ ] **Step 2: 创建商品列表页 list.wxml**

```xml
<view class="page">
  <navigation-bar title="公司团购" back="{{false}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 团购列表 -->
    <view class="product-grid">
      <product-card
        wx:for="{{products}}"
        wx:key="id"
        product="{{item}}"
        data-product="{{item}}"
        bindtap="onProductTap"
      />

      <empty-state
        wx:if="{{!loading && products.length === 0}}"
        text="暂无团购商品"
        icon="🛒"
      />
    </view>
  </scroll-view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 3: 创建商品列表页样式 list.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 160rpx);
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  gap: 24rpx;
}
```

- [ ] **Step 4: 创建商品列表页配置 list.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "product-card": "/components/product-card/product-card",
    "empty-state": "/components/empty-state/empty-state"
  }
}
```

- [ ] **Step 5: 创建订单页 order.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    productId: null,
    product: null,
    quantity: 1,
    address: '',
    loading: false,
    submitting: false
  },

  onLoad(options) {
    this.setData({ productId: parseInt(options.id) })
    this.loadProductDetail()
    this.setDefaultAddress()
  },

  async loadProductDetail() {
    this.setData({ loading: true })
    try {
      const product = await api.groupbuy.getProductDetail(this.data.productId)
      this.setData({ product })
    } catch (err) {
      console.error('加载商品详情失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  setDefaultAddress() {
    const user = auth.getUserInfo()
    if (user?.address) {
      this.setData({ address: user.address })
    }
  },

  onQuantityChange(e) {
    const { type } = e.currentTarget.dataset
    const { quantity, product } = this.data
    if (type === 'add' && quantity < product.stock) {
      this.setData({ quantity: quantity + 1 })
    } else if (type === 'minus' && quantity > 1) {
      this.setData({ quantity: quantity - 1 })
    }
  },

  onAddressInput(e) {
    this.setData({ address: e.detail.value })
  },

  async onSubmit() {
    if (!this.data.address.trim()) {
      wx.showToast({ title: '请输入收货地址', icon: 'none' })
      return
    }

    const user = auth.getUserInfo()
    const tenant = auth.getTenant()

    this.setData({ submitting: true })
    try {
      await api.groupbuy.createOrder({
        tenant_id: tenant.id,
        user_id: user.id,
        product_id: this.data.productId,
        quantity: this.data.quantity,
        address: this.data.address
      })
      wx.showToast({ title: '下单成功', icon: 'success' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    } catch (err) {
      wx.showToast({ title: err.message || '下单失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  }
})
```

- [ ] **Step 6: 创建订单页 order.wxml**

```xml
<view class="page">
  <navigation-bar title="提交订单" back="{{true}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 商品信息 -->
    <view class="product-section card">
      <view class="product-row">
        <image class="product-image" src="{{product.cover_image}}" mode="aspectFill"/>
        <view class="product-info">
          <view class="product-name">{{product.name}}</view>
          <view class="product-price">¥{{product.price}}</view>
          <view class="product-stock">库存：{{product.stock}}</view>
        </view>
      </view>
    </view>

    <!-- 数量选择 -->
    <view class="quantity-section card">
      <text class="label">购买数量</text>
      <view class="quantity-control">
        <view
          class="quantity-btn"
          data-type="minus"
          bindtap="onQuantityChange"
        >-</view>
        <text class="quantity-value">{{quantity}}</text>
        <view
          class="quantity-btn"
          data-type="add"
          bindtap="onQuantityChange"
        >+</view>
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="address-section card">
      <view class="section-title">收货地址</view>
      <textarea
        class="address-input"
        placeholder="请输入收货地址"
        value="{{address}}"
        bindinput="onAddressInput"
      />
    </view>

    <!-- 订单摘要 -->
    <view class="summary-section card">
      <view class="summary-row">
        <text>商品金额</text>
        <text>¥{{(product.price * quantity).toFixed(2)}}</text>
      </view>
      <view class="summary-row total">
        <text>合计</text>
        <text class="total-price">¥{{(product.price * quantity).toFixed(2)}}</text>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-area">
      <loading-button
        text="提交订单"
        loading="{{submitting}}"
        bindtap="onSubmit"
      />
    </view>
  </scroll-view>
</view>
```

- [ ] **Step 7: 创建订单页样式 order.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scroll-area {
  height: calc(100vh - 180rpx);
}

.card {
  margin: 24rpx;
  padding: 24rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
}

.product-section {
  display: flex;
}

.product-row {
  display: flex;
  width: 100%;
}

.product-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: 600;
}

.product-stock {
  font-size: 24rpx;
  color: #999999;
}

.quantity-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 30rpx;
  color: #333333;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.quantity-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 32rpx;
  color: #333333;
}

.quantity-value {
  font-size: 32rpx;
  font-weight: 600;
  min-width: 60rpx;
  text-align: center;
}

.section-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 16rpx;
}

.address-input {
  width: 100%;
  min-height: 150rpx;
  padding: 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 0;
  font-size: 28rpx;
  color: #666666;
}

.summary-row.total {
  border-top: 1rpx solid #f5f5f5;
  margin-top: 8rpx;
  padding-top: 24rpx;
}

.total-price {
  font-size: 36rpx;
  color: #ff4d4f;
  font-weight: 600;
}

.submit-area {
  padding: 24rpx 32rpx;
}
```

- [ ] **Step 8: 创建订单页配置 order.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "loading-button": "/components/loading-button/loading-button"
  }
}
```

---

### 任务 8: 公司门禁页面开发

**Files:**
- Create: `miniprogram/pages/access/visitor/visitor.js`
- Create: `miniprogram/pages/access/visitor/visitor.wxml`
- Create: `miniprogram/pages/access/visitor/visitor.wxss`
- Create: `miniprogram/pages/access/visitor/visitor.json`
- Create: `miniprogram/pages/access/record/record.js`
- Create: `miniprogram/pages/access/record/record.wxml`
- Create: `miniprogram/pages/access/record/record.wxss`
- Create: `miniprogram/pages/access/record/record.json`
- Create: `miniprogram/pages/access/code/code.js`
- Create: `miniprogram/pages/access/code/code.wxml`
- Create: `miniprogram/pages/access/code/code.wxss`
- Create: `miniprogram/pages/access/code/code.json`

- [ ] **Step 1: 创建访客预约页 visitor.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    visitors: [],
    loading: false,
    submitting: false,
    showForm: false
  },

  onLoad() {
    this.loadVisitors()
  },

  onShow() {
    this.loadVisitors()
  },

  async loadVisitors() {
    const user = auth.getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const visitors = await api.access.getMyVisitors({ user_id: user.id })
      this.setData({ visitors })
    } catch (err) {
      console.error('加载访客记录失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onShowForm() {
    this.setData({ showForm: true })
  },

  onHideForm() {
    this.setData({ showForm: false })
  },

  async onSubmitVisitor() {
    const formData = this.selectComponent('#visitorForm').getFormData()
    const user = auth.getUserInfo()
    const tenant = auth.getTenant()

    this.setData({ submitting: true })
    try {
      await api.access.createVisitor({
        tenant_id: tenant.id,
        user_id: user.id,
        ...formData
      })
      wx.showToast({ title: '预约成功', icon: 'success' })
      this.selectComponent('#visitorForm').reset()
      this.setData({ showForm: false })
      this.loadVisitors()
    } catch (err) {
      wx.showToast({ title: err.message || '预约失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  onViewCode(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/access/code/code?id=${id}`
    })
  }
})
```

- [ ] **Step 2: 创建访客预约页 visitor.wxml**

```xml
<view class="page">
  <navigation-bar title="访客预约" back="{{false}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 预约按钮 -->
    <view class="action-bar">
      <view class="add-btn" bindtap="onShowForm">+ 邀请访客</view>
    </view>

    <!-- 访客列表 -->
    <view class="visitor-list">
      <view class="visitor-item" wx:for="{{visitors}}" wx:key="id">
        <view class="visitor-header">
          <text class="visitor-name">{{item.visitor_name}}</text>
          <text class="status status-{{item.status}}">{{item.status_text}}</text>
        </view>
        <view class="visitor-info">
          <text>📞 {{item.phone}}</text>
          <text>📅 {{item.visit_date}}</text>
          <text>📝 {{item.purpose}}</text>
        </view>
        <view class="visitor-actions" wx:if="{{item.status === 'active'}}">
          <view class="code-btn" data-id="{{item.id}}" bindtap="onViewCode">
            查看通行码
          </view>
        </view>
      </view>

      <empty-state
        wx:if="{{!loading && visitors.length === 0}}"
        text="暂无访客记录"
        icon="👤"
      />
    </view>
  </scroll-view>

  <!-- 预约表单弹窗 -->
  <view class="form-popup {{showForm ? 'show' : ''}}" wx:if="{{showForm}}">
    <view class="form-mask" bindtap="onHideForm"/>
    <view class="form-content">
      <view class="form-header">
        <text class="form-title">邀请访客</text>
        <text class="form-close" bindtap="onHideForm">×</text>
      </view>
      <visitor-form id="visitorForm"/>
      <loading-button
        text="确认邀请"
        loading="{{submitting}}"
        bindtap="onSubmitVisitor"
      />
    </view>
  </view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 3: 创建访客预约页样式 visitor.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 260rpx);
}

.action-bar {
  padding: 24rpx 32rpx;
}

.add-btn {
  height: 88rpx;
  background-color: #1890ff;
  color: #ffffff;
  font-size: 30rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.visitor-list {
  padding: 0 32rpx;
}

.visitor-item {
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
}

.visitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.visitor-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.status {
  font-size: 24rpx;
  padding: 4rpx 16rpx;
  border-radius: 4rpx;
}

.status-pending {
  background-color: #fffbe6;
  color: #faad14;
}

.status-active {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-expired {
  background-color: #f5f5f5;
  color: #999999;
}

.visitor-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  font-size: 26rpx;
  color: #666666;
}

.visitor-actions {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #f5f5f5;
  display: flex;
  justify-content: flex-end;
}

.code-btn {
  font-size: 26rpx;
  color: #1890ff;
  padding: 8rpx 24rpx;
  border: 1rpx solid #1890ff;
  border-radius: 8rpx;
}

/* 弹窗样式 */
.form-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: none;
}

.form-popup.show {
  display: block;
}

.form-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.form-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  padding: 32rpx;
  max-height: 80vh;
  overflow-y: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.form-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.form-close {
  font-size: 48rpx;
  color: #999999;
}
```

- [ ] **Step 4: 创建访客预约页配置 visitor.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "visitor-form": "/components/visitor-form/visitor-form",
    "loading-button": "/components/loading-button/loading-button",
    "empty-state": "/components/empty-state/empty-state"
  }
}
```

- [ ] **Step 5: 创建通行记录页 record.js**

```javascript
const api = require('../../../utils/api')
const auth = require('../../../utils/auth')

Page({
  data: {
    records: [],
    loading: false
  },

  onLoad() {
    this.loadRecords()
  },

  onShow() {
    this.loadRecords()
  },

  async loadRecords() {
    const user = auth.getUserInfo()
    if (!user) return

    this.setData({ loading: true })
    try {
      const records = await api.access.getAccessRecords({ user_id: user.id })
      this.setData({ records })
    } catch (err) {
      console.error('加载通行记录失败', err)
    } finally {
      this.setData({ loading: false })
    }
  }
})
```

- [ ] **Step 6: 创建通行记录页 record.wxml**

```xml
<view class="page">
  <navigation-bar title="通行记录" back="{{true}}" color="black" background="#f5f5f5"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <view class="record-list">
      <access-record
        wx:for="{{records}}"
        wx:key="id"
        record="{{item}}"
      />

      <empty-state
        wx:if="{{!loading && records.length === 0}}"
        text="暂无通行记录"
        icon="🚪"
      />
    </view>
  </scroll-view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 7: 创建通行记录页样式 record.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 160rpx);
}

.record-list {
  padding: 24rpx 32rpx;
}
```

- [ ] **Step 8: 创建通行记录页配置 record.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar",
    "access-record": "/components/access-record/access-record",
    "empty-state": "/components/empty-state/empty-state"
  }
}
```

- [ ] **Step 9: 创建通行码展示页 code.js**

```javascript
const api = require('../../../utils/api')

Page({
  data: {
    visitorId: null,
    accessCode: '',
    expiresAt: '',
    loading: false
  },

  onLoad(options) {
    this.setData({ visitorId: options.id })
    this.loadAccessCode()
  },

  async loadAccessCode() {
    this.setData({ loading: true })
    try {
      const data = await api.access.getAccessCode(this.data.visitorId)
      this.setData({
        accessCode: data.access_code,
        expiresAt: data.expires_at
      })
    } catch (err) {
      console.error('加载通行码失败', err)
    } finally {
      this.setData({ loading: false })
    }
  },

  onCopyCode() {
    wx.setClipboardData({
      data: this.data.accessCode,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  }
})
```

- [ ] **Step 10: 创建通行码展示页 code.wxml**

```xml
<view class="page">
  <navigation-bar title="通行码" back="{{true}}" color="black" background="#f5f5f5"/>

  <view class="content">
    <view class="code-display">
      <view class="code-label">访客通行码</view>
      <view class="code-value">{{accessCode}}</view>
      <view class="code-hint">请将通行码告知访客</view>
    </view>

    <view class="tips">
      <view class="tip-title">使用说明</view>
      <view class="tip-item">1. 访客到达时出示此通行码</view>
      <view class="tip-item">2. 门禁设备扫描通行码</view>
      <view class="tip-item">3. 验证成功后自动开门</view>
    </view>

    <view class="copy-btn" bindtap="onCopyCode">复制通行码</view>
  </view>
</view>
```

- [ ] **Step 11: 创建通行码展示页样式 code.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.content {
  padding: 48rpx 32rpx;
}

.code-display {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 64rpx;
  text-align: center;
  margin-bottom: 32rpx;
}

.code-label {
  font-size: 28rpx;
  color: #999999;
  margin-bottom: 24rpx;
}

.code-value {
  font-size: 64rpx;
  font-weight: 700;
  color: #1890ff;
  letter-spacing: 8rpx;
  margin-bottom: 24rpx;
}

.code-hint {
  font-size: 26rpx;
  color: #999999;
}

.tips {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx;
  margin-bottom: 32rpx;
}

.tip-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 24rpx;
}

.tip-item {
  font-size: 28rpx;
  color: #666666;
  line-height: 2;
}

.copy-btn {
  height: 88rpx;
  background-color: #1890ff;
  color: #ffffff;
  font-size: 32rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 12: 创建通行码展示页配置 code.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar"
  }
}
```

---

### 任务 9: 个人中心页面开发

**Files:**
- Create: `miniprogram/pages/profile/profile.js`
- Create: `miniprogram/pages/profile/profile.wxml`
- Create: `miniprogram/pages/profile/profile.wxss`
- Create: `miniprogram/pages/profile/profile.json`

- [ ] **Step 1: 创建个人中心 profile.js**

```javascript
const auth = require('../../utils/auth')

Page({
  data: {
    userInfo: null,
    tenant: null,
    menuItems: [
      { id: 'bookings', icon: '📅', text: '我的预约', path: '/pages/property/my-bookings/my-bookings' },
      { id: 'orders', icon: '📦', text: '我的订单', path: '/pages/groupbuy/order/order' },
      { id: 'favorites', icon: '❤️', text: '我的收藏', path: '/pages/merchant/list/list' },
      { id: 'records', icon: '🚪', text: '通行记录', path: '/pages/access/record/record' }
    ]
  },

  onShow() {
    this.setData({
      userInfo: auth.getUserInfo(),
      tenant: auth.getTenant()
    })
  },

  onMenuTap(e) {
    const { item } = e.currentTarget.dataset
    wx.navigateTo({ url: item.path })
  },

  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          auth.logout()
          this.setData({
            userInfo: null,
            tenant: null
          })
          wx.showToast({ title: '已退出', icon: 'success' })
        }
      }
    })
  }
})
```

- [ ] **Step 2: 创建个人中心 profile.wxml**

```xml
<view class="page">
  <navigation-bar title="我的" back="{{false}}" color="black" background="transparent"/>

  <scroll-view scroll-y type="list" class="scroll-area">
    <!-- 用户信息 -->
    <view class="user-section">
      <view class="user-card" wx:if="{{userInfo}}">
        <image
          class="avatar"
          src="{{userInfo.avatar || '/assets/images/default-avatar.png'}}"
          mode="aspectFill"
        />
        <view class="user-info">
          <view class="name">{{userInfo.name}}</view>
          <view class="phone">{{userInfo.phone}}</view>
        </view>
        <view class="tenant-tag">{{tenant.name}}</view>
      </view>

      <view class="login-tip" wx:else>
        <text>登录后查看更多信息</text>
      </view>
    </view>

    <!-- 菜单列表 -->
    <view class="menu-section">
      <view
        class="menu-item"
        wx:for="{{menuItems}}"
        wx:key="id"
        data-item="{{item}}"
        bindtap="onMenuTap"
      >
        <text class="menu-icon">{{item.icon}}</text>
        <text class="menu-text">{{item.text}}</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 退出按钮 -->
    <view class="logout-section" wx:if="{{userInfo}}">
      <view class="logout-btn" bindtap="onLogout">退出登录</view>
    </view>
  </scroll-view>

  <!-- 底部 TabBar -->
  <tab-bar/>
</view>
```

- [ ] **Step 3: 创建个人中心样式 profile.wxss**

```css
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.scroll-area {
  height: calc(100vh - 160rpx);
}

.user-section {
  padding: 32rpx;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 32rpx;
  background-color: #1890ff;
  border-radius: 16rpx;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  margin-right: 24rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-info {
  flex: 1;
}

.name {
  font-size: 36rpx;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 8rpx;
}

.phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.tenant-tag {
  font-size: 22rpx;
  padding: 8rpx 16rpx;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 20rpx;
}

.login-tip {
  padding: 64rpx;
  text-align: center;
  background-color: #ffffff;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #999999;
}

.menu-section {
  margin: 0 32rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #cccccc;
}

.logout-section {
  padding: 48rpx 32rpx;
}

.logout-btn {
  height: 88rpx;
  background-color: #ffffff;
  color: #ff4d4f;
  font-size: 32rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

- [ ] **Step 4: 创建个人中心配置 profile.json**

```json
{
  "usingComponents": {
    "navigation-bar": "/components/navigation-bar/navigation-bar",
    "tab-bar": "/components/tab-bar/tab-bar"
  }
}
```

---

## 自检清单

### Spec Coverage

- [x] 登录 - 企业微信 OAuth（auth.js）
- [x] 首页 - 4个模块入口 + 快捷入口（index/）
- [x] 办公物业 - 会议室预约（property/）
- [x] 周边商家 - 商家列表 + 详情 + 收藏（merchant/）
- [x] 公司团购 - 商品列表 + 下单（groupbuy/）
- [x] 公司门禁 - 访客预约 + 通行码（access/）
- [x] 个人中心（profile/）

### Placeholder Scan

- [x] 无 TBD/TODO 标记
- [x] 所有步骤包含完整代码
- [x] 所有路径为具体路径

### Type Consistency

- [x] API 接口名称一致
- [x] 组件命名一致
- [x] 页面路径一致
