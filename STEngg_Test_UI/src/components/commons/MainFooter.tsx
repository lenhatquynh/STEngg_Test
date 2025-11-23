'use client'

// ** Next & React Imports
import Link from 'next/link'

// ** MUI Imports
import {
  Inventory2 as InventoryIcon
} from '@mui/icons-material'
import { Box, Stack, Typography } from '@mui/material'

// ** Constant Imports
import { colors } from '@/constants/color'
import { ROUTES } from '@/constants/routes'

const MainFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: colors.darkBlue,
        color: colors.white,
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Stack spacing={4}>
          {/* Main Footer Content */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={4}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            {/* Brand Section */}
            <Stack spacing={2} sx={{ flex: { md: '0 0 300px' } }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <InventoryIcon sx={{ fontSize: 32, color: colors.blue }} />
                <Typography variant="h6" fontWeight="bold">
                  Product Manager
                </Typography>
              </Stack>
              <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                A comprehensive product management system for retail and
                e-commerce applications. Manage your inventory, products, and
                categories with ease.
              </Typography>
            </Stack>

            {/* Quick Links */}
            <Stack spacing={2} sx={{ minWidth: { xs: '100%', md: '200px' } }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Quick Links
              </Typography>
              <Link
                href={ROUTES.PRODUCTS}
                style={{
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    '&:hover': {
                      color: colors.blue,
                      transition: 'color 0.2s',
                    },
                  }}
                >
                  Products
                </Typography>
              </Link>
              <Link
                href={ROUTES.PRODUCT_CREATE}
                style={{
                  textDecoration: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    '&:hover': {
                      color: colors.blue,
                      transition: 'color 0.2s',
                    },
                  }}
                >
                  Create Product
                </Typography>
              </Link>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default MainFooter
