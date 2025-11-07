import express from 'express';
import 'dotenv/config'; 
import { createRouteController } from '../../adapters/inbound/http/RouteController';

export async function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/',(req, res) => {
    res.send('Backend server is healthy and running.');
  });
  app.use('/api', createRouteController());

  return app;
}