import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_CONFIG } from '@/config/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if needed
    // const token = getAuthToken()
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<{ message?: string }>) => {
    // Handle common errors
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      switch (status) {
        case 400:
          console.error('Bad Request:', data?.message || 'Invalid request')
          break
        case 401:
          console.error('Unauthorized:', data?.message || 'Please login')
          break
        case 404:
          console.error('Not Found:', data?.message || 'Resource not found')
          break
        case 409:
          console.error('Conflict:', data?.message || 'Resource conflict')
          break
        case 500:
          console.error('Server Error:', data?.message || 'Internal server error')
          break
        default:
          console.error('Error:', data?.message || 'An error occurred')
      }
    } else if (error.request) {
      console.error('Network Error:', 'No response received from server')
    } else {
      console.error('Error:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient

