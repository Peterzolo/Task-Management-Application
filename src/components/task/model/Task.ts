// Task.ts
import { Model, DataTypes, Sequelize, ModelAttributes } from 'sequelize';
import { ITask, TaskStatus } from '../../../types/task';

export class Task extends Model<ITask, Task> implements ITask {
  public id!: string;
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.STRING, // Use STRING for date, or DataTypes.DATE if preferred
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
};
