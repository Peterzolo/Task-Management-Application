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

  static async findTaskById(id: string): Promise<Task | null> {
    try {
      // Find a task by its ID
      return await Task.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error finding task by ID: ' + error.message);
      } else {
        throw new Error('Error finding task by ID');
      }
    }
  }

  // Update a task by its ID
  static async updateTask(id: string, data: Partial<Task>): Promise<Task | null> {
    try {
      // Find the task to update
      const task = await Task.findOne({
        where: {
          id,
        },
      });

      if (!task) {
        throw new Error('Task not found');
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

      // Delete the task
      await task.destroy();
      return true; // Return true if deletion was successful
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
  static async getTaskById(id: string): Promise<Task | null> {
    try {
      // Fetch a task by its ID
      return await Task.findOne({
        where: {
          id,
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
}
