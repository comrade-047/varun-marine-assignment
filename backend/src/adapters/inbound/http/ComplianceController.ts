import { Router } from 'express';
import { PrismaRouteRepository } from '../../outbound/postgres/PrismaRouteRepository';
import { PrismaShipComplianceRepository } from '../../outbound/postgres/PrismaShipComplianceRepository';
import { ComplianceService } from '../../../core/domain/ComplianceService';
import { ComputeCbUseCase } from '../../../core/application/ComputeCbUseCase';

export function createComplianceController(): Router {
  const router = Router();

  // 1. Create dependencies
  const routeRepo = new PrismaRouteRepository();
  const complianceRepo = new PrismaShipComplianceRepository();
  const complianceService = new ComplianceService();

  // 2. Create use cases
  const computeCbUseCase = new ComputeCbUseCase(
    routeRepo,
    complianceRepo,
    complianceService
  );

  // 3. Define routes
  // GET /compliance/cb?shipId=R004&year=2025
  router.get('/compliance/cb', async (req, res) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      const cbSnapshot = await computeCbUseCase.execute(
        String(shipId),
        Number(year)
      );
      
      res.json(cbSnapshot);

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