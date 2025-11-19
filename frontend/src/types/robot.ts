// src/types/robot.ts
export type RobotStatus = 'online' | 'offline' | 'maintenance' | 'error';
export type RobotType = 'welding' | 'assembly' | 'painting' | 'packaging' | 'inspection';

export interface RobotData {
  id: number;
  robot: number;
  timestamp: string;
  temperature: number;
  vibration: number;
  power_consumption: number;
  efficiency: number;
  units_produced: number;
  operational_hours: number;
  error_code?: string;
  error_message?: string;
}

export interface Robot {
  id: number;
  name: string;
  robot_type: RobotType;
  status: RobotStatus;
  location: string;
  ip_address?: string;
  last_maintenance: string;
  total_operational_hours: number;
  total_units_produced: number;
  created_at: string;
  updated_at: string;
  latest_data?: RobotData;
}

// Simplified WebSocket Message Types
export type WebSocketMessage = 
  | { type: 'initial_data'; robots: Robot[] }
  | { type: 'robot_update'; robot: Robot }
  | { type: 'robot_update'; robots: Robot[]; timestamp: string; total_robots: number }
  | { type: 'data_update'; data: RobotData }
  | { type: 'status_change'; robot_id: number; status: RobotStatus };