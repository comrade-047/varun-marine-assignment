import { Router } from "express";
import { GetRoutesUseCase } from "../../../core/application/GetRoutesUseCase";
import { PrismaRouteRepository } from "../../outbound/postgres/PrismaRouteRepository";
import { SetBaselineUseCase } from "../../../core/application/SetBaselineUseCase";

export function createRouteController() {
    const router = Router();

    const routeRepositry = new PrismaRouteRepository();

    const getRoutesUseCase = new GetRoutesUseCase(routeRepositry);

    const setBaselineUseCase = new SetBaselineUseCase(routeRepositry)

    router.get("/routes", async (req, res) => {
        try {
            const routes = await getRoutesUseCase.execute();
            res.json(routes);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });   
        }
    });

    router.post('/routes/:id/baseline', async (req, res) => {
    try {
      const { id } = req.params;
      const updatedRoute = await setBaselineUseCase.execute(id);
      res.json(updatedRoute);
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message.includes('Route ID is required')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

    return router;
}