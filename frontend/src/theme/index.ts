import { createTheme } from '@mui/material/styles';
import { CUSTOM_THEME, INDUSTRIAL_COLORS, TYPOGRAPHY } from './constants';
import type { IndustrialThemeOptions } from './types';

// Component overrides
const COMPONENTS: IndustrialThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        fontFeatureSettings: '"cv11", "ss01"',
        fontVariantNumeric: 'tabular-nums',
      },
      '#root': {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: CUSTOM_THEME.shadows.card,
        border: '1px solid rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: CUSTOM_THEME.shadows.cardHover,
          transform: 'translateY(-2px)',
        },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: '24px 24px 0',
      },
      title: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '24px',
        '&:last-child': {
          paddingBottom: '24px',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: 'none',
        fontWeight: 500,
        padding: '8px 16px',
        transition: 'all 0.2s ease-in-out',
      },
      contained: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontWeight: 500,
        fontSize: '0.75rem',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 4,
        height: 6,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 12,
      },
    },
  },
};

// Create the theme with proper palette structure
export const industrialTheme = createTheme({
  palette: {
    mode: 'light',
    primary: INDUSTRIAL_COLORS.primary,
    background: INDUSTRIAL_COLORS.background,
    text: INDUSTRIAL_COLORS.text,
    customColors: INDUSTRIAL_COLORS,
  },
  typography: TYPOGRAPHY,
  components: COMPONENTS,
  shape: {
    borderRadius: 8,
  },
  spacing: 8, // 8px base unit
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  custom: CUSTOM_THEME,
} as IndustrialThemeOptions);

// Export theme type for use in components
export type IndustrialTheme = typeof industrialTheme;