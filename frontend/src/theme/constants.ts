// Color palette for industrial dashboard
export const INDUSTRIAL_COLORS = {
  // Primary colors
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
  },
  // Status colors
  status: {
    online: '#4caf50',
    offline: '#9e9e9e',
    maintenance: '#ff9800',
    error: '#f44336',
    warning: '#ffc107',
  },
  // Sensor metrics
  metrics: {
    temperature: '#ff6b6b',
    vibration: '#4ecdc4',
    power: '#45b7d1',
    efficiency: '#96ceb4',
    production: '#feca57',
  },
  // Background colors
  background: {
    default: '#f8f9fa',
    paper: '#ffffff',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  // Text colors
  text: {
    primary: '#2c3e50',
    secondary: '#546e7a',
    disabled: '#bdc3c7',
  },
} as const;

// Typography scale
export const TYPOGRAPHY = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.5,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '0.75rem',
    lineHeight: 1.5,
  },
  overline: {
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: 1.5,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
} as const;

// Custom theme constants
export const CUSTOM_THEME = {
  shadows: {
    card: '0 4px 20px 0 rgba(0, 0, 0, 0.1)',
    cardHover: '0 8px 30px 0 rgba(0, 0, 0, 0.15)',
    header: '0 2px 10px 0 rgba(0, 0, 0, 0.08)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    error: 'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)',
  },
  animations: {
    fadeIn: 'fadeIn 0.5s ease-in-out',
    slideIn: 'slideIn 0.3s ease-out',
    pulse: 'pulse 2s infinite',
  },
} as const;