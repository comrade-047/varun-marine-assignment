import { Routes } from "../domain/Route";
import { IRouteRepository } from '../ports/IRouteRepository';

export class SetBaselineUseCase {
  constructor(private readonly routeRepository: IRouteRepository) {}

  async execute(routeId: string): Promise<Routes> {
    if (!routeId) {
      throw new Error('Route ID is required');
    }
    return this.routeRepository.setBaseline(routeId);
  }
}