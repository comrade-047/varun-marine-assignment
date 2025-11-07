import { Routes } from "../domain/Route";
import { IRouteRepository } from "../ports/IRouteRepository";

export class GetRoutesUseCase {
    constructor(private routeRepository: IRouteRepository){}

    async execute(): Promise<Routes[]> {
        return this.routeRepository.findAll();
    }
}