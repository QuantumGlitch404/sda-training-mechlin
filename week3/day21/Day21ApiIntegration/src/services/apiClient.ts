import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

import {
  ApiResponse,
  User,
  UserFilters,
  PaginatedResponse,
  AnalyticsData,
} from '../types';

class ApiClient {
  private readonly client: AxiosInstance;
  private isOnline = true;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://10.0.2.2:3000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(async config => {
      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      response => response,
      async error => {
        if (error.response?.status === 401) {
          await this.clearToken();
        }

        return Promise.reject(error);
      },
    );

    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
    });
  }

  private async request<T>(
    method: string,
    url: string,
    data?: unknown,
  ): Promise<ApiResponse<T>> {
    if (!this.isOnline) {
      throw new Error('No internet connection.');
    }

    const response = await this.client.request<ApiResponse<T>>({
      method,
      url,
      data,
    });

    return response.data;
  }

  get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url);
  }

  post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }

  login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.post('/auth/login', credentials);
  }

  logout(): Promise<ApiResponse<unknown>> {
    return this.post('/auth/logout');
  }

  getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get('/auth/me');
  }

  getUsers(
    filters: UserFilters = {},
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query.append(key, String(value));
      }
    });

    return this.get(`/users?${query.toString()}`);
  }

  getUser(id: string): Promise<ApiResponse<User>> {
    return this.get(`/users/${id}`);
  }

  updateUser(
    id: string,
    data: Partial<User>,
  ): Promise<ApiResponse<User>> {
    return this.put(`/users/${id}`, data);
  }

  getAnalytics(
    timeRange = '30d',
  ): Promise<ApiResponse<AnalyticsData>> {
    return this.get(`/analytics?timeRange=${timeRange}`);
  }

  saveToken(token: string): Promise<void> {
    return AsyncStorage.setItem('authToken', token);
  }

  getToken(): Promise<string | null> {
    return AsyncStorage.getItem('authToken');
  }

  clearToken(): Promise<void> {
    return AsyncStorage.removeItem('authToken');
  }
}

export const apiClient = new ApiClient();
