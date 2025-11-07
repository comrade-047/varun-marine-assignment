import { Router } from 'express';
import { PoolService } from '../../../core/domain/PoolService';
import { PrismaPoolRepository } from '../../outbound/postgres/PrismaPoolRepository';
import { PrismaShipComplianceRepository } from '../../outbound/postgres/PrismaShipComplianceRepository';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

export function createPoolController(): Router {
  const router = Router();

  // 1. Dependencies
  const poolService = new PoolService();
  const poolRepo = new PrismaPoolRepository();
  const complianceRepo = new PrismaShipComplianceRepository();

  // 2. Use Cases
  const createPoolUseCase = new CreatePoolUseCase(
    poolService,
    poolRepo,
    complianceRepo
  );

  // 3. Endpoints
  // POST /pools
  router.post('/pools', async (req, res) => {
    try {
      const { ship_ids, year } = req.body;
      if (!ship_ids || !Array.isArray(ship_ids) || !year) {
        return res.status(400).json({ error: 'ship_ids (array) and year are required' });
      }

      const result = await createPoolUseCase.execute(ship_ids, year);
      res.status(201).json(result);

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