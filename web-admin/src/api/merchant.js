import request from './index'

export const merchantApi = {
  list: (params) => request.get('/merchants', params),
  detail: (id) => request.get(`/merchants/${id}`),
  create: (data) => request.post('/merchants', data),
  update: (id, data) => request.put(`/merchants/${id}`, data),
  delete: (id) => request.delete(`/merchants/${id}`)
}
