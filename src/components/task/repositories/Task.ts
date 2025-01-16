import { Op } from 'sequelize';
import { BadRequestError, NotFoundError } from '../../../library/helpers';
import { Task } from '../model/Task';

export class TaskRepository {
  static async createTask(data: Partial<Task>): Promise<Task> {
    try {
      return await Task.create(data as Task);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error creating task: ' + error.message);
      } else {
        throw new Error('Error creating task');
      }
    }
  }

  static async findTaskByTitle(title: string): Promise<Task | null> {
    return Task.findOne({
      where: {
        title,
      },
    });
  }

  static async updateTask(id: string, data: Partial<Task>, userId: string): Promise<Task | null> {
    try {
      const task = await Task.findOne({
        where: {
          id,
          userId,
        },
      });

      if (!task) {
        throw new BadRequestError('Task not found or you are not authorized to update this task');
      }

      await task.update(data);
      return task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error updating task: ' + error.message);
      } else {
        throw new Error('Error updating task');
      }
    }
  }

  static async deleteTask(id: string): Promise<boolean> {
    try {
      const task = await Task.findOne({
        where: {
          id,
        },
      });

      if (!task) {
        throw new NotFoundError('Task not found');
      }

      await task.destroy();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error deleting task: ' + error.message);
      } else {
        throw new Error('Error deleting task');
      }
    }
  }

  // Fetch all tasks
  static async getAllTasks(): Promise<Task[]> {
    try {
      // Fetch all tasks from the database
      return await Task.findAll();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error fetching all tasks: ' + error.message);
      } else {
        throw new Error('Error fetching all tasks');
      }
    }
  }

  // Fetch one task by ID
  static async getTaskUserId(userId: string): Promise<Task | null> {
    try {
      // Fetch a task by its ID
      return await Task.findOne({
        where: {
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error fetching task by ID: ' + error.message);
      } else {
        throw new Error('Error fetching task by ID');
      }
    }
  }

  static async findTasksByUserId(userId: string): Promise<Task[]> {
    try {
      return await Task.findAll({
        where: {
          userId,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error finding tasks by user ID: ' + error.message);
      } else {
        throw new Error('Error finding tasks by user ID');
      }
    }
  }

  static async getFilteredTasks(query: {
    status?: string;
    dueDate?: string;
    sortBy?: 'createdAt' | 'dueDate';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }): Promise<{ rows: Task[]; count: number }> {
    const { status, dueDate, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = query;

    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (dueDate) {
      whereClause.dueDate = { [Op.eq]: dueDate };
    }

    const offset = (page - 1) * limit;

    return await Task.findAndCountAll({
      where: whereClause,
      order: [[sortBy, order]],
      limit,
      offset,
    });
  }
}
