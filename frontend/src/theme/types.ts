import type { ThemeOptions } from '@mui/material/styles';

// Color palette types
export interface IndustrialColors {
  primary: {
    main: string;
    light: string;
    dark: string;
  };
  status: {
    online: string;
    offline: string;
    maintenance: string;
    error: string;
    warning: string;
  };
  metrics: {
    temperature: string;
    vibration: string;
    power: string;
    efficiency: string;
    production: string;
  };
  background: {
    default: string;
    paper: string;
    gradient: string;
  };
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

// Custom theme extensions
export interface CustomThemeExtensions {
  shadows: {
    card: string;
    cardHover: string;
    header: string;
  };
  gradients: {
    primary: string;
    success: string;
    warning: string;
    error: string;
  };
  animations: {
    fadeIn: string;
    slideIn: string;
    pulse: string;
  };
}

// Extended theme options
export interface IndustrialThemeOptions extends ThemeOptions {
  custom?: Partial<CustomThemeExtensions>;
  palette?: ThemeOptions['palette'] & {
    customColors?: Partial<IndustrialColors>;
  };
}