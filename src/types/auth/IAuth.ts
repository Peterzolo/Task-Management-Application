import { Model } from 'sequelize';

export interface IAuth extends Model<IAuth> {
  id?: string;
  email?: string;
  name?: string;
  password?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
