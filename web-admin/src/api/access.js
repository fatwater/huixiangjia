import request from './index'

export const accessApi = {
  getDevices: (params) => request.get('/access/devices', params),
  createDevice: (data) => request.post('/access/devices', data),
  updateDevice: (id, data) => request.put(`/access/devices/${id}`, data),
  deleteDevice: (id) => request.delete(`/access/devices/${id}`)
}
