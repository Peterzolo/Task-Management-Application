import { DataTypes, Model, Sequelize, Optional } from 'sequelize';
import { IAuth } from '../../../types/auth/IAuth';

// Define the attributes for the Auth model
type AuthAttributes = IAuth;

// Define the creation attributes for the Auth model
type AuthCreationAttributes = Optional<AuthAttributes, 'id' | '_id' | 'createdAt' | 'updatedAt'>;

// Create the Auth model class
class Auth extends Model<AuthAttributes, AuthCreationAttributes> implements AuthAttributes {
  public id!: string;
  public _id!: string;
  public email!: string;
  public role!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // You can define any custom methods here if needed
}

// Export a function to initialize the model
export default (sequelize: Sequelize) => {
  Auth.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
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
    },
    {
      sequelize,
      modelName: 'Auth',
      tableName: 'auths',
      timestamps: true, // Automatically add createdAt and updatedAt
    },
  );

  return Auth;
};
