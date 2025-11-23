'use client'

// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import { CssBaseline, GlobalStyles, Stack, ThemeProvider } from '@mui/material'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

// ** TanStack Query Imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// ** Toast Imports
import { Toaster } from 'react-hot-toast'

// ** Theme Imports
import { getGlobalStyles } from '@/themes/core/globalStyles'
import { lightTheme } from '@/themes/light'

interface ClientProvidersProps {
  children: React.ReactNode
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <AppRouterCacheProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          <GlobalStyles styles={() => getGlobalStyles()} />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Stack sx={{ width: '100%' }}>{children}</Stack>
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </QueryClientProvider>
    </AppRouterCacheProvider>
  )
}

export default ClientProviders
