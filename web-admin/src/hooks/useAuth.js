import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { authApi } from '../api/auth'
import { setToken, removeToken, getToken } from '../utils/storage'

export function useAuth() {
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken())

  const login = useCallback(async (values) => {
    try {
      const res = await authApi.login(values)
      setToken(res.token)
      setIsAuthenticated(true)
      message.success('登录成功')
      navigate('/dashboard')
    } catch (error) {
      message.error(error.message || '登录失败')
      throw error
    }
  }, [navigate])

  const logout = useCallback(() => {
    removeToken()
    setIsAuthenticated(false)
    navigate('/login')
  }, [navigate])

  return { isAuthenticated, login, logout }
}
