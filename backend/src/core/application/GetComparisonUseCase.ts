import { IRouteRepository } from '../ports/IRouteRepository';
import { Routes } from '../domain/Route';
import { RouteComparison, ComparisonResult } from '../domain/RouteComparison';

const TARGET_INTENSITY = 89.3368; // 2% below 91.16

export class GetComparisonUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(): Promise<RouteComparison> {
    const allRoutes = await this.routeRepository.findAll();

    const baseline = allRoutes.find((r) => r.is_baseline);
    if (!baseline) {
      throw new Error('No baseline route set.');
    }

    const otherRoutes = allRoutes.filter((r) => !r.is_baseline);

    const comparisons = otherRoutes.map((route) =>
      this.compareRoute(baseline, route)
    );

    return { baseline, comparisons };
  }

  private compareRoute(
    baseline: Routes,
    comparisonRoute: Routes
  ): ComparisonResult {
    // Formula: ((comparison / baseline) − 1) × 100
    const percentDiff =
      (comparisonRoute.ghgIntensity / baseline.ghgIntensity - 1) * 100;

    // Compliant if <= Target
    const compliant = comparisonRoute.ghgIntensity <= TARGET_INTENSITY;

    return {
      route: comparisonRoute,
      percentDiff: parseFloat(percentDiff.toFixed(2)),
      compliant,
    };
  }
}