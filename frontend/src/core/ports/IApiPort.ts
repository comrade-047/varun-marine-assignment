import type { Route, RouteComparison, ShipCompliance, BankResult, Pool, BankEntry} from '../domain/types';

export interface IApiPort {
  // Routes
  getRoutes(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<Route>;
  getComparison(): Promise<RouteComparison>;

  // Compliance
  computeCb(shipId: string, year: number): Promise<ShipCompliance>;
  getAdjustedCb(shipId: string, year: number): Promise<ShipCompliance>;

  // Banking
  bankSurplus(shipId: string, year: number): Promise<BankEntry>;
  applyBankedSurplus(shipId: string, year: number, amount: number): Promise<BankResult>;

  // Pooling
  createPool(shipIds: string[], year: number): Promise<Pool>;
}