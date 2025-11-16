import { Box, Typography } from '@mui/material';
import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

/**
 * Empty state component for when no data is available
 */
export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No Robots Found", 
  message = "No robots are currently registered in the system." 
}) => (
  <Box 
    textAlign="center" 
    py={8}
    className="fade-in"
  >
    <Typography variant="h5" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      {message}
    </Typography>
  </Box>
);