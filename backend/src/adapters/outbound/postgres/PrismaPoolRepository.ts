import { IPoolRepository, PoolInput } from '../../../core/ports/IPoolRepository';
import { prisma } from '../../../infrastructure/db/prisma';

export class PrismaPoolRepository implements IPoolRepository {
  
  async createPool(input: PoolInput): Promise<any> {
    return prisma.$transaction(async (tx) => {
      // 1. Create the parent Pool
      const pool = await tx.pool.create({
        data: {
          year: input.year,
        },
      });

      // 2. Prepare member data
      const memberData = input.members.map((m) => ({
        pool_id: pool.id,
        ship_id: m.ship_id,
        cb_before: m.cb_before,
        cb_after: m.cb_after,
      }));

      // 3. Create all members
      await tx.poolMember.createMany({
        data: memberData,
      });
      
      // 4.Update the ships' active compliance balances
      for (const member of input.members) {
        await tx.shipCompliance.updateMany({
          where: {
            ship_id: member.ship_id,
            year: input.year
          },
          data: {
            cb_gco2eq: member.cb_after
          }
        });
      }

      return { ...pool, members: memberData };
    });
  }
}