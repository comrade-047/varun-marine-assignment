import { PoolMemberOutput } from '../domain/PoolService';

export type PoolInput = {
  year: number;
  members: PoolMemberOutput[];
};

export interface IPoolRepository {
  createPool(input: PoolInput): Promise<any>;
}