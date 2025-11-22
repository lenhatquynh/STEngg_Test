import { Components, Theme } from '@mui/material'

export const muiTooltipTheme = (
  theme: Theme
): Pick<Components<Omit<Theme, 'components'>>, 'MuiTooltip'> => ({
  MuiTooltip: {
    styleOverrides: {
      popper: {
        maxWidth: 'unset !important',
      },
      tooltip: {
        backgroundColor: theme.palette.common.black,
        borderRadius: theme.shape.borderRadius as number,
        maxWidth: '100%',
        padding: '16px',
        marginLeft: '16px',
        marginRight: '16px',
      },
      popperArrow: {
        color: theme.palette.common.black,
        '&:before': {
          border: `1px solid ${theme.palette.common.black}`,
        },
      },
      arrow: {
        color: theme.palette.common.black,
      },
    },
    defaultProps: {
      arrow: true,
      placement: 'bottom',
    },
  },
})
