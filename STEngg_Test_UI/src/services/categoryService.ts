import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type {
  ApiResponse,
  Category,
  CreateCategoryRequest,
} from '@/models/api'

export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(
      API_ENDPOINTS.CATEGORIES
    )
    return response.data.data!
  },

  // Create category
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      API_ENDPOINTS.CATEGORIES,
      data
    )
    return response.data.data!
  },

  // Delete category
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`)
  },
}

