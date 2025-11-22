'use client'

// ** MUI Imports
import { CssBaseline, GlobalStyles, Stack, ThemeProvider } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

// ** Theme Imports
import { getGlobalStyles } from '@/themes/core/globalStyles'
import { lightTheme } from '@/themes/light'

interface ClientProvidersProps {
  children: React.ReactNode
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <GlobalStyles styles={() => getGlobalStyles()} />
        <Stack sx={{ width: '100%' }}>{children}</Stack>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}

export default ClientProviders
