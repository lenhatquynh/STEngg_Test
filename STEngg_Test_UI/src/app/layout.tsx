// ** React Imports
import { ReactNode } from 'react'

// ** MUI Imports
import { Stack } from '@mui/material'

// ** Custom Imports
import ClientProviders from '@/contexts/ClientProviders'

// ** Assets Imports
import { barlowSemiCondensedFont } from '@@/assets/fonts'
import MainFooter from '@/components/commons/MainFooter'
import MainHeader from '@/components/commons/MainHeader'

export interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={barlowSemiCondensedFont.className}>
        <ClientProviders>
          <MainHeader />
          <Stack component="main" flex={1} py={4}>
            {children}
          </Stack>
          <MainFooter />
        </ClientProviders>
      </body>
    </html>
  )
}
