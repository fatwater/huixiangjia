import request from './index'

export const groupbuyApi = {
  getProducts: (params) => request.get('/groupbuy/products', params),
  getProduct: (id) => request.get(`/groupbuy/products/${id}`),
  createProduct: (data) => request.post('/groupbuy/products', data),
  updateProduct: (id, data) => request.put(`/groupbuy/products/${id}`, data),
  deleteProduct: (id) => request.delete(`/groupbuy/products/${id}`),
  getOrders: (params) => request.get('/groupbuy/orders', params)
}
