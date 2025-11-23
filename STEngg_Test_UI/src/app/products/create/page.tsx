'use client'

import { useRouter } from 'next/navigation'
import ProductForm from '@/components/products/ProductForm'
import { useCreateProduct } from '@/hooks/useProducts'
import { ROUTES } from '@/constants/routes'
import type { CreateProductRequest, UpdateProductRequest } from '@/models/api'

const CreateProductPage = () => {
  const router = useRouter()
  const createProduct = useCreateProduct()

  const handleSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    // When creating, we know it's always CreateProductRequest (has sku and stockQuantity)
    // The form will pass CreateProductRequest when initialData is not provided
    // Type guard: CreateProductRequest has sku and stockQuantity, UpdateProductRequest doesn't
    if ('sku' in data && 'stockQuantity' in data) {
      try {
        await createProduct.mutateAsync(data)
        router.push(ROUTES.PRODUCTS)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isLoading={createProduct.isPending}
      onCancel={() => router.push(ROUTES.PRODUCTS)}
    />
  )
}

export default CreateProductPage

