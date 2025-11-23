'use client'

// ** Next & React Imports
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

// ** Constant Imports
import { colors } from '@/constants/color'
import { ROUTES } from '@/constants/routes'

// ** MUI Imports
import {
  Close as CloseIcon,
  Inventory2 as InventoryIcon,
  Menu as MenuIcon,
} from '@mui/icons-material'
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'

const MainHeader = () => {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [{ label: 'Products', href: ROUTES.PRODUCTS }]

  const isActive = (href: string) => {
    if (href === ROUTES.PRODUCTS) {
      return pathname?.startsWith('/products') || false
    }
    return pathname === href
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: colors.white,
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 1200,
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 2,
            px: { xs: 2, md: 4 },
            maxWidth: '1400px',
            width: '100%',
          }}
        >
          {/* Logo/Brand */}
          <Link href={ROUTES.PRODUCTS} style={{ textDecoration: 'none' }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <InventoryIcon
                sx={{
                  fontSize: 32,
                  color: colors.blue,
                  transition: 'color 0.3s ease-in-out',
                }}
              />
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{
                  color: colors.black,
                  transition: 'color 0.3s ease-in-out',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Product Manager
              </Typography>
            </Stack>
          </Link>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              display: { md: 'none' },
              color: colors.black,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            pt: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, pb: 1 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map(item => (
            <ListItem key={item.href} disablePadding>
              <ListItemButton
                component={Link}
                href={item.href}
                onClick={handleDrawerToggle}
                selected={isActive(item.href)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(0, 174, 239, 0.1)',
                    borderLeft: `3px solid ${colors.blue}`,
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.href) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 2, px: 2 }}>
            <Button
              component={Link}
              href={ROUTES.PRODUCT_CREATE}
              variant="contained"
              fullWidth
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: colors.blue,
                color: colors.white,
                '&:hover': {
                  backgroundColor: '#0099CC',
                },
                fontWeight: 600,
                py: 1.5,
              }}
            >
              + New Product
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default MainHeader
