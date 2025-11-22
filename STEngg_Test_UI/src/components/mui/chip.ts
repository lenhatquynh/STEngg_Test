import { Components, Theme } from '@mui/material'

export const muiChipTheme = (
  theme: Theme
): Pick<Components<Omit<Theme, 'components'>>, 'MuiChip'> => ({
  MuiChip: {
    variants: [
      {
        props: { size: 'medium' },
        style: () => ({
          height: '40px',
          minWidth: 120,
          borderRadius: (theme.shape.borderRadius as number) * 4,
        }),
      },
      {
        props: { color: 'secondary' },
        style: () => ({
          backgroundColor: theme.palette.common.white,
          color: theme.palette.common.black,
        }),
      },
    ],
    defaultProps: {
      variant: 'filled',
      size: 'medium',
    },
  },
})
