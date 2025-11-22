import { alpha, PaletteOptions } from '@mui/material'

export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#ED1C24',
    light: alpha('#F26649', 0.15),
    contrastText: '#000000',
  },
  secondary: {
    main: '#00AEEF',
    light: '#DCF6FF',
    contrastText: '#000000',
  },
  tertiary: {
    main: '#9E63FE',
    light: '#ECE0FF',
    contrastText: '#000000',
  },
  text: {
    primary: '#000000',
    secondary: '#181E2E',
    disabled: alpha('#000000', 0.15),
  },
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
  grey: {
    '50': '#D8DFE3',
    '100': '#9EB0BA',
    '200': '#7C8D97',
  },
}
