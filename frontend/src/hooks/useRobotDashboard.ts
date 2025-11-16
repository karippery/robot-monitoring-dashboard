import { useRobot } from '@/contexts/RobotContext';
import { useCallback } from 'react';

/**
 * Custom hook for RobotDashboard component business logic
 */
export const useRobotDashboard = () => {
  const { robots, robotsLoading, error, connected } = useRobot();

  /**
   * Handles robot card click events with logging
   */
  const handleRobotClick = useCallback((robotId: number, onRobotClick?: (robotId: number) => void) => {
    if (onRobotClick) {
      onRobotClick(robotId);
    }
  }, []);

  return {
    robots,
    robotsLoading,
    error,
    connected,
    handleRobotClick,
  };
};