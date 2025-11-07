export type Route = {
  id: string;
  route_id: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  is_baseline: boolean;
};

export type ComparisonResult = {
  route: Route;
  percentDiff: number;
  compliant: boolean;
};

export type RouteComparison = {
  baseline: Route;
  comparisons: ComparisonResult[];
};

export type ShipCompliance = {
  id: string;
  ship_id: string;
  year: number;
  cb_gco2eq: number;
};

export type BankResult = {
  cb_before: number;
  applied: number;
  cb_after: number;
};

export type PoolMember = {
  ship_id: string;
  cb_before: number;
  cb_after: number;
};

export type Pool = {
  id: string;
  year: number;
  created_at: string;
  members: PoolMember[];
};

export type BankEntry = {
  id: string;
  ship_id: string;
  year: number;
  amount_gco2eq: number;
  created_at: string;
};