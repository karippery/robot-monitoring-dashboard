// frontend\src\components\RobotDashboard.tsx
import { useRobotDashboard } from '@/hooks/useRobotDashboard';
import { industrialTheme } from '@/theme';
import { RobotStatus } from '@/types/robot';
import {
  Build,
  Error as ErrorIcon,
  OfflineBolt,
  OnlinePrediction,
} from '@mui/icons-material';
import {
  Alert,
  alpha,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';

import { DashboardHeader } from './common/DashboardHeader';
import { EmptyState } from './common/EmptyState';
import { LoadingSpinner } from './common/LoadingSpinner';

interface RobotDashboardProps {
  onRobotClick?: (robotId: number) => void;
}

// 1. Define the allowed Chip colours
type ChipColor = 'default' | 'success' | 'warning' | 'error';

// 2. Base shape (icon & custom colour are still flexible)
interface StatusItem {
  color: ChipColor;
  icon: React.ReactElement;
  customColor: string;
}

// 3. Default fallback (still a const)
const defaultStatus: StatusItem = {
  color: 'default',
  icon: <OfflineBolt />,
  customColor: '#757575',
};

// 4. The config – now typed correctly
const statusConfig: Record<RobotStatus, StatusItem> = {
  online: {
    color: 'success',
    icon: <OnlinePrediction />,
    customColor: industrialTheme.palette.customColors.status.online,
  },
  offline: {
    color: 'default',
    icon: <OfflineBolt />,
    customColor: industrialTheme.palette.customColors.status.offline,
  },
  maintenance: {
    color: 'warning',
    icon: <Build />,
    customColor: industrialTheme.palette.customColors.status.maintenance,
  },
  error: {
    color: 'error',
    icon: <ErrorIcon />,
    customColor: industrialTheme.palette.customColors.status.error,
  },
};

/* ---------- Main component ---------- */
const RobotDashboard: React.FC<RobotDashboardProps> = ({ onRobotClick }) => {
  // Use the custom hook instead of directly using useRobot
  const { 
    robots, 
    robotsLoading, 
    error, 
    connected, 
    handleRobotClick 
  } = useRobotDashboard();

  /* ---------- Loading ---------- */
  if (robotsLoading) {
    return <LoadingSpinner message="Loading robots..." size={60} />;
  }

  /* ---------- Global error ---------- */
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          mb: 3,
          animation: industrialTheme.custom?.animations.fadeIn,
        }}
      >
        {error}
      </Alert>
    );
  }

  return (
    <Box className="fade-in">
      {/* ---- Reusable header ---- */}
      <DashboardHeader connected={connected} />

      {/* ---- Robots grid (with safe check) ---- */}
      <Grid container spacing={3}>
        {Array.isArray(robots) &&
          robots.map((robot) => {
            const cfg = statusConfig[robot.status] || defaultStatus;
            const data = robot.latest_data;

            return (
              <Grid key={robot.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card
                  onClick={() => handleRobotClick(robot.id, onRobotClick)}
                  sx={{
                    height: '100%',
                    animation: industrialTheme.custom?.animations.fadeIn,
                    border: `2px solid ${alpha(cfg.customColor, 0.2)}`,
                    background: `linear-gradient(135deg, ${industrialTheme.palette.background.paper} 0%, ${alpha(
                      cfg.customColor,
                      0.05
                    )} 100%)`,
                    '&:hover': {
                      borderColor: alpha(cfg.customColor, 0.4),
                      transform: onRobotClick ? 'translateY(-4px)' : 'none',
                      cursor: onRobotClick ? 'pointer' : 'default',
                      boxShadow: onRobotClick ? 4 : 1,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                  className="slide-in"
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* ---- Header ---- */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      mb={3}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          component="h2"
                          color="text.primary"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {robot.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: '0.875rem' }}
                        >
                          {robot.robot_type} • {robot.location}
                        </Typography>

                        {data && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: '0.7rem', mt: 0.5, display: 'block' }}
                          >
                            Updated: {new Date(data.timestamp).toLocaleTimeString()}
                          </Typography>
                        )}
                      </Box>

                      <Chip
                        icon={cfg.icon}
                        label={robot.status.toUpperCase()}
                        color={cfg.color}
                        variant="filled"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: cfg.customColor,
                          color: 'white',
                          '& .MuiChip-icon': {
                            color: 'white !important',
                          },
                        }}
                      />
                    </Box>

                    {/* ---- Sensor metrics (only when data exists) ---- */}
                    {data && (
                      <Grid container spacing={2} mb={2}>
                        {/* Temperature */}
                        <Grid size={6}>
                          <Box textAlign="center">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              Temperature
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color={industrialTheme.palette.customColors.metrics.temperature}
                            >
                              {data.temperature}°C
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Vibration */}
                        <Grid size={6}>
                          <Box textAlign="center">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              Vibration
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color={industrialTheme.palette.customColors.metrics.vibration}
                            >
                              {data.vibration} mm/s
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Power */}
                        <Grid size={6}>
                          <Box textAlign="center">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              Power
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color={industrialTheme.palette.customColors.metrics.power}
                            >
                              {data.power_consumption} kW
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Efficiency */}
                        <Grid size={6}>
                          <Box textAlign="center">
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                              sx={{ fontWeight: 500, mb: 0.5 }}
                            >
                              Efficiency
                            </Typography>
                            <Typography
                              variant="h6"
                              fontWeight="600"
                              color={
                                data.efficiency > 80
                                  ? industrialTheme.palette.customColors.status.online
                                  : data.efficiency > 60
                                  ? industrialTheme.palette.customColors.status.warning
                                  : industrialTheme.palette.customColors.status.error
                              }
                            >
                              {data.efficiency}%
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    )}

                    {/* ---- Footer stats ---- */}
                    <Box
                      mt={2}
                      pt={2}
                      borderTop={1}
                      borderColor="divider"
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box textAlign="center">
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Total Units
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="600"
                          color={industrialTheme.palette.customColors.metrics.production}
                        >
                          {robot.total_units_produced.toLocaleString()}
                        </Typography>
                      </Box>

                      <Box textAlign="center">
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Hours
                        </Typography>
                        <Typography variant="body2" fontWeight="600">
                          {robot.total_operational_hours.toFixed(1)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>

      {/* ---- Empty state (no robots) ---- */}
      {(!Array.isArray(robots) || robots.length === 0) && <EmptyState />}
    </Box>
  );
};

export default RobotDashboard;