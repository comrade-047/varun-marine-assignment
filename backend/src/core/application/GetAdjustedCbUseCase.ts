import { IShipComplianceRepository } from '../ports/IShipComplianceRepository';
import { ShipCompliance } from '@prisma/client';

export class GetAdjustedCbUseCase {
  constructor(private readonly complianceRepo: IShipComplianceRepository) {}

  async execute(ship_id: string, year: number): Promise<ShipCompliance> {
    const compliance = await this.complianceRepo.find(ship_id, year);

    if (!compliance) {
      return {
        id: '',
        ship_id: ship_id,
        year: year,
        cb_gco2eq: 0,
      };
    }

    return compliance;
  }
}