import EventEmitter from 'eventemitter3';

import { RealtimeEvent } from '../types';

class RealtimeService extends EventEmitter {
  private socket: WebSocket | null = null;
  private connected = false;
  private manuallyDisconnected = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  connect(): void {
    this.manuallyDisconnected = false;

    this.socket = new WebSocket('ws://10.0.2.2:3000/ws');

    this.socket.onopen = () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
    };

    this.socket.onmessage = event => {
      try {
        const message: RealtimeEvent = JSON.parse(event.data);
        this.emit('message', message);
        this.emit(message.type, message.data);
      } catch (error) {
        console.error('Invalid WebSocket message:', error);
      }
    };

    this.socket.onerror = error => {
      this.emit('error', error);
    };

    this.socket.onclose = () => {
      this.connected = false;
      this.emit('disconnected');

      if (
        !this.manuallyDisconnected &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts += 1;

        setTimeout(() => this.connect(), 1000);
      }
    };
  }

  disconnect(): void {
    this.manuallyDisconnected = true;
    this.socket?.close();
    this.socket = null;
    this.connected = false;
  }

  send(data: unknown): void {
    if (this.socket && this.connected) {
      this.socket.send(JSON.stringify(data));
    }
  }

  subscribe(eventName: string, callback: (data: unknown) => void): void {
    this.on(eventName, callback);
  }

  unsubscribe(eventName: string, callback: (data: unknown) => void): void {
    this.off(eventName, callback);
  }

  getStatus(): boolean {
    return this.connected;
  }
}

export const realtimeService = new RealtimeService();
