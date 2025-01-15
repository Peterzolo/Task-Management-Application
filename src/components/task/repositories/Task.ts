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
}
