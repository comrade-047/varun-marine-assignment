import { Routes } from './Route';

export type ComparisonResult = {
  route: Routes;
  percentDiff: number;
  compliant: boolean;
};

export type RouteComparison = {
  baseline: Routes;
  comparisons: ComparisonResult[];
};