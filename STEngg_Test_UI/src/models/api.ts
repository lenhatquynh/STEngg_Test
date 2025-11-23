// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
}

// Pagination
export interface PagedResponse<T> {
  data: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
}

// Product Models
export interface ProductImage {
  id: string
  imageUrl: string
  isPrimary: boolean
  displayOrder: number
}

export interface Product {
  id: string
  name: string
  description?: string
  sku: string
  price: number
  stockQuantity: number
  categoryId?: string
  categoryName?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  attributes?: string
  version: number
  images: ProductImage[]
}

export interface CreateProductRequest {
  name: string
  description?: string
  sku: string
  price: number
  stockQuantity: number
  categoryId?: string
  isActive?: boolean
  attributes?: string
  images?: CreateProductImageRequest[]
}

export interface CreateProductImageRequest {
  imageUrl: string
  isPrimary?: boolean
  displayOrder?: number
}

export interface UpdateProductRequest {
  name: string
  description?: string
  price: number
  categoryId?: string
  isActive: boolean
  attributes?: string
  version?: number
}

export interface GetProductsRequest {
  pageNumber?: number
  pageSize?: number
  searchTerm?: string
  categoryId?: string
  isActive?: boolean
}

export interface InventoryStatus {
  productId: string
  productName: string
  sku: string
  currentStock: number
  isLowStock: boolean
  lowStockThreshold: number
}

export interface AdjustInventoryRequest {
  transactionType: 1 | 2 // 1 = In, 2 = Out
  quantity: number
  reason?: string
}

// Category Models
export interface Category {
  id: string
  name: string
  description?: string
  parentCategoryId?: string
  parentCategoryName?: string
  createdAt: string
  subCategories?: Category[]
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  parentCategoryId?: string
}

