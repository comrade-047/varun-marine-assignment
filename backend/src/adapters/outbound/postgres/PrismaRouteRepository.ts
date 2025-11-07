import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { Routes } from '../../../core/domain/Route';
import { prisma } from '../../../infrastructure/db/prisma';

export class PrismaRouteRepository implements IRouteRepository {
  async findAll(): Promise<Routes[]> {
    return prisma.route.findMany();
  }

  async setBaseline(id: string): Promise<Routes> {
    return prisma.$transaction(async (tx) => {
      await tx.route.updateMany({
        where: { is_baseline: true },
        data: { is_baseline: false },
      });

      return tx.route.update({
        where: { id: id },
        data: { is_baseline: true },
      });
    });
  }
}