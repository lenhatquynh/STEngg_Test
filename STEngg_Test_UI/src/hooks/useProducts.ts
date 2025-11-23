import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { productService } from '@/services/productService'
import type {
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsRequest,
  AdjustInventoryRequest,
} from '@/models/api'

const QUERY_KEYS = {
  products: (params?: GetProductsRequest) => ['products', params],
  product: (id: string) => ['product', id],
  inventory: (id: string) => ['inventory', id],
} as const

// Get products with pagination
export const useProducts = (params?: GetProductsRequest) => {
  return useQuery({
    queryKey: QUERY_KEYS.products(params),
    queryFn: () => productService.getProducts(params),
  })
}

// Get single product
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.product(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  })
}

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product created successfully!')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to create product'
      toast.error(message)
    },
  })
}

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product(variables.id) })
      toast.success('Product updated successfully!')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to update product'
      toast.error(message)
    },
  })
}

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('Product deleted successfully!')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to delete product'
      toast.error(message)
    },
  })
}

// Get inventory status
export const useInventoryStatus = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.inventory(id),
    queryFn: () => productService.getInventoryStatus(id),
    enabled: !!id,
  })
}

// Adjust inventory
export const useAdjustInventory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdjustInventoryRequest }) =>
      productService.adjustInventory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.product(variables.id) })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.inventory(variables.id) })
      toast.success('Inventory adjusted successfully!')
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message = error.response?.data?.message || 'Failed to adjust inventory'
      toast.error(message)
    },
  })
}

