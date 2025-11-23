import apiClient from './apiClient'
import { API_ENDPOINTS } from '@/config/api'
import type {
  ApiResponse,
  Product,
  PagedResponse,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsRequest,
  InventoryStatus,
  AdjustInventoryRequest,
} from '@/models/api'

export const productService = {
  // Get all products with pagination and filters
  getProducts: async (params?: GetProductsRequest): Promise<PagedResponse<Product>> => {
    const response = await apiClient.get<ApiResponse<PagedResponse<Product>>>(
      API_ENDPOINTS.PRODUCTS,
      { params }
    )
    return response.data.data!
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`
    )
    return response.data.data!
  },

  // Create product
  createProduct: async (data: CreateProductRequest): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      API_ENDPOINTS.PRODUCTS,
      data
    )
    return response.data.data!
  },

  // Update product
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}`,
      data
    )
    return response.data.data!
  },

  // Delete product (soft delete)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`)
  },

  // Get inventory status
  getInventoryStatus: async (id: string): Promise<InventoryStatus> => {
    const response = await apiClient.get<ApiResponse<InventoryStatus>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}/inventory`
    )
    return response.data.data!
  },

  // Adjust inventory
  adjustInventory: async (
    id: string,
    data: AdjustInventoryRequest
  ): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>(
      `${API_ENDPOINTS.PRODUCTS}/${id}/inventory/adjust`,
      data
    )
    return response.data.data!
  },
}

