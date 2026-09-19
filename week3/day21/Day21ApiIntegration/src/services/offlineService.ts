import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import { OfflineAction, OfflineData } from '../types';

class OfflineService {
  private queue: OfflineAction[] = [];
  private cache = new Map<string, OfflineData>();
  private online = true;

  constructor() {
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    const savedQueue = await AsyncStorage.getItem('offlineQueue');
    const savedCache = await AsyncStorage.getItem('offlineCache');

    if (savedQueue) {
      this.queue = JSON.parse(savedQueue);
    }

    if (savedCache) {
      this.cache = new Map(JSON.parse(savedCache));
    }

    NetInfo.addEventListener(state => {
      this.online = state.isConnected ?? false;

      if (this.online) {
        void this.syncQueue();
      }
    });
  }

  private saveQueue(): Promise<void> {
    return AsyncStorage.setItem(
      'offlineQueue',
      JSON.stringify(this.queue),
    );
  }

  private saveCache(): Promise<void> {
    return AsyncStorage.setItem(
      'offlineCache',
      JSON.stringify(Array.from(this.cache.entries())),
    );
  }

  async queueRequest(
    method: string,
    url: string,
    data?: unknown,
  ): Promise<void> {
    this.queue.push({
      id: `${Date.now()}-${Math.random()}`,
      method,
      url,
      data,
      timestamp: Date.now(),
      retries: 0,
    });

    await this.saveQueue();
  }

  async storeOfflineData(
    key: string,
    data: unknown,
    expiresAt?: number,
  ): Promise<void> {
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      expiresAt,
    });

    await this.saveCache();
  }

  async getOfflineData(key: string): Promise<unknown | null> {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      await this.saveCache();
      return null;
    }

    return item.data;
  }

  async syncQueue(): Promise<void> {
    if (!this.online || this.queue.length === 0) {
      return;
    }

    console.log('Offline queue ready for synchronization.');
    this.queue = [];
    await this.saveQueue();
  }

  getQueue(): OfflineAction[] {
    return [...this.queue];
  }

  isConnected(): boolean {
    return this.online;
  }

  async clearAll(): Promise<void> {
    this.queue = [];
    this.cache.clear();

    await Promise.all([
  AsyncStorage.removeItem('@offline_queue'),
  AsyncStorage.removeItem('@api_cache'),
  AsyncStorage.removeItem('@offline_actions'),
]);
  }
}

export const offlineService = new OfflineService();
