export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalRequests: number;
  successRate: number;
}

export interface OfflineAction {
  id: string;
  method: string;
  url: string;
  data?: unknown;
  timestamp: number;
  retries: number;
}

export interface OfflineData {
  key: string;
  data: unknown;
  timestamp: number;
  expiresAt?: number;
}

export interface RealtimeEvent<T = unknown> {
  type: string;
  data: T;
  timestamp: number;
}

export interface NotificationData {
  title: string;
  message: string;
  data?: Record<string, unknown>;
  sound?: string;
  badge?: number;
}
