import { useRobot } from '@/contexts/RobotContext';
import { ChartData } from '@/types/components';
import { useCallback, useMemo, useState } from 'react';

/**
 * Custom hook for RobotDetail component business logic
 */
export const useRobotDetail = (robotId: number) => {
  const { 
    selectedRobot, 
    robotData, 
    fetchRobot, 
    fetchRobotHistory, 
    detailLoading, 
    error,
    autoRefresh,
    setAutoRefresh 
  } = useRobot();
  
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  /**
   * Prepares chart data from robot data with performance optimization
   */
  const chartData: ChartData[] = useMemo(() => {
    return robotData
      .filter(data => data.robot === robotId)
      .map(data => ({
        timestamp: new Date(data.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        temperature: data.temperature,
        vibration: data.vibration,
        power_consumption: data.power_consumption,
        efficiency: data.efficiency,
        units_produced: data.units_produced,
        error_code: data.error_code,
      }))
      .slice(-30); // Show last 30 data points for better performance
  }, [robotData, robotId]);

  /**
   * Handles manual refresh of robot data
   */
  const handleManualRefresh = useCallback(() => {
    fetchRobot(robotId);
    fetchRobotHistory(robotId, 24);
    setLastRefresh(new Date());
  }, [robotId, fetchRobot, fetchRobotHistory]);

  /**
   * Toggles auto-refresh functionality
   */
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefresh(!autoRefresh);
  }, [autoRefresh, setAutoRefresh]);

  const hasChartData = chartData.length > 0;
  const hasErrors = robotData.some(data => data.error_code);

  return {
    selectedRobot,
    chartData,
    detailLoading,
    error,
    autoRefresh,
    lastRefresh,
    hasChartData,
    hasErrors,
    handleManualRefresh,
    toggleAutoRefresh,
  };
};