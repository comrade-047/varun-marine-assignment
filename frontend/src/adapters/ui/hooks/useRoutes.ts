import { useState, useEffect } from 'react';
import type { Route } from '../../../core/domain/types';
import { api } from '../../infrastructure/AxiosApi';

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRoutes();

      if (Array.isArray(data)) {
        setRoutes(data);
      } else {
        console.error("API did not return an array for routes:", data);
        setError('Failed to fetch routes: Invalid data format.');
        setRoutes([]);
      }

    } catch (err) {
      setError('Failed to fetch routes.');
      console.error(err);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const setBaseline = async (routeId: string) => {
    try {
      await api.setBaseline(routeId);
      await fetchData();
    } catch (err) {
      setError('Failed to set baseline.');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { routes, loading, error, setBaseline };
}