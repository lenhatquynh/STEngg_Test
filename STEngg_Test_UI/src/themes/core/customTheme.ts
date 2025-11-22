import { PaletteColor, SimplePaletteColorOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: PaletteColor
  }

  interface PaletteOptions {
    tertiary: SimplePaletteColorOptions
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true
  }
}
