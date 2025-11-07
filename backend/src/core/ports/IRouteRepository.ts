import { Routes } from "../domain/Route";

export interface IRouteRepository {
    findAll(): Promise<Routes[]>;
    setBaseline(id: string): Promise<Routes>;
}