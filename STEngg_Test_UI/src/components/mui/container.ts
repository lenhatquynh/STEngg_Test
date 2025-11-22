import { Components, Theme } from '@mui/material'

export const muiContainerTheme = (
  theme: Theme
): Pick<Components<Omit<Theme, 'components'>>, 'MuiContainer'> => ({
  MuiContainer: {
    styleOverrides: {
      root: {
        maxWidth: '1300px !important',
        paddingLeft: '16px',
        paddingRight: '16px',
        [theme.breakpoints.up('lg')]: {
          paddingLeft: '0 !important',
          paddingRight: '0 !important',
        },
      },
    },
  },
})
