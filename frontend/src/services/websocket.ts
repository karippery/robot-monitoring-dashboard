// src/services/websocket.ts
import { WebSocketMessage } from '@/types/robot';

type MessageCallback = (msg: WebSocketMessage) => void;
type ConnectionCallback = (connected: boolean) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 3000;

  // ---- 1. Pull WS URL from env ----
  private get wsUrl(): string {
    const url = import.meta.env.VITE_WS_BASE_URL as string;
    if (!url) {
      throw new Error('VITE_WS_BASE_URL is not defined in .env.local');
    }
    return url;
  }

  connect() {
    try {
      this.socket = new WebSocket(this.wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.notifyMessageCallbacks(message);
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.notifyConnectionChange(false);
        this.handleReconnect();
      };

      this.socket.onerror = (err) => {
        console.error('WebSocket error:', err);
      };
    } catch (e) {
      console.error('Failed to create WebSocket:', e);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
  }

  subscribeToMessages(cb: MessageCallback) {
    this.messageCallbacks.push(cb);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((c) => c !== cb);
    };
  }

  subscribeToConnection(cb: ConnectionCallback) {
    this.connectionCallbacks.push(cb);
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter(
        (c) => c !== cb
      );
    };
  }

  private notifyMessageCallbacks(msg: WebSocketMessage) {
    this.messageCallbacks.forEach((cb) => {
      try { cb(msg); } catch (e) { console.error('Message callback error:', e); }
    });
  }

  private notifyConnectionChange(connected: boolean) {
    this.connectionCallbacks.forEach((cb) => {
      try { cb(connected); } catch (e) { console.error('Connection callback error:', e); }
    });
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

export const websocketService = new WebSocketService();