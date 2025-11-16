// src/services/api.ts
import { Robot, RobotData } from '@/types/robot';
import axios from 'axios';

// ---- 1. Read from Vite env ----
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined in .env.local');
}

// ---- 2. Axios instance ----
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const robotAPI = {
  getRobots: (): Promise<Robot[]> =>
    api.get('/robots/').then((res) => res.data),

  getRobot: (id: number): Promise<Robot> =>
    api.get(`/robots/${id}/`).then((res) => res.data),

  getRobotHistory: async (id: number, hours: number = 24): Promise<RobotData[]> => {
    const { data } = await api.get(`/robots/${id}/history/?hours=${hours}`);
    return Array.isArray(data) ? data : data.results ?? [];
  },

  getRobotData: async (robotId?: number, limit = 100): Promise<RobotData[]> => {
    try {
      const params: Record<string, any> = { limit };
      if (robotId) params.robot_id = robotId;

      const { data } = await api.get('/robot-data/', { params });
      return Array.isArray(data) ? data : data.results ?? [];
    } catch (err) {
      console.error('Error fetching robot data:', err);
      return [];
    }
  },

  getRobotDataById: async (robotId: number, limit = 50): Promise<RobotData[]> => {
    try {
      const { data } = await api.get('/robot-data/', {
        params: { robot_id: robotId, limit },
      });

      const list = Array.isArray(data) ? data : data.results ?? [];

      return list.sort(
        (a: RobotData, b: RobotData) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
    } catch (err) {
      console.error('Error fetching robot data by ID:', err);
      return [];
    }
  },
};

export default api;