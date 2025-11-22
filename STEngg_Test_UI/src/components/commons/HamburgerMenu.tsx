'use client'

// ** Next & React Imports
import { useRouter } from 'next/navigation'
import { useState } from 'react'

// ** Constant Imports
import { colors } from '@/constants/color'
import { ROUTES } from '@/constants/routes'

// ** Third Party Imports
import { Icon } from '@iconify/react'

// ** MUI Imports
import {
  Backdrop,
  Button,
  Fade,
  Grow,
  IconButton,
  Modal,
  Stack,
} from '@mui/material'

// ** Custom Component Imports
import CustomImage from './CustomImage'

const navItems = [
  {
    label: 'Home',
    href: ROUTES.ROOT,
  },
]

const HamburgerMenu = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const toggle = () => setOpen(prev => !prev)

  const handleNavigate = (href: string) => {
    router.push(href)
    setOpen(false)
  }

  return (
    <>
      <IconButton onClick={toggle}>
        <Icon
          icon="solar:hamburger-menu-outline"
          fontSize={40}
          color={colors.black}
        />
      </IconButton>
      <Modal
        open={open}
        onClose={toggle}
        closeAfterTransition
        disableScrollLock
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 250 } }}
      >
        <Fade in={open} timeout={250}>
          <Stack
            sx={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: colors.darkBlue,
              overflowY: 'auto',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              px={[3, 6]}
              py={3}
            >
              <CustomImage
                src=""
                alt="Logo"
                width={68}
                height={63}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  router.push(ROUTES.ROOT)
                  setOpen(false)
                }}
              />
              <IconButton onClick={toggle}>
                <Icon
                  icon="material-symbols:close-rounded"
                  color={colors.red}
                  fontSize={40}
                />
              </IconButton>
            </Stack>
            <Stack
              width="100%"
              flex={1}
              justifyContent="center"
              alignItems="center"
              spacing={6}
            >
              {navItems.map((item, i) => (
                <Grow in={open} timeout={500 + i * 100} key={item.href}>
                  <Button
                    key={item.href}
                    variant="text"
                    onClick={() => handleNavigate(item.href)}
                    sx={{
                      padding: '0 !important',
                      height: 'fit-content',
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={6}
                      sx={{
                        fontSize: '40px',
                        fontWeight: '600',
                        lineHeight: '40px',
                        color: colors.white,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.label}
                    </Stack>
                  </Button>
                </Grow>
              ))}
            </Stack>
          </Stack>
        </Fade>
      </Modal>
    </>
  )
}

export default HamburgerMenu
