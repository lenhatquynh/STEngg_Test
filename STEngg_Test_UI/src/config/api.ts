export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8080',
  TIMEOUT: 30000, // 30 seconds
}

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
} as const

