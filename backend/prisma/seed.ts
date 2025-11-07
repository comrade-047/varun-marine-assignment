import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const routes = [
    {
      route_id: "R001",
      vesselType: "Container",
      fuelType: "HFO",
      year: 2024,
      ghgIntensity: 91.0,
      fuelConsumption: 5000,
      distance: 12000,
      totalEmissions: 4500,
      is_baseline: true,
    },
    {
      route_id: "R002",
      vesselType: "BulkCarrier",
      fuelType: "LNG",
      year: 2024,
      ghgIntensity: 88.0,
      fuelConsumption: 4800,
      distance: 11500,
      totalEmissions: 4200,
      is_baseline: false,
    },
    {
      route_id: "R003",
      vesselType: "Tanker",
      fuelType: "MGO",
      year: 2024,
      ghgIntensity: 93.5,
      fuelConsumption: 5100,
      distance: 12500,
      totalEmissions: 4700,
      is_baseline: false,
    },
    {
      route_id: "R004",
      vesselType: "RoRo",
      fuelType: "HFO",
      year: 2025,
      ghgIntensity: 89.2,
      fuelConsumption: 4900,
      distance: 11800,
      totalEmissions: 4300,
      is_baseline: false,
    },
    {
      route_id: "R005",
      vesselType: "Container",
      fuelType: "LNG",
      year: 2025,
      ghgIntensity: 90.5,
      fuelConsumption: 4950,
      distance: 11900,
      totalEmissions: 4400,
      is_baseline: false,
    },
  ];

  for (const r of routes) {
    // upsert by unique route_id so running seed is idempotent
    await prisma.route.upsert({
      where: { route_id: r.route_id },
      update: r,
      create: r,
    });
    console.log(`Upserted route ${r.route_id}`);
  }

  console.log("Route seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
