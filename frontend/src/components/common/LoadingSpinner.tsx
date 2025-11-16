// src/components/common/LoadingSpinner.tsx
import { industrialTheme } from '@/theme';
import { Box, CircularProgress, Typography } from '@mui/material';
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 60 
}) => {
  // Fallback color if theme is not loaded
  const spinnerColor = industrialTheme?.palette?.customColors?.metrics?.power || '#2196f3';

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="400px"
    >
      <CircularProgress 
        size={size} 
        sx={{ color: spinnerColor }} 
      />
      <Typography variant="body1" sx={{ ml: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};