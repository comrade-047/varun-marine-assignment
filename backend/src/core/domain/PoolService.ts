export type PoolMemberInput = {
  ship_id: string;
  cb_before: number;
};

export type PoolMemberOutput = {
  ship_id: string;
  cb_before: number;
  cb_after: number;
};

export class PoolService {
  
  allocatePool(members: PoolMemberInput[]): PoolMemberOutput[] {
    // Step 1: total pool balance
    const totalBalance = members.reduce((acc, m) => acc + m.cb_before, 0);

    if (totalBalance < 0) {
      throw new Error('Invalid pool: Total balance is negative.');
    }

    // Prepare structures
    type MemberState = {
      ship_id: string;
      original: number;
      remaining: number; // mutable remaining balance
    };

    const memberStates: Record<string, MemberState> = {};
    for (const m of members) {
      memberStates[m.ship_id] = {
        ship_id: m.ship_id,
        original: m.cb_before,
        remaining: m.cb_before,
      };
    }

    // Step 3: separate into surplus and deficit lists
    const surplusShips: MemberState[] = Object.values(memberStates)
      .filter((s) => s.original > 0)
      // richest first
      .sort((a, b) => b.remaining - a.remaining);

    const deficitShips: MemberState[] = Object.values(memberStates)
      .filter((s) => s.original < 0)
      // poorest first (most negative first)
      .sort((a, b) => a.remaining - b.remaining);

    // allocations map: net change applied to each ship (positive = received)
    const netChange: Record<string, number> = {};
    for (const s of Object.values(memberStates)) netChange[s.ship_id] = 0;

    // Step 5: greedy allocation
    for (const deficit of deficitShips) {
      // how much this deficit still needs (positive number)
      let deficitNeed = -deficit.remaining;
      if (deficitNeed <= 0) continue; // already covered

      for (const surplus of surplusShips) {
        if (deficitNeed <= 0) break;
        if (surplus.remaining <= 0) continue;

        const amountToTransfer = Math.min(deficitNeed, surplus.remaining);
        if (amountToTransfer <= 0) continue;

        // Apply transfer
        deficit.remaining += amountToTransfer; // less negative
        surplus.remaining -= amountToTransfer;
  netChange[deficit.ship_id] = (netChange[deficit.ship_id] ?? 0) + amountToTransfer;
  netChange[surplus.ship_id] = (netChange[surplus.ship_id] ?? 0) - amountToTransfer;

        // update how much the deficit still needs
        deficitNeed = -deficit.remaining;

        // if this deficit is covered, move to next deficit
        if (deficit.remaining >= 0) break;
      }
    }

    // Step 6: format output
    const results: PoolMemberOutput[] = members.map((m) => {
      const after = m.cb_before + (netChange[m.ship_id] ?? 0);
      return {
        ship_id: m.ship_id,
        cb_before: m.cb_before,
        cb_after: after,
      };
    });

    // Step 7: final validation checks
    for (const orig of members) {
      const out = results.find((r) => r.ship_id === orig.ship_id)!;
      if (orig.cb_before < 0) {
        // Deficit ships must not be worse than they started
        if (out.cb_after < orig.cb_before - Number.EPSILON) {
          throw new Error('Invalid allocation: Pool rules violated.');
        }
      }

      if (orig.cb_before > 0) {
        // Surplus ships must not go negative
        if (out.cb_after < -Number.EPSILON) {
          throw new Error('Invalid allocation: Pool rules violated.');
        }
      }
    }

    return results;
  }
}