// frontend/src/components/RobotDetail.tsx
import { useRobot } from '@/contexts/RobotContext';
import { industrialTheme } from '@/theme';
import { ArrowBack, Pause, PlayArrow, Refresh } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface RobotDetailProps {
  robotId: number;
  onBack?: () => void;
}

interface ChartData {
  timestamp: string;
  temperature: number;
  vibration: number;
  power_consumption: number;
  efficiency: number;
  units_produced: number;
  error_code?: string | null;
}

const RobotDetail: React.FC<RobotDetailProps> = ({ robotId, onBack }) => {
  const { 
    selectedRobot, 
    robotData, 
    selectRobot, 
    refreshData, 
    loading,  // Changed from detailLoading to loading
    error,
    autoRefresh,
    setAutoRefresh 
  } = useRobot();
  
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load robot data only once when component mounts
  useEffect(() => {
    selectRobot(robotId); // Changed from fetchRobot to selectRobot
  }, [robotId, selectRobot]);

  // Use useMemo to optimize chart data preparation and prevent unnecessary re-renders
  const chartData: ChartData[] = useMemo(() => {
    return robotData
      .filter(d => d.robot === robotId)
      .map(d => ({
        timestamp: new Date(d.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        temperature: d.temperature,
        vibration: d.vibration,
        power_consumption: d.power_consumption,
        efficiency: d.efficiency,
        units_produced: d.units_produced,
        error_code: d.error_code,
      }))
      .slice(-30); // Show last 30 points
  }, [robotData, robotId]);

  const handleManualRefresh = () => {
    refreshData(); // Changed from fetchRobot + fetchRobotHistory to refreshData
    setLastRefresh(new Date());
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  // Use loading instead of detailLoading
  if (loading && !selectedRobot) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress 
          size={60} 
          sx={{ color: industrialTheme.palette.customColors.metrics.power }} 
        />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading robot details...
        </Typography>
      </Box>
    );
  }

  if (!selectedRobot) {
    return (
      <Alert 
        severity="warning" 
        sx={{ 
          animation: industrialTheme.custom?.animations.fadeIn,
          mb: 2
        }}
        action={
          <Button color="inherit" size="small" onClick={() => onBack?.()}>
            Back to Dashboard
          </Button>
        }
      >
        Robot not found. The robot may have been removed or is temporarily unavailable.
      </Alert>
    );
  }

  const statusConfig: Record<string, string> = {
    online: industrialTheme.palette.customColors.status.online,
    offline: industrialTheme.palette.customColors.status.offline,
    maintenance: industrialTheme.palette.customColors.status.maintenance,
    error: industrialTheme.palette.customColors.status.error,
  };

  const hasChartData = chartData.length > 0;
  const hasErrors = robotData.some(data => data.error_code);

  return (
    <Box className="fade-in">
      {/* Header with Controls */}
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        {onBack && (
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
            }}
          >
            Back to Dashboard
          </Button>
        )}
        
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, flex: 1 }}>
          {selectedRobot.name}
        </Typography>

        {/* Refresh Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="WebSocket Live Data">
            <Chip
              label="Live Data"
              color="success"
              variant="filled"
              size="small"
            />
          </Tooltip>
          
          {/* Auto Refresh Toggle */}
          <Tooltip title={`Auto-refresh historical data every 5 seconds - ${autoRefresh ? 'ON' : 'OFF'}`}>
            <IconButton 
              onClick={toggleAutoRefresh}
              sx={{
                color: autoRefresh 
                  ? industrialTheme.palette.success.main 
                  : industrialTheme.palette.text.secondary,
                backgroundColor: autoRefresh 
                  ? industrialTheme.palette.success.light + '20' 
                  : 'transparent',
              }}
            >
              {autoRefresh ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
          
          {/* Manual Refresh */}
          <Tooltip title="Refresh historical data now">
            <IconButton 
              onClick={handleManualRefresh} 
              disabled={loading} // Changed from detailLoading to loading
              sx={{
                color: industrialTheme.palette.primary.main,
                animation: loading ? 'spin 1s linear infinite' : 'none', // Changed from detailLoading to loading
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <Chip
          label={selectedRobot.status.toUpperCase()}
          sx={{
            backgroundColor: statusConfig[selectedRobot.status] || industrialTheme.palette.customColors.status.offline,
            color: 'white',
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        />
      </Box>

      {/* Last refresh time and status */}
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {autoRefresh ? (
          <>
            <strong>Auto-refresh ON</strong> • Live data streaming • Historical data refreshing every 5 seconds
          </>
        ) : (
          'Live data streaming • Auto-refresh OFF'
        )}
        <br />
        Last manual refresh: {lastRefresh.toLocaleTimeString()} 
        {loading && ' • Refreshing...'} {/* Changed from detailLoading to loading */}
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Warning Alert for Errors in Data */}
      {hasErrors && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Some robots are experiencing errors. Check the detailed view for more information.
        </Alert>
      )}

      {/* Rest of your component remains the same */}
      <Grid container spacing={3}>
        {/* Robot Information Card */}
        <Grid size={12}>
          <Card 
            sx={{ 
              background: industrialTheme.custom?.gradients?.primary,
              color: 'white',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Robot Details
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    <strong>Type:</strong> {selectedRobot.robot_type}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    <strong>Location:</strong> {selectedRobot.location}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    <strong>IP Address:</strong> {selectedRobot.ip_address || 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                    Operational Stats
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    <strong>Total Units Produced:</strong> {selectedRobot.total_units_produced.toLocaleString()}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                    <strong>Total Operational Hours:</strong> {selectedRobot.total_operational_hours.toFixed(1)}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    <strong>Last Maintenance:</strong> {new Date(selectedRobot.last_maintenance).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts Section */}
        {hasChartData ? (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Temperature & Vibration
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={industrialTheme.palette.divider} />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fill: industrialTheme.palette.text.secondary }}
                      />
                      <YAxis tick={{ fill: industrialTheme.palette.text.secondary }} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 8,
                          border: `1px solid ${industrialTheme.palette.divider}`,
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke={industrialTheme.palette.customColors.metrics.temperature}
                        strokeWidth={2}
                        name="Temperature (°C)" 
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="vibration" 
                        stroke={industrialTheme.palette.customColors.metrics.vibration}
                        strokeWidth={2}
                        name="Vibration (mm/s)" 
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Power Consumption & Efficiency
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={industrialTheme.palette.divider} />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fill: industrialTheme.palette.text.secondary }}
                      />
                      <YAxis tick={{ fill: industrialTheme.palette.text.secondary }} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 8,
                          border: `1px solid ${industrialTheme.palette.divider}`,
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="power_consumption" 
                        stroke={industrialTheme.palette.customColors.metrics.power}
                        strokeWidth={2}
                        name="Power (kW)" 
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke={industrialTheme.palette.customColors.metrics.efficiency}
                        strokeWidth={2}
                        name="Efficiency (%)" 
                        dot={false}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Production Units
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={industrialTheme.palette.divider} />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fill: industrialTheme.palette.text.secondary }}
                      />
                      <YAxis tick={{ fill: industrialTheme.palette.text.secondary }} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          borderRadius: 8,
                          border: `1px solid ${industrialTheme.palette.divider}`,
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="units_produced" 
                        fill={industrialTheme.palette.customColors.metrics.production}
                        name="Units Produced" 
                        radius={[4, 4, 0, 0]}
                        isAnimationActive={true}
                        animationDuration={500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </>
        ) : (
          <Grid size={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Historical Data Available
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {robotData.length === 0 
                    ? "No sensor data has been recorded for this robot yet. Waiting for live data..."
                    : "No valid sensor data available for display."
                  }
                </Typography>
                <Button 
                  variant="outlined" 
                  onClick={handleManualRefresh}
                  disabled={loading} // Changed from detailLoading to loading
                >
                  {loading ? 'Refreshing...' : 'Load Historical Data'} {/* Changed from detailLoading to loading */}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default RobotDetail;