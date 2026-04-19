import request from './index'

export const userApi = {
  list: (params) => request.get('/users', params),
  detail: (id) => request.get(`/users/${id}`),
  create: (data) => request.post('/users', data),
  update: (id, data) => request.put(`/users/${id}`, data),
  delete: (id) => request.delete(`/users/${id}`),
  import: (data) => request.post('/users/import', data)
}
