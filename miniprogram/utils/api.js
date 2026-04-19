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
