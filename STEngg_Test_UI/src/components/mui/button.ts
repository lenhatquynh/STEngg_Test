import { alpha, Components, Theme } from '@mui/material'

export const muiButtonTheme = (
  theme: Theme
): Pick<Components<Omit<Theme, 'components'>>, 'MuiButton'> => ({
  MuiButton: {
    styleOverrides: {
      root: () => ({
        padding: '10px 20px',
        borderRadius: '10px',
        color: theme.palette.common.white,
        textTransform: 'unset',
      }),
    },
    variants: [
      {
        props: { size: 'large' },
        style: () => ({
          height: '48px',
        }),
      },
      {
        props: { variant: 'contained', color: 'primary' },
        style: () => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.common.white,
          '&:hover': {
            backgroundColor: '#8b0000',
          },
        }),
      },
      {
        props: { variant: 'outlined' },
        style: () => ({
          borderWidth: '2px',
          borderColor: '#000000',
          color: '#000000',
          '&:hover': {
            backgroundColor: alpha('#d3d3d3', 0.3),
          },
        }),
      },
      {
        props: { variant: 'tonal', color: 'primary' },
        style: () => ({
          color: theme.palette.primary.main,
          backgroundColor: alpha(theme.palette.primary.main, 0.16),
          '&:hover, &:active': {
            backgroundColor: alpha(theme.palette.primary.main, 0.24),
          },
        }),
      },
      {
        props: { variant: 'text' },
        style: () => ({
          backgroundColor: 'transparent',
        }),
      },
    ],
    defaultProps: {
      variant: 'contained',
      size: 'large',
    },
  },
})
