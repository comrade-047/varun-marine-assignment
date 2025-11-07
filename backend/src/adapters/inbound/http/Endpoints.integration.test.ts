import supertest from 'supertest';
import { Express } from 'express';
import { createApp } from '../../../infrastructure/server/app'
import { prisma } from '../../../infrastructure/db/prisma';

const routesSeedData = [
  { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, is_baseline: true },
  { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200 },
  { routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700 },
  { routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300 },
  { routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400 },
];


describe('API Integration Tests', () => {
  let app: Express;
  let request: any;

  beforeAll(async () => {
    await prisma.$connect();
    
    // 2. Seed the database
    console.log('Seeding integration test database...');
    await prisma.route.deleteMany({});
    await prisma.shipCompliance.deleteMany({});

    const prismaData = routesSeedData.map(r => ({
      route_id: r.routeId,
      vesselType: r.vesselType,
      fuelType: r.fuelType,
      year: r.year,
      ghgIntensity: r.ghgIntensity,
      fuelConsumption: r.fuelConsumption,
      distance: r.distance,
      totalEmissions: r.totalEmissions,
      is_baseline: r.is_baseline || false,
    }));

    await prisma.route.createMany({
      data: prismaData,
    });
    console.log('Seeding complete.');
    
    // 3. Create the app
    app = await createApp();
    request = supertest(app);
  });

  // 4. Add a cleanup hook
  afterAll(async () => {
    await prisma.route.deleteMany({});
    await prisma.shipCompliance.deleteMany({});
    await prisma.$disconnect();
  });

  describe('GET /api/routes/comparison', () => {
    it('should return 200 OK and comparison data', async () => {
      const res = await request.get('/api/routes/comparison');
      
      expect(res.status).toBe(200);
      expect(res.body.baseline).toBeDefined();
      expect(res.body.baseline.route_id).toBe('R001');
      expect(res.body.comparisons).toBeInstanceOf(Array);
      expect(res.body.comparisons.length).toBe(4);
      expect(res.body.comparisons[0].compliant).toBeDefined();
    });
  });

  describe('POST /api/pools', () => {
    it('should return 400 if the pool balance is negative', async () => {
      await request.get('/api/compliance/cb?shipId=R004&year=2025');
      
      await request.get('/api/compliance/cb?shipId=R005&year=2025');
      

      const poolBody = {
        ship_ids: ['R004', 'R005'],
        year: 2025,
      };

      const res = await request.post('/api/pools').send(poolBody);
      
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid pool: Total balance is negative.');
    });
  });
});