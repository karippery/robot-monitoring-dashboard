// frontend/src/contexts/RobotContext.tsx
import { robotAPI } from '@/services/api';
import { websocketService } from '@/services/websocket';
import { Robot, RobotData, WebSocketMessage } from '@/types/robot';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface RobotContextType {
  robots: Robot[];
  selectedRobot: Robot | null;
  robotData: RobotData[];
  robotsLoading: boolean;
  detailLoading: boolean;
  error: string | null;
  connected: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  fetchRobot: (id: number) => Promise<void>;
  fetchRobotHistory: (id: number, hours?: number) => Promise<void>;
  clearSelectedRobot: () => void;
  refetchRobots: () => Promise<void>;
}

const RobotContext = createContext<RobotContextType>({
  robots: [],
  selectedRobot: null,
  robotData: [],
  robotsLoading: true,
  detailLoading: false,
  error: null,
  connected: false,
  autoRefresh: true,
  setAutoRefresh: () => {},
  fetchRobot: async () => {},
  fetchRobotHistory: async () => {},
  clearSelectedRobot: () => {},
  refetchRobots: async () => {},
});

export const useRobot = () => useContext(RobotContext);

export const RobotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(null);
  const [robotData, setRobotData] = useState<RobotData[]>([]);
  const [robotsLoading, setRobotsLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const refetchRobots = useCallback(async () => {
    try {
      setRobotsLoading(true);
      setError(null);
      const data = await robotAPI.getRobots();
      setRobots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load robots');
    } finally {
      setRobotsLoading(false);
    }
  }, []);

  const fetchRobot = useCallback(async (id: number) => {
    try {
      setDetailLoading(true);
      setError(null);
      const robot = await robotAPI.getRobot(id);
      setSelectedRobot(robot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load robot');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const fetchRobotHistory = useCallback(async (id: number, hours: number = 24) => {
    try {
      setDetailLoading(true);
      const history = await robotAPI.getRobotHistory(id, hours);
      setRobotData(history);
    } catch (err) {
      console.error(`Error fetching history for robot ${id}:`, err);
      setRobotData([]);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const clearSelectedRobot = useCallback(() => {
    setSelectedRobot(null);
    setRobotData([]);
    setError(null);
  }, []);

  // === AUTO REFRESH POLLING ===
  useEffect(() => {
    if (!autoRefresh || !selectedRobot) return;

    const interval = setInterval(() => {
      fetchRobotHistory(selectedRobot.id, 24);
      console.log('Auto-refresh: fetched latest data');
    }, 3000);

    return () => clearInterval(interval);
  }, [autoRefresh, selectedRobot, fetchRobotHistory]);

  // === WebSocket Setup ===
  useEffect(() => {
    refetchRobots();
    websocketService.connect();

    const unsubscribeMessages = websocketService.subscribeToMessages((message: WebSocketMessage) => {
      try {
        switch (message.type) {
          case 'initial_data':
            if (Array.isArray(message.robots)) {
              setRobots(message.robots);
              setRobotsLoading(false);
            }
            break;

          case 'robot_update':
            if ('update_type' in message && message.update_type === 'live_data') {
              if (Array.isArray(message.robots)) {
                setRobots(message.robots);
              }
            } else if ('robot' in message) {
              const robot = message.robot;
              setRobots(prev => prev.map(r => (r.id === robot.id ? robot : r)));
              if (selectedRobot?.id === robot.id) {
                setSelectedRobot(robot);
              }
            }
            break;

          case 'data_update':
            const newPoint = message.data;
            if (selectedRobot && newPoint.robot === selectedRobot.id) {
              setRobotData(prev => {
                if (prev.some(d => d.timestamp === newPoint.timestamp)) return prev;
                return [...prev, newPoint]
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .slice(-50);
              });
            }
            break;
        }
      } catch (err) {
        console.error('WebSocket error:', err);
      }
    });

    const unsubscribeConnection = websocketService.subscribeToConnection(setConnected);

    return () => {
      unsubscribeMessages();
      unsubscribeConnection();
      websocketService.disconnect();
    };
  }, [refetchRobots, selectedRobot?.id]);

  return (
    <RobotContext.Provider
      value={{
        robots,
        selectedRobot,
        robotData,
        robotsLoading,
        detailLoading,
        error,
        connected,
        autoRefresh,
        setAutoRefresh,
        fetchRobot,
        fetchRobotHistory,
        clearSelectedRobot,
        refetchRobots,
      }}
    >
      {children}
    </RobotContext.Provider>
  );
};