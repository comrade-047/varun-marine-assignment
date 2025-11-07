import { IBankRepository, BankEntryInput } from '../../../core/ports/IBankRepository';
import { BankEntry } from '@prisma/client';
import { prisma } from '../../../infrastructure/db/prisma';

export class PrismaBankRepository implements IBankRepository {
  
  async create(input: BankEntryInput): Promise<BankEntry> {
    return prisma.bankEntry.create({
      data: input,
    });
  }

  async findForShip(ship_id: string, year: number): Promise<BankEntry[]> {
    return prisma.bankEntry.findMany({
      where: { ship_id, year },
      orderBy: { created_at: 'asc' },
    });
  }

  // Simple implementation: Sums up all entries
  async getAvailableBalance(ship_id: string, year: number): Promise<number> {
    const entries = await this.findForShip(ship_id, year);
    
    // In this simple model, "available" is the total banked amount.
    // A real system would track withdrawals.
    return entries.reduce((sum, entry) => sum + entry.amount_gco2eq, 0);
  }
}