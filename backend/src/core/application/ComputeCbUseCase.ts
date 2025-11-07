import { IRouteRepository } from '../ports/IRouteRepository';
import { IShipComplianceRepository } from '../ports/IShipComplianceRepository';
import { ComplianceService } from '../domain/ComplianceService';

export class ComputeCbUseCase {
  constructor(
    private readonly routeRepo: IRouteRepository,
    private readonly complianceRepo: IShipComplianceRepository,
    private readonly complianceService: ComplianceService
  ) {}

  async execute(shipId: string, year: number): Promise<any> {
    // For this assignment, we'll assume a "shipId" maps to a "routeId"
    // In a real system, you'd fetch a ship, then its routes.
    // Let's find a route matching this "ship" and year.
    
    // This is a simplification: We'll find *a* route for this ship/year.
    // Let's assume shipId IS the routeId for now.
    const allRoutes = await this.routeRepo.findAll();
    const route = allRoutes.find(r => r.route_id === shipId && r.year === year);
    
    if (!route) {
      throw new Error(`No route data found for ship ${shipId} in ${year}`);
    }

    // 2. Calculate CB
    const cb = this.complianceService.calculateCB({
      ghgIntensity: route.ghgIntensity,
      fuelConsumption: route.fuelConsumption,
    });

    // 3. Store snapshot
    const cbSnapshot = await this.complianceRepo.upsert({
      ship_id: shipId,
      year: year,
      cb_gco2eq: cb,
    });

    return cbSnapshot;
  }
}