import { Components, Theme } from '@mui/material'

export const muiInputTheme = (): Pick<
  Components<Omit<Theme, 'components'>>,
  'MuiTextField'
> => ({
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
  },
})
