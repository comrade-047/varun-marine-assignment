import { useState, useEffect } from 'react';
import type { RouteComparison } from '../../../core/domain/types';
import { api } from '../../infrastructure/AxiosApi';

export function useComparison() {
  const [data, setData] = useState<RouteComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getComparison();
        setData(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('400')) {
          setError('Failed to fetch comparison: No baseline route set.');
        } else {
          setError('Failed to fetch comparison data.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}