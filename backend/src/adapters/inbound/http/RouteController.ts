import { Router } from "express";
import { GetRoutesUseCase } from "../../../core/application/GetRoutesUseCase";
import { PrismaRouteRepository } from "../../outbound/postgres/PrismaRouteRepository";
import { SetBaselineUseCase } from "../../../core/application/SetBaselineUseCase";
import { GetComparisonUseCase } from "../../../core/application/GetComparisonUseCase";

export function createRouteController() {
  const router = Router();

  const routeRepository = new PrismaRouteRepository();

  const getRoutesUseCase = new GetRoutesUseCase(routeRepository);

  const setBaselineUseCase = new SetBaselineUseCase(routeRepository);

  const getComparisonUseCase = new GetComparisonUseCase(routeRepository);

  router.get("/routes", async (req, res) => {
    try {
      const routes = await getRoutesUseCase.execute();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  router.post("/routes/:id/baseline", async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRoute = await setBaselineUseCase.execute(id);
      res.json(updatedRoute);
    } catch (error) {
      console.error(error);
      if (
        error instanceof Error &&
        error.message.includes("Route ID is required")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  router.get("/routes/comparison", async (req, res) => {
    try {
      const comparisonData = await getComparisonUseCase.execute();
      res.json(comparisonData);
    } catch (error) {
      console.error(error);
      if (
        error instanceof Error &&
        error.message.includes("No baseline route set")
      ) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  return router;
}
