import { muiButtonTheme } from '@/components/mui/button'
import { muiChipTheme } from '@/components/mui/chip'
import { muiContainerTheme } from '@/components/mui/container'
import { muiDialogTheme } from '@/components/mui/dialog'
import { muiInputTheme } from '@/components/mui/input'
import { muiMenuTheme } from '@/components/mui/menu'
import { muiTooltipTheme } from '@/components/mui/tooltip'
import { Components, Theme } from '@mui/material'

export const getThemeComponents = (
  theme: Theme
): Components<Omit<Theme, 'components'>> => ({
  ...muiButtonTheme(theme),
  ...muiChipTheme(theme),
  ...muiContainerTheme(theme),
  ...muiInputTheme(),
  ...muiTooltipTheme(theme),
  ...muiMenuTheme(),
  ...muiDialogTheme(theme),
})
