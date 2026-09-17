import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OfflineRequest {
  id: string;
  endpoint: string;
  method: string;
  data: unknown;
  timestamp: number;
}

class OfflineService {
  private requests: OfflineRequest[] = [];

  async initialize(): Promise<void> {
    try {
      const savedRequests = await AsyncStorage.getItem('offlineRequests');

      this.requests = savedRequests
        ? JSON.parse(savedRequests)
        : [];

      console.log(
        `Offline service initialized with ${this.requests.length} pending request(s).`,
      );
    } catch (error) {
      console.error('Failed to initialize offline service:', error);
      this.requests = [];
    }
  }

  async addRequest(
    endpoint: string,
    method: string,
    data: unknown,
  ): Promise<void> {
    const request: OfflineRequest = {
      id: Date.now().toString(),
      endpoint,
      method,
      data,
      timestamp: Date.now(),
    };

    this.requests.push(request);

    await AsyncStorage.setItem(
      'offlineRequests',
      JSON.stringify(this.requests),
    );
  }

  async getPendingRequests(): Promise<OfflineRequest[]> {
    return this.requests;
  }

  async clearRequests(): Promise<void> {
    this.requests = [];

    await AsyncStorage.removeItem('offlineRequests');
  }

  async removeRequest(requestId: string): Promise<void> {
    this.requests = this.requests.filter(
      request => request.id !== requestId,
    );

    await AsyncStorage.setItem(
      'offlineRequests',
      JSON.stringify(this.requests),
    );
  }
}

export const offlineService = new OfflineService();
