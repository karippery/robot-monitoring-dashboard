// src/contexts/RobotContext.tsx
import { robotAPI } from '@/services/api';
import { websocketService } from '@/services/websocket';
import { Robot, RobotData, WebSocketMessage } from '@/types/robot';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RobotContextType {
  robots: Robot[];
  selectedRobot: Robot | null;
  robotData: RobotData[];
  loading: boolean;
  error: string | null;
  connected: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  selectRobot: (id: number | null) => Promise<void>;
  refreshData: () => Promise<void>;
}

const RobotContext = createContext<RobotContextType>({} as RobotContextType);

export const useRobot = () => useContext(RobotContext);

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [robotData, setRobotData] = useState<RobotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Single function to load all data
  const loadData = useCallback(async (robotId?: number) => {
    try {
      setError(null);
      
      if (!robotId) {
        // Load robot list
        const robotsData = await robotAPI.getRobots();
        setRobots(robotsData);
      }
      
      if (robotId) {
        // Load specific robot and its history
        const [robot, history] = await Promise.all([
          robotAPI.getRobot(robotId),
          robotAPI.getRobotHistory(robotId, 24)
        ]);
        
        setSelectedRobot(robot);
        setRobotData(history);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const selectRobot = useCallback(async (id: number | null) => {
    if (id === null) {
      setSelectedRobot(null);
      setRobotData([]);
      return;
    }
    
    setLoading(true);
    await loadData(id);
  }, [loadData]);

  const refreshData = useCallback(async () => {
    await loadData(selectedRobot?.id);
  }, [selectedRobot?.id, loadData]);

  // WebSocket message handler - simplified
  const handleWebSocketMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'initial_data':
        if (Array.isArray(message.robots)) {
          setRobots(message.robots);
          setLoading(false);
        }
        break;

      case 'robot_update':
        // Handle both message structures
        if ('robots' in message && Array.isArray(message.robots)) {
          setRobots(message.robots);
        } else if ('robot' in message) {
          const updatedRobot = message.robot;
          setRobots(prev => prev.map(r => r.id === updatedRobot.id ? updatedRobot : r));
          if (selectedRobot?.id === updatedRobot.id) {
            setSelectedRobot(updatedRobot);
          }
        }
        break;

      case 'data_update':
        const newData = message.data;
        if (!selectedRobot || newData.robot !== selectedRobot.id) return;
        
        setRobotData(prev => {
          const filtered = prev.filter(d => d.timestamp !== newData.timestamp);
          const updated = [...filtered, newData]
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .slice(-50);
          return updated;
        });
        break;

      case 'status_change':
        const { robot_id, status } = message;
        setRobots(prev => prev.map(r => 
          r.id === robot_id ? { ...r, status } : r
        ));
        if (selectedRobot?.id === robot_id) {
          setSelectedRobot(prev => prev ? { ...prev, status } : null);
        }
        break;
    }
  }, [selectedRobot]);

  // Single WebSocket effect
  useEffect(() => {
    // Initial load
    loadData();

    // WebSocket setup
    websocketService.connect();
    
    const unsubscribeMessages = websocketService.subscribeToMessages(handleWebSocketMessage);
    const unsubscribeConnection = websocketService.subscribeToConnection(setConnected);

    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      // Don't disconnect WebSocket here - let it manage reconnection
    };
  }, [loadData, handleWebSocketMessage]);

  // Clean auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !selectedRobot) return;

    const interval = setInterval(() => {
      refreshData();
    }, 5000); // Increased to 5s to reduce blinking

    return () => clearInterval(interval);
  }, [autoRefresh, selectedRobot, refreshData]);

  const contextValue: RobotContextType = {
    robots,
    selectedRobot,
    robotData,
    loading,
    error,
    connected,
    autoRefresh,
    setAutoRefresh,
    selectRobot,
    refreshData,
  };

  return (
    <RobotContext.Provider value={contextValue}>
      {children}
    </RobotContext.Provider>
  );
};