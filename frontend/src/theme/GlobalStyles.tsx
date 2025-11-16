import { GlobalStyles as MuiGlobalStyles, useTheme } from '@mui/material';

/**
 * Global styles component that provides consistent styling across the application
 */
export const GlobalStyles = (): React.JSX.Element => {
  const theme = useTheme();

  return (
    <MuiGlobalStyles
      styles={{
        // Font imports
        '@font-face': {
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontDisplay: 'swap',
          fontWeight: 400,
          src: `local('Inter'), local('Inter-Regular'), url(https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap) format('woff2')`,
        },

        // Animation keyframes
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translateY(10px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },

        '@keyframes slideIn': {
          from: {
            opacity: 0,
            transform: 'translateX(-20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateX(0)',
          },
        },

        '@keyframes pulse': {
          '0%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.5,
          },
          '100%': {
            opacity: 1,
          },
        },

        // Utility classes
        '.fade-in': {
          animation: 'fadeIn 0.5s ease-in-out',
        },

        '.slide-in': {
          animation: 'slideIn 0.3s ease-out',
        },

        '.pulse': {
          animation: 'pulse 2s infinite',
        },

        // Custom scrollbar
        '::-webkit-scrollbar': {
          width: 8,
        },

        '::-webkit-scrollbar-track': {
          background: theme.palette.background.default,
        },

        '::-webkit-scrollbar-thumb': {
          background: theme.palette.primary.light,
          borderRadius: 4,
        },

        '::-webkit-scrollbar-thumb:hover': {
          background: theme.palette.primary.main,
        },

        // Selection styles
        '::selection': {
          backgroundColor: theme.palette.primary.light,
          color: 'white',
        },

        // Focus styles for accessibility
        '*:focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },

        // Smooth transitions for all interactive elements
        'a, button, input, select, textarea': {
          transition: 'all 0.2s ease-in-out',
        },
      }}
    />
  );
};