import { Router } from 'express';
import { PrismaRouteRepository } from '../../outbound/postgres/PrismaRouteRepository';
import { PrismaShipComplianceRepository } from '../../outbound/postgres/PrismaShipComplianceRepository';
import { ComplianceService } from '../../../core/domain/ComplianceService';
import { ComputeCbUseCase } from '../../../core/application/ComputeCbUseCase';
import { GetAdjustedCbUseCase } from '../../../core/application/GetAdjustedCbUseCase';

export function createComplianceController(): Router {
  const router = Router();

  const routeRepo = new PrismaRouteRepository();
  const complianceRepo = new PrismaShipComplianceRepository();
  const complianceService = new ComplianceService();

  const computeCbUseCase = new ComputeCbUseCase(
    routeRepo,
    complianceRepo,
    complianceService
  );

  const getAdjustedCbUseCase = new GetAdjustedCbUseCase(complianceRepo);

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
  router.get('/compliance/adjusted-cb', async (req, res) => {
    try {
      const { shipId, year } = req.query;

      if (!shipId || !year) {
        return res.status(400).json({ error: 'shipId and year are required' });
      }

      // We use ship_id in the db, but the API query param is shipId
      const cb = await getAdjustedCbUseCase.execute(
        String(shipId),
        Number(year)
      );
      
      res.json(cb);

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