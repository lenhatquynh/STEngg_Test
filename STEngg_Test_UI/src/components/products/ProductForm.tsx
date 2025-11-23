'use client'

import { useCategories } from '@/hooks/useCategories'
import type { CreateProductRequest, Product, UpdateProductRequest } from '@/models/api'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import * as yup from 'yup'

const productSchema = yup.object({
  name: yup
    .string()
    .required('Product name is required')
    .max(200, 'Name must not exceed 200 characters'),
  description: yup
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .notRequired(),
  sku: yup
    .string()
    .required('SKU is required')
    .max(100, 'SKU must not exceed 100 characters')
    .matches(
      /^[A-Z0-9\-_]+$/,
      'SKU must contain only uppercase letters, numbers, hyphens, and underscores'
    ),
  price: yup
    .number()
    .required('Price is required')
    .min(0, 'Price must be non-negative')
    .max(999999.99, 'Price must not exceed 999,999.99'),
  stockQuantity: yup
    .number()
    .required('Stock quantity is required')
    .min(0, 'Stock quantity must be non-negative')
    .integer('Stock quantity must be an integer'),
  categoryId: yup.string().notRequired(),
  isActive: yup.boolean().notRequired(),
  attributes: yup.string().notRequired(),
}) as yup.ObjectSchema<CreateProductRequest>

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: CreateProductRequest | UpdateProductRequest) => void | Promise<void>
  isLoading?: boolean
  onCancel?: () => void
}

const ProductForm = ({
  initialData,
  onSubmit,
  isLoading,
  onCancel,
}: ProductFormProps) => {
  const router = useRouter()
  const { data: categories } = useCategories()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductRequest>({
    resolver: yupResolver(productSchema) as Resolver<CreateProductRequest>,
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      sku: initialData?.sku || '',
      price: initialData?.price || 0,
      stockQuantity: initialData?.stockQuantity || 0,
      categoryId: initialData?.categoryId || '',
      isActive: initialData?.isActive ?? true,
      attributes: initialData?.attributes || '',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        sku: initialData.sku,
        price: initialData.price,
        stockQuantity: initialData.stockQuantity,
        categoryId: initialData.categoryId || '',
        isActive: initialData.isActive,
        attributes: initialData.attributes || '',
      })
    }
  }, [initialData, reset])

  const handleFormSubmit = async (data: CreateProductRequest) => {
    if (initialData) {
      // For updates, ensure isActive is always a boolean
      const updateData: UpdateProductRequest = {
        name: data.name,
        description: data.description || undefined,
        price: data.price,
        categoryId: data.categoryId || undefined,
        isActive: data.isActive ?? true,
        attributes: data.attributes || undefined,
      }
      await onSubmit(updateData)
    } else {
      // For creates, isActive can be optional
      await onSubmit({
        ...data,
        categoryId: data.categoryId || undefined,
        description: data.description || undefined,
        attributes: data.attributes || undefined,
      })
    }
  }

  return (
    <Box sx={{ p: 4, pt: 12, maxWidth: 1200, mx: [0, 'auto'] }}>
      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h4" fontWeight="bold">
                {initialData ? 'Edit Product' : 'Create Product'}
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Product Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        required
                        sx={{ flex: 1 }}
                      />
                    )}
                  />

                  <Controller
                    name="sku"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="SKU"
                        error={!!errors.sku}
                        helperText={errors.sku?.message}
                        required
                        disabled={!!initialData}
                        sx={{ flex: 1 }}
                      />
                    )}
                  />
                </Stack>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      error={!!errors.description}
                      helperText={errors.description?.message}
                    />
                  )}
                />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Price"
                        type="number"
                        inputProps={{ step: '0.01', min: 0 }}
                        error={!!errors.price}
                        helperText={errors.price?.message}
                        required
                        sx={{ flex: 1 }}
                      />
                    )}
                  />

                  <Controller
                    name="stockQuantity"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Stock Quantity"
                        type="number"
                        inputProps={{ min: 0 }}
                        error={!!errors.stockQuantity}
                        helperText={errors.stockQuantity?.message}
                        required
                        sx={{ flex: 1 }}
                      />
                    )}
                  />

                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth sx={{ flex: 1 }}>
                        <InputLabel>Category</InputLabel>
                        <Select {...field} label="Category">
                          <MenuItem value="">None</MenuItem>
                          {categories?.map(cat => (
                            <MenuItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Stack>

                <Controller
                  name="attributes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Attributes (JSON)"
                      multiline
                      rows={3}
                      placeholder='{"Size": ["S", "M", "L"], "Color": "Black"}'
                      helperText="Enter JSON format for flexible product attributes"
                    />
                  )}
                />

                <Controller
                  name="isActive"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label="Active"
                    />
                  )}
                />

                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={onCancel || (() => router.back())}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? 'Saving...'
                      : initialData
                        ? 'Update'
                        : 'Create'}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProductForm
