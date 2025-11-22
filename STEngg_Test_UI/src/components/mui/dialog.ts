import { Components, Theme } from '@mui/material'

export const muiDialogTheme = (
  theme: Theme
): Pick<Components<Omit<Theme, 'components'>>, 'MuiDialog'> => ({
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: `${Number(theme.shape.borderRadius) * 2}px`,
      },
    },
  },
})
