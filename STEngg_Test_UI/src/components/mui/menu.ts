import { Components, Theme } from '@mui/material'

export const muiMenuTheme = (): Pick<
  Components<Omit<Theme, 'components'>>,
  'MuiMenu'
> => ({
  MuiMenu: {
    defaultProps: {
      disableScrollLock: true,
    },
  },
})
