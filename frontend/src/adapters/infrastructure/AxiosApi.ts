import axios from 'axios';
import type { IApiPort } from '../../core/ports/IApiPort';
import type { Route, RouteComparison, ShipCompliance, BankResult, Pool, BankEntry } from '../../core/domain/types';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

class AxiosApi implements IApiPort {
  async getRoutes(): Promise<Route[]> {
    const response = await apiClient.get('/routes');
    return response.data;
  }

  async setBaseline(routeId: string): Promise<Route> {
    const response = await apiClient.post(`/routes/${routeId}/baseline`);
    return response.data;
  }

  async getComparison(): Promise<RouteComparison> {
    const response = await apiClient.get('/routes/comparison');
    return response.data;
  }

  async getAdjustedCb(shipId: string, year: number): Promise<ShipCompliance> {
    const response = await apiClient.get(`/compliance/adjusted-cb?shipId=${shipId}&year=${year}`);
    return response.data;
  }

  async bankSurplus(shipId: string, year: number): Promise<BankEntry> {
    const response = await apiClient.post('/banking/bank', { ship_id: shipId, year: year });
    return response.data;
  }

  async applyBankedSurplus(shipId: string, year: number, amount: number): Promise<BankResult> {
    const response = await apiClient.post('/banking/apply', { ship_id: shipId, year: year, amount: amount });
    return response.data;
  }

  async createPool(shipIds: string[], year: number): Promise<Pool> {
    const response = await apiClient.post('/pools', { ship_ids: shipIds, year: year });
    return response.data;
  }
}

// Create a single instance to be used by the whole app
export const api = new AxiosApi();