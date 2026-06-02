import axios from 'axios'
import type { RefreshTokenResponse } from '../types'

const BASE_URL = 'http://localhost:3000/api'

const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

http.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string> | null = null

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken')

      // Trường hợp không có refresh token, hoặc refresh token đã hết hạn
      // Thì sẽ xóa access token và redirect về trang login
      if (!refreshToken) {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post<RefreshTokenResponse>(`${BASE_URL}/auth/refresh`, {
              refreshToken
            })
            .then(({ data }) => {
              localStorage.setItem('accessToken', data.accessToken)
              localStorage.setItem('refreshToken', data.refreshToken)
              return data.accessToken
            })
            .finally(() => {
              refreshPromise = null
            })
        }
        const accessToken = await refreshPromise
        original.headers.Authorization = `Bearer ${accessToken}`
        return http(original)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default http
