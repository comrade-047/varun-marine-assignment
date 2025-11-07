import { GetAdjustedCbUseCase } from './GetAdjustedCbUseCase';
import { PoolService, PoolMemberInput } from '../domain/PoolService';
import { IPoolRepository } from '../ports/IPoolRepository';
import { IShipComplianceRepository } from '../ports/IShipComplianceRepository';

export class CreatePoolUseCase {
  private getAdjustedCbUseCase: GetAdjustedCbUseCase;
  
  constructor(
    private readonly poolService: PoolService,
    private readonly poolRepo: IPoolRepository,
    private readonly complianceRepo: IShipComplianceRepository 
  ) {
    this.getAdjustedCbUseCase = new GetAdjustedCbUseCase(complianceRepo);
  }

  async execute(ship_ids: string[], year: number): Promise<any> {
    
    // 1. Get the 'cb_before' for all members
    const memberInputs: PoolMemberInput[] = await Promise.all(
      ship_ids.map(async (ship_id) => {
        const compliance = await this.getAdjustedCbUseCase.execute(ship_id, year);
        return {
          ship_id: ship_id,
          cb_before: compliance.cb_gco2eq,
        };
      })
    );

    // 2. Run the allocation logic
    const allocatedMembers = this.poolService.allocatePool(memberInputs);

    // 3. Save the pool and update member balances
    const poolResult = await this.poolRepo.createPool({
      year: year,
      members: allocatedMembers,
    });

    return poolResult;
  }
}