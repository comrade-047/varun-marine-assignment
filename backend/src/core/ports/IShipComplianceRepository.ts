import { ShipCompliance } from '@prisma/client';

export type ShipComplianceInput = {
  ship_id: string;
  year: number;
  cb_gco2eq: number;
};

export interface IShipComplianceRepository {
  upsert(input: ShipComplianceInput): Promise<ShipCompliance>;
  find(ship_id: string, year: number): Promise<ShipCompliance | null>; // Also update here
}