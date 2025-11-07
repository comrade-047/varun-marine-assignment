import { IShipComplianceRepository } from '../ports/IShipComplianceRepository';
import { IBankRepository } from '../ports/IBankRepository';

export class ApplyBankedSurplusUseCase {
  constructor(
    private readonly complianceRepo: IShipComplianceRepository,
    private readonly bankRepo: IBankRepository
  ) {}

  async execute(ship_id: string, year: number, amountToApply: number): Promise<any> {
    // 1. Get the current CB (which should be a deficit)
    const compliance = await this.complianceRepo.find(ship_id, year);
    if (!compliance) {
      throw new Error(`No compliance record found for ${ship_id} in ${year}.`);
    }

    const currentDeficit = compliance.cb_gco2eq;
    if (currentDeficit >= 0) {
      throw new Error('No deficit to apply surplus to. Balance is zero or positive.');
    }
    
    // 2. Check if requested amount is valid
    if (amountToApply <= 0) {
        throw new Error('Amount to apply must be positive.');
    }
    
    // 3. Check available banked balance
    const availableBalance = await this.bankRepo.getAvailableBalance(ship_id, year);
    
    if (availableBalance < amountToApply) {
      throw new Error(`Insufficient banked balance. Available: ${availableBalance}, Requested: ${amountToApply}`);
    }

    // 4. Calculate new CB
    const newCB = currentDeficit + amountToApply;

    // 5. Update the CB record
    const updatedCompliance = await this.complianceRepo.upsert({
      ship_id: ship_id,
      year: year,
      cb_gco2eq: newCB > 0 ? 0 : newCB,
    });

    // 6. Update the bank to reflect used surplus
    await this.bankRepo.create({
      ship_id: ship_id,
      year: year,
      amount_gco2eq: -amountToApply,
    });

    return {
        cb_before: currentDeficit,
        applied: amountToApply,
        cb_after: updatedCompliance.cb_gco2eq,
    };
  }
}