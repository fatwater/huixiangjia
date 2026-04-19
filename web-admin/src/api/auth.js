import request from './index'

export const authApi = {
  login: (data) => request.post('/auth/admin/login', data),
  logout: () => request.post('/auth/admin/logout'),
  getUserInfo: () => request.get('/auth/admin/userinfo')
}
