import '@mui/material/styles';
import type { CustomThemeExtensions, IndustrialColors } from './types';

declare module '@mui/material/styles' {
  interface Theme {
    custom: CustomThemeExtensions;
  }

  interface ThemeOptions {
    custom?: Partial<CustomThemeExtensions>;
  }

  interface Palette {
    customColors: IndustrialColors;
  }

  interface PaletteOptions {
    customColors?: Partial<IndustrialColors>;
  }
}