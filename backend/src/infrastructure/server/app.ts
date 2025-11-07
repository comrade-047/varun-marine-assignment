import express from 'express';
import 'dotenv/config'; 
import { createRouteController } from '../../adapters/inbound/http/RouteController';
import { createComplianceController } from '../../adapters/inbound/http/ComplianceController';  
import { createBankingController } from '../../adapters/inbound/http/BankingController';
import { createPoolController } from '../../adapters/inbound/http/PoolController';

export async function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/',(req, res) => {
    res.send('Backend server is healthy and running.');
  });
  app.use('/api', createRouteController());
  app.use('/api', createComplianceController());
  app.use('/api', createBankingController());
  app.use('/api', createPoolController());

  return app;
}