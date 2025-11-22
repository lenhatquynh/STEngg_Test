'use client'

// ** Next & React Imports
import Link from 'next/link'
import { useEffect, useState } from 'react'

// ** Constant Imports
import { colors } from '@/constants/color'
import { ROUTES } from '@/constants/routes'

// ** MUI Imports
import { AppBar, Button, Stack, Toolbar } from '@mui/material'

// ** Custom Component Imports
import CustomImage from './CustomImage'
import HamburgerMenu from './HamburgerMenu'

const MainHeader = () => {
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop
      setIsAtTop(scrollTop <= 20)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: '100%',
        height: '100px',
        maxWidth: '100vw',
        mx: 'auto',
        px: [3, 6],
        backgroundColor: isAtTop ? 'transparent' : colors.white,
        transition: 'all 0.3s ease-in-out',
        top: 0,
        left: 0,
        right: 'auto',
        zIndex: 1000,
        boxShadow: isAtTop ? 'none' : '0px 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
          px: '0 !important',
        }}
      >
        <Link href={ROUTES.ROOT} title="Snowkiting in Norway">
          <CustomImage
            priority
            src=""
            alt="Logo"
            width={68}
            height={63}
            style={{ cursor: 'pointer' }}
          />
        </Link>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Stack
            display={['none', 'flex']}
            direction="row"
            alignItems="center"
            spacing={3}
          >
            <Button
              onClick={() => {}}
              variant="outlined"
              sx={{
                width: 'max-content',
                height: '40px',
                color: colors.black,
                borderColor: colors.black,
                fontSize: '16px',
                fontWeight: 'bold',
                lineHeight: '16px',
              }}
            >
              Ask us
            </Button>
          </Stack>
          <HamburgerMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default MainHeader
