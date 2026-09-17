import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AnalyticsData,
  LoginCredentials,
  LoginResponse,
  User,
} from '../types';

const API_BASE_URL =
  'http://10.0.2.2:3000/api/v1';

class ApiService {
  private token: string | null = null;

  async initializeToken(): Promise<void> {
    this.token = await AsyncStorage.getItem('authToken');
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = await this.getHeaders();

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...(options.headers as Record<string, string> | undefined),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<LoginResponse> {
    const response = await this.request<{
      success: boolean;
      data: LoginResponse;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    this.token = response.data.token;

    await AsyncStorage.setItem(
      'authToken',
      response.data.token,
    );

    return response.data;
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('authToken');
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await this.request<{
      success: boolean;
      data: AnalyticsData;
    }>('/analytics');

    return response.data;
  }

  async saveOfflineRequest(
    endpoint: string,
    method: string,
    data: unknown,
  ): Promise<void> {
    const existingData =
      await AsyncStorage.getItem('offlineRequests');

    const requests = existingData
      ? JSON.parse(existingData)
      : [];

    requests.push({
      id: Date.now().toString(),
      endpoint,
      method,
      data,
      timestamp: Date.now(),
    });

    await AsyncStorage.setItem(
      'offlineRequests',
      JSON.stringify(requests),
    );
  }
}

export const apiService = new ApiService();