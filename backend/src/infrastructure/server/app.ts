import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { createRouteController } from '../../adapters/inbound/http/RouteController';
import { createComplianceController } from '../../adapters/inbound/http/ComplianceController';  
import { createBankingController } from '../../adapters/inbound/http/BankingController';
import { createPoolController } from '../../adapters/inbound/http/PoolController';

export async function createApp() {
  const app = express();
  app.use(cors());

  app.use(express.json());

  app.use('/api', createRouteController());
  app.use('/api', createComplianceController());
  app.use('/api', createBankingController());
  app.use('/api', createPoolController());

  app.get('/', (req, res) => {
    res.send('Backend server is healthy and running.');
  });

  return app;
}