'use client'

import { ROUTES } from '@/constants/routes'
import { useCategories } from '@/hooks/useCategories'
import { useDeleteProduct, useProducts } from '@/hooks/useProducts'
import type { Product } from '@/models/api'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const ProductsPage = () => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search term
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setPage(1) // Reset to first page on search
    }, 1000) // 1000ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchTerm])

  const { data, isLoading, error } = useProducts({
    pageNumber: page,
    pageSize,
    searchTerm: debouncedSearchTerm || undefined,
    categoryId: categoryId || undefined,
    isActive,
  })

  const { data: categories } = useCategories()
  const deleteProduct = useDeleteProduct()

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct.mutateAsync(id)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error">
          Failed to load products. Please try again.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4, pt: 12 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4" fontWeight="bold">
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push(ROUTES.PRODUCT_CREATE)}
          >
            Create Product
          </Button>
        </Stack>

        {/* Filters */}
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
                sx={{ width: ['100%', '40%'] }}
                slotProps={{
                  input: {
                    sx: {
                      height: '56px',
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormControl fullWidth sx={{ width: ['100%', '30%'] }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryId}
                  onChange={e => {
                    setCategoryId(e.target.value)
                    setPage(1)
                  }}
                  label="Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories?.map(cat => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ width: ['100%', '30%'] }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={isActive === undefined ? '' : isActive.toString()}
                  onChange={e => {
                    const value = e.target.value
                    setIsActive(value === '' ? undefined : value === 'true')
                    setPage(1)
                  }}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchTerm('')
                  setDebouncedSearchTerm('')
                  setCategoryId('')
                  setIsActive(undefined)
                  setPage(1)
                }}
                sx={{ width: ['100%', '20%'], height: '56px' }}
              >
                Clear
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Products List */}
        {isLoading ? (
          <Stack
            direction="row"
            sx={{
              flexWrap: 'wrap',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} sx={{ width: ['100%', '300px'] }}>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={3}
              sx={{
                flexWrap: 'wrap',
              }}
            >
              {data?.data.map((product: Product) => (
                <Card
                  key={product.id}
                  sx={{
                    padding: '12px',
                    maxWidth: ['100%', '300px'],
                    width: '100%',
                    height: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {product.name}
                        </Typography>
                        <Chip
                          label={product.isActive ? 'Active' : 'Inactive'}
                          color={product.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary" noWrap>
                        SKU: {product.sku}
                      </Typography>

                      {product.categoryName && (
                        <Chip
                          label={product.categoryName}
                          size="small"
                          variant="outlined"
                        />
                      )}

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight="bold"
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Stock: {product.stockQuantity}
                        </Typography>
                      </Stack>

                      {product.stockQuantity < 10 && (
                        <Chip
                          label="Low Stock"
                          color="warning"
                          size="small"
                          sx={{ width: 'fit-content' }}
                        />
                      )}

                      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            router.push(ROUTES.PRODUCT_DETAIL(product.id))
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() =>
                            router.push(ROUTES.PRODUCT_EDIT(product.id))
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            {data && data.data.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
              </Box>
            )}

            {/* Pagination */}
            {data && data.totalPages > 0 && (
              <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                  count={data.totalPages}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size="large"
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Showing {(page - 1) * pageSize + 1} -{' '}
                  {Math.min(page * pageSize, data.totalCount)} of{' '}
                  {data.totalCount} products
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Box>
  )
}

export default ProductsPage
