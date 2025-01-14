import { Model, DataTypes, Sequelize, ModelAttributes } from 'sequelize';
import { IAuth } from '../../../types/auth/IAuth'; // Adjust the import path if necessary

export class Auth extends Model<IAuth> implements IAuth {
  public id!: string; // Primary key
  public email!: string;
  public password!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the model
export const initializeAuthModel = (sequelize: Sequelize): void => {
  const attributes: ModelAttributes<Auth> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.fn('NOW'),
    },
  };

  Auth.init(attributes, {
    sequelize,
    modelName: 'Auth',
    tableName: 'auths', // The table name in your database
    timestamps: true, // Automatically add createdAt and updatedAt
  });
};
