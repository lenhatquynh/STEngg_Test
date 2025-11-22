'use client'

// ** MUI Imports
import { darken, IconButton, Link, Stack, Typography } from '@mui/material'

// ** Third Party Imports
import { Icon } from '@iconify/react'

// ** Constant Imports
import { ROUTES } from '@/constants/routes'
import { colors } from '@/constants/color'

// ** Custom Component Imports
import CustomImage from './CustomImage'

const MainFooter = () => {
  return (
    <Stack
      component="footer"
      alignItems="center"
      spacing={6}
      width="100%"
      position="relative"
      sx={{
        backgroundColor: colors.darkBlue,
        color: colors.white,
        py: 12,
      }}
    >
      <Link href={ROUTES.ROOT} title="Snowkiting in Norway">
        <CustomImage
          src=""
          alt="Logo"
          width={87}
          height={80}
          style={{ cursor: 'pointer' }}
        />
      </Link>

      <Typography variant="body1" sx={{ fontSize: '24px', fontWeight: 600 }}>
        sample@sample.com
      </Typography>

      <Typography variant="body1" sx={{ fontSize: '24px', fontWeight: 600 }}>
        +84 123 456 789
      </Typography>

      <Stack alignItems="center" spacing={3}>
        <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 400 }}>
          Connect with us:
        </Typography>
      </Stack>

      <Stack alignItems="center">
        <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 400 }}>
          Copyright &copy; 2025 Test
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 400 }}>
          All rights reserved.
        </Typography>
      </Stack>

      <IconButton
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }}
        sx={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          backgroundColor: colors.red,
          '&:hover': {
            backgroundColor: darken(colors.red, 0.1),
          },
        }}
      >
        <Icon icon="iconamoon:arrow-up-2-light" color={colors.white} />
      </IconButton>
    </Stack>
  )
}

export default MainFooter
