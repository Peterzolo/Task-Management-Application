import { Model, ModelStatic } from 'sequelize';

export abstract class BaseRepository<T extends Model> {
  private model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll(where: object = {}): Promise<T[]> {
    return this.model.findAll({ where });
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findByPk(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data as any);
  }

  async update(id: string, data: Partial<T>): Promise<[number, T[]]> {
    return this.model.update(data as any, { where: { id }, returning: true });
  }

  async delete(id: string): Promise<number> {
    return this.model.destroy({ where: { id } });
  }
}
