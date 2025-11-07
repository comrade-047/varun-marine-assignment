import { BankEntry } from '@prisma/client';

export type BankEntryInput = {
  ship_id: string;
  year: number;
  amount_gco2eq: number;
};

export interface IBankRepository {
  create(input: BankEntryInput): Promise<BankEntry>;
  
  // Gets all bank records for a ship
  findForShip(ship_id: string, year: number): Promise<BankEntry[]>;
  
  // Calculates the total *available* (unused) banked amount
  getAvailableBalance(ship_id: string, year: number): Promise<number>;
}