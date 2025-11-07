import { IShipComplianceRepository } from '../ports/IShipComplianceRepository';
import { IBankRepository } from '../ports/IBankRepository';

export class BankSurplusUseCase {
  constructor(
    private readonly complianceRepo: IShipComplianceRepository,
    private readonly bankRepo: IBankRepository
  ) {}

  async execute(ship_id: string, year: number): Promise<any> {
    // 1. Get the current CB
    const compliance = await this.complianceRepo.find(ship_id, year);
    if (!compliance) {
      throw new Error(`No compliance record found for ship ${ship_id} in ${year}. Run GET /compliance/cb first.`);
    }

    const currentCB = compliance.cb_gco2eq;

    // 2. Check if it's a surplus (CB > 0)
    if (currentCB <= 0) {
      throw new Error('No surplus to bank. Compliance Balance is zero or negative.');
    }

    // 3. Create a bank entry
    const bankEntry = await this.bankRepo.create({
      ship_id: ship_id,
      year: year,
      amount_gco2eq: currentCB,
    });

    // 4. Update the compliance record to set CB to 0
    await this.complianceRepo.upsert({
      ship_id: ship_id,
      year: year,
      cb_gco2eq: 0,
    });

    return bankEntry;
  }
}