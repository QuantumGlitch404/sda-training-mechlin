import { useCallback, useEffect, useState } from 'react';

import { apiClient } from '../services/apiClient';
import { offlineService } from '../services/offlineService';
import { realtimeService } from '../services/realtimeService';

interface UseApiOptions {
  enableOffline?: boolean;
  enableRealtime?: boolean;
  cacheKey?: string;
  cacheExpiry?: number;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isOnline: boolean;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  endpoint: string,
  options: UseApiOptions = {},
): UseApiResult<T> {
  const {
    enableOffline = true,
    enableRealtime = false,
    cacheKey = endpoint,
    cacheExpiry = 300000,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(
    offlineService.isConnected(),
  );

  const fetchData = useCallback(async () => {
    if (!offlineService.isConnected()) {
      setIsOnline(false);

      if (enableOffline) {
        const cachedData = await offlineService.getOfflineData(cacheKey);

        if (cachedData !== null) {
          setData(cachedData as T);
          return;
        }
      }

      setError('No internet connection.');
      return;
    }

    setIsOnline(true);
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<T>(endpoint);
      setData(response.data);

      if (enableOffline) {
        await offlineService.storeOfflineData(
          cacheKey,
          response.data,
          Date.now() + cacheExpiry,
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Request failed.',
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, enableOffline, cacheKey, cacheExpiry]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enableRealtime) {
      return;
    }

    const handleUpdate = (update: unknown) => {
      setData(update as T);
    };

    realtimeService.subscribe('dataUpdate', handleUpdate);

    return () => {
      realtimeService.unsubscribe('dataUpdate', handleUpdate);
    };
  }, [enableRealtime]);

  return {
    data,
    loading,
    error,
    isOnline,
    refetch: fetchData,
  };
}
