'use client'

import { ROUTES } from '@/constants/routes'
import {
  useAdjustInventory,
  useDeleteProduct,
  useInventoryStatus,
  useProduct,
} from '@/hooks/useProducts'
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

const ProductDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data: product, isLoading } = useProduct(id)
  const { data: inventory } = useInventoryStatus(id)
  const deleteProduct = useDeleteProduct()
  const adjustInventory = useAdjustInventory()

  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<1 | 2>(1)
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct.mutateAsync(id)
      router.push(ROUTES.PRODUCTS)
    }
  }

  const handleAdjustInventory = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      alert('Please enter a valid quantity')
      return
    }

    try {
      await adjustInventory.mutateAsync({
        id,
        data: {
          transactionType,
          quantity: parseInt(quantity),
          reason: reason || undefined,
        },
      })
      setAdjustDialogOpen(false)
      setQuantity('')
      setReason('')
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
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

  let attributes: Record<string, string | string[]> = {}
  try {
    if (product.attributes) {
      attributes = JSON.parse(product.attributes)
    }
  } catch (e) {
    console.error(e)
  }

  return (
    <Box sx={{ p: 4, pt: 12 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction={['column', 'row']}
          alignItems={['flex-start', 'center']}
          gap={2}
        >
          <IconButton onClick={() => router.push(ROUTES.PRODUCTS)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" flex={1}>
            {product.name}
          </Typography>
          <Stack direction="row" alignItems="center" gap={2} flexWrap="wrap">
            <Chip
              label={product.isActive ? 'Active' : 'Inactive'}
              color={product.isActive ? 'success' : 'default'}
            />
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => router.push(ROUTES.PRODUCT_EDIT(id))}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              Delete
            </Button>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Main Info */}
          <Card sx={{ flex: { xs: '1 1 100%', md: '1 1 66%' } }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight="bold">
                  Product Information
                </Typography>

                <Stack
                  direction={['column', 'row']}
                  alignItems={['flex-start', 'center']}
                  justifyContent={['flex-start', 'space-between']}
                  flexWrap="wrap"
                  gap={2}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      SKU
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {product.sku}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ${product.price.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Stock Quantity
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {product.stockQuantity} units
                    </Typography>
                  </Box>

                  {product.categoryName && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Category
                      </Typography>
                      <Chip label={product.categoryName} size="small" />
                    </Box>
                  )}
                </Stack>

                {product.description && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1">
                      {product.description}
                    </Typography>
                  </Box>
                )}

                {Object.keys(attributes).length > 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Attributes
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {Object.entries(attributes).map(([key, value]) => (
                        <Chip
                          key={key}
                          label={`${key}: ${Array.isArray(value) ? value.join(', ') : value}`}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Inventory & Actions */}
          <Stack spacing={3} sx={{ flex: { xs: '1 1 100%', md: '1 1 33%' } }}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Inventory Status
                  </Typography>

                  {inventory && (
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Current Stock
                        </Typography>
                        <Typography
                          variant="h4"
                          color={
                            inventory.isLowStock ? 'warning.main' : 'primary'
                          }
                        >
                          {inventory.currentStock}
                        </Typography>
                      </Box>

                      {inventory.isLowStock && (
                        <Chip label="Low Stock" color="warning" size="small" />
                      )}
                    </Stack>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<InventoryIcon />}
                    onClick={() => setAdjustDialogOpen(true)}
                  >
                    Adjust Inventory
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Product Images */}
            {product.images && product.images.length > 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Images
                  </Typography>
                  <Stack spacing={2}>
                    {product.images.map(image => (
                      <Box
                        key={image.id}
                        component="img"
                        src={image.imageUrl}
                        alt={product.name}
                        sx={{
                          width: '100%',
                          height: 200,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            )}
          </Stack>
        </Stack>
      </Stack>

      {/* Adjust Inventory Dialog */}
      <Dialog
        open={adjustDialogOpen}
        onClose={() => setAdjustDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adjust Inventory</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={transactionType}
                onChange={e => setTransactionType(e.target.value as 1 | 2)}
                label="Transaction Type"
              >
                <MenuItem value={1}>Stock In (Increase)</MenuItem>
                <MenuItem value={2}>Stock Out (Decrease)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              inputProps={{ min: 1 }}
            />

            <TextField
              fullWidth
              label="Reason (Optional)"
              value={reason}
              onChange={e => setReason(e.target.value)}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAdjustDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAdjustInventory}
            variant="contained"
            disabled={adjustInventory.isPending || !quantity}
          >
            {adjustInventory.isPending ? 'Processing...' : 'Adjust'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProductDetailPage
