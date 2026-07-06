import axios from 'axios'
import { getAccessToken } from '../lib/auth-session'
import { refreshSession } from '../lib/refresh-session'

const baseURL = import.meta.env.VITE_API_URL ?? 'https://mybusiness-api.caiquerawos.com/'

const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const isAuthRoute = original?.url?.includes('/auth/')
    if (error.response?.status === 401 && !original?._retry && !isAuthRoute) {
      original._retry = true
      const session = await refreshSession()
      if (session) {
        original.headers.Authorization = `Bearer ${session.accessToken}`
        return http(original)
      }
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default http
