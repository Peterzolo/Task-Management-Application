// Auth.ts
import { Model, DataTypes, Sequelize, ModelAttributes } from 'sequelize';
import { IAuth } from '../../../types/auth/IAuth';

// This defines the Auth model class which extends Sequelize's Model class
export class Auth extends Model<IAuth, Auth> implements IAuth {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public name!: string | null;
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
      allowNull: true,
    },

    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  Auth.init(attributes, {
    sequelize,
    modelName: 'Auth',
    tableName: 'auths',
    timestamps: true,
  });
};
