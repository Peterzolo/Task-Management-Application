import { WhereOptions, UpdateOptions, Model } from 'sequelize';

export interface Write<T extends Model> {
  create: (item: Partial<T['_attributes']>) => Promise<T>;
  createMany: (items: Array<Partial<T['_attributes']>>) => Promise<T[]>;
  update: (
    cond: WhereOptions<T['_attributes']>,
    item: Partial<T['_attributes']>,
    options?: UpdateOptions,
  ) => Promise<[number, T[]]>;
  updateMany: (cond: WhereOptions<T['_attributes']>, update: Partial<T['_attributes']>) => Promise<[number, T[]]>;
  delete: (id: string) => Promise<boolean>;
  deleteMany: (cond: WhereOptions<T['_attributes']>) => Promise<number>;
}
