import { GlobalStylesProps } from '@mui/material'

type GlobalStyles = GlobalStylesProps['styles']

export function getGlobalStyles(): GlobalStyles {
  const globalLayout: GlobalStyles = {
    'html, body, #root': {
      height: '100%',
      width: '100%',
      display: 'flex',
    },
    html: {
      overflowX: 'hidden',
    },
    '::-webkit-scrollbar': {
      display: 'none',
    },
    '*': {
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    },
  }

  return globalLayout
}
