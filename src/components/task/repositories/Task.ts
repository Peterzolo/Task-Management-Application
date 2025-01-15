import { Op } from 'sequelize';
import { BadRequestError } from '../../../library/helpers';
import { Task } from '../model/Task';

export class TaskRepository {
  static async createTask(data: Partial<Task>): Promise<Task> {
    try {
      // Create the user in the database
      return await Task.create(data as Task);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error creating user: ' + error.message);
      } else {
        throw new Error('Error creating user');
      }
    }
  }

  static async findTaskByTitle(title: string): Promise<Task | null> {
    // Search for a task with the same title and due date
    return Task.findOne({
      where: {
        title,
      },
    });
  }

  static async updateTask(id: string, data: Partial<Task>, userId: string): Promise<Task | null> {
    try {
      // Find the task by ID and verify ownership
      const task = await Task.findOne({
        where: {
          id,
          userId, // Ensure the task belongs to the user
        },
      });

      if (!task) {
        throw new BadRequestError('Task not found or you are not authorized to update this task');
      }

      // Update the task with the new data
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

  // Delete a task by its ID
  static async deleteTask(id: string): Promise<boolean> {
    try {
      // Find the task to delete
      const task = await Task.findOne({
        where: {
          id,
        },
      });

      if (!task) {
        throw new Error('Task not found');
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
