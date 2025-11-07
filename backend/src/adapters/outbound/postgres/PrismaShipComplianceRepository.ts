import { IShipComplianceRepository, ShipComplianceInput } from '../../../core/ports/IShipComplianceRepository';
import { PrismaClient, ShipCompliance } from '@prisma/client';

const prisma = new PrismaClient();

export class PrismaShipComplianceRepository implements IShipComplianceRepository {
  
  async upsert(input: ShipComplianceInput): Promise<ShipCompliance> {
    return prisma.shipCompliance.upsert({
      where: { 
        shipId_year: {
          ship_id: input.ship_id,
          year: input.year
        }
      },
      update: { cb_gco2eq: input.cb_gco2eq },
      create: input,
    });
  }
  
  async find(shipId: string, year: number): Promise<ShipCompliance | null> {
    return prisma.shipCompliance.findUnique({
      where: { 
        shipId_year: {
          ship_id: shipId,
          year: year
        }
      }
    });
  }
}