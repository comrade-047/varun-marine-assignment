import { Router } from 'express';
import { PrismaShipComplianceRepository } from '../../outbound/postgres/PrismaShipComplianceRepository';
import { PrismaBankRepository } from '../../outbound/postgres/PrismaBankRepository';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedSurplusUseCase } from '../../../core/application/ApplyBankedSurplusUseCase';

export function createBankingController(): Router {
  const router = Router();

  const complianceRepo = new PrismaShipComplianceRepository();
  const bankRepo = new PrismaBankRepository();

  const bankSurplusUseCase = new BankSurplusUseCase(complianceRepo, bankRepo);
  const applyBankedSurplusUseCase = new ApplyBankedSurplusUseCase(complianceRepo, bankRepo);

  router.post('/banking/bank', async (req, res) => {
    try {
      const { ship_id, year } = req.body;
      if (!ship_id || !year) {
        return res.status(400).json({ error: 'ship_id and year are required' });
      }

      const bankEntry = await bankSurplusUseCase.execute(ship_id, year);
      res.status(201).json(bankEntry);

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
  
  router.post('/banking/apply', async (req, res) => {
    try {
      const { ship_id, year, amount } = req.body;
      if (!ship_id || !year || !amount) {
        return res.status(400).json({ error: 'ship_id, year, and amount are required' });
      }
      
      const result = await applyBankedSurplusUseCase.execute(ship_id, year, Number(amount));
      res.json(result);

    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  return router;
}