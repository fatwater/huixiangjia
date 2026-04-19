import request from './index'

export const tenantApi = {
  list: (params) => request.get('/tenants', params),
  detail: (id) => request.get(`/tenants/${id}`),
  create: (data) => request.post('/tenants', data),
  update: (id, data) => request.put(`/tenants/${id}`, data),
  delete: (id) => request.delete(`/tenants/${id}`)
}
