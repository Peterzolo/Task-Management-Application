import { Model, ModelStatic, WhereOptions } from 'sequelize';

export abstract class BaseRepository<T extends Model> {
  protected model: ModelStatic<T>; // Mark the model as protected to allow access in subclasses

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(where: WhereOptions<T> = {}): Promise<T[]> {
    return this.model.findAll({ where });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data as any);
  }

  async update(id: string, data: Partial<T>): Promise<[number, T[]]> {
    const whereClause: WhereOptions<T> = { id } as unknown as WhereOptions<T>;
    return this.model.update(data, { where: whereClause, returning: true });
  }

  async delete(id: string): Promise<number> {
    const whereClause: WhereOptions<T> = { id } as unknown as WhereOptions<T>;
    return this.model.destroy({ where: whereClause });
  }
}
