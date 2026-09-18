export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
}

export interface OfflineRequest {
  id: string;
  endpoint: string;
  method: string;
  data: unknown;
  timestamp: number;
}

export interface RootStackParamList {
  Login: undefined;
  Main: undefined;
}