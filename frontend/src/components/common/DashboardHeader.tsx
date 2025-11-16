import { Box, Chip, Typography } from '@mui/material';
import React from 'react';

interface DashboardHeaderProps {
  connected: boolean;
}

/**
 * Dashboard header component with title and connection status
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ connected }) => (
  <Box 
    display="flex" 
    justifyContent="space-between" 
    alignItems="center" 
    mb={4}
  >
    <Typography 
      variant="h2" 
      component="h1"
      color="text.primary"
      sx={{ fontWeight: 700 }}
    >
      Robot Monitoring Dashboard
    </Typography>
    <Chip
      label={connected ? 'Connected' : 'Disconnected'}
      color={connected ? 'success' : 'error'}
      variant="filled"
      sx={{
        fontWeight: 600,
        fontSize: '0.875rem',
      }}
    />
  </Box>
);