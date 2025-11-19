// src/hooks/useRobotDetail.ts
import { useRobot } from '@/contexts/RobotContext';
import { ChartData } from '@/types/components';
import { useMemo, useState } from 'react';

export const useRobotDetail = (robotId: number) => {
  const { 
    selectedRobot, 
    robotData, 
    loading, 
    error,
    autoRefresh,
    setAutoRefresh,
    refreshData 
  } = useRobot();
  
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const chartData: ChartData[] = useMemo(() => {
    return robotData.map(data => ({
      timestamp: new Date(data.timestamp).toLocaleTimeString(),
      temperature: data.temperature,
      vibration: data.vibration,
      power_consumption: data.power_consumption,
      efficiency: data.efficiency,
      units_produced: data.units_produced,
      error_code: data.error_code,
    })).slice(-30);
  }, [robotData]);

  const handleManualRefresh = async () => {
    await refreshData();
    setLastRefresh(new Date());
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const hasChartData = chartData.length > 0;
  const hasErrors = robotData.some(data => data.error_code);

  return {
    selectedRobot,
    chartData,
    loading,
    error,
    autoRefresh,
    lastRefresh,
    hasChartData,
    hasErrors,
    handleManualRefresh,
    toggleAutoRefresh,
  };
};