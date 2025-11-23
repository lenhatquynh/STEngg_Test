'use client'

import { useRouter, useParams } from 'next/navigation'
import { useProduct, useUpdateProduct } from '@/hooks/useProducts'
import ProductForm from '@/components/products/ProductForm'
import { ROUTES } from '@/constants/routes'
import { Box, CircularProgress, Typography } from '@mui/material'
import type { CreateProductRequest, UpdateProductRequest } from '@/models/api'

const EditProductPage = () => {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: product, isLoading } = useProduct(id)
  const updateProduct = useUpdateProduct()

  const handleSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    // When editing, we know it's always UpdateProductRequest with isActive as boolean
    const updateData: UpdateProductRequest = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      isActive: data.isActive ?? true, // Ensure isActive is always boolean
      attributes: data.attributes,
    }
    
    try {
      await updateProduct.mutateAsync({
        id,
        data: {
          ...updateData,
          version: product?.version,
        },
      })
      router.push(ROUTES.PRODUCT_DETAIL(id))
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">Product not found</Typography>
      </Box>
    )
  }

  return (
    <ProductForm
      initialData={product}
      onSubmit={handleSubmit}
      isLoading={updateProduct.isPending}
      onCancel={() => router.push(ROUTES.PRODUCT_DETAIL(id))}
    />
  )
}

export default EditProductPage

