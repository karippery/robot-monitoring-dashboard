import { Robot, RobotStatus } from './robot';

// Component Props Interfaces
export interface RobotDetailProps {
  robotId: number;
  onBack?: () => void;
}

export interface RobotDashboardProps {
  onRobotClick?: (robotId: number) => void;
}

export interface RobotCardProps {
  robot: Robot;
  onRobotClick?: (robotId: number) => void;
}

// Chart Data Interface
export interface ChartData {
  timestamp: string;
  temperature: number;
  vibration: number;
  power_consumption: number;
  efficiency: number;
  units_produced: number;
  error_code?: string | null;
}

// Status Configuration Interface
export interface StatusConfig {
  color: 'success' | 'default' | 'warning' | 'error';
  icon: React.ReactElement;
  customColor: string;
}

// Status Config Type
export type StatusConfigMap = Record<RobotStatus, StatusConfig>;

export interface MetricDisplayProps {
  label: string;
  value: string | number;
  color: string;
  unit?: string;
}