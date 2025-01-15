// Task.ts
import { Model, DataTypes, Sequelize, ModelAttributes } from 'sequelize';
import { ITask, TaskStatus } from '../../../types/task';
import { Auth } from '../../auth/model/Auth';

export class Task extends Model<ITask, Task> implements ITask {
  public id!: string;
  public userId!: string;
  public title!: string;
  public description!: string;
  public dueDate!: string;
  public status!: TaskStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const initializeTaskModel = (sequelize: Sequelize): void => {
  const attributes: ModelAttributes<Task> = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'auths', // Table name for the User model
        key: 'id', // Key in the User table being referenced
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: TaskStatus.Pending,
      validate: {
        isIn: [[TaskStatus.Pending, TaskStatus.InProgress, TaskStatus.Completed]],
      },
    },
  };

  Task.init(attributes, {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true,
  });
  Task.belongsTo(Auth, { foreignKey: 'userId', as: 'creator' });
};
