import { TaskRepository } from '../repositories/Task';

import { ICreateTask } from '../../../types/task';
import { BadRequestError } from '../../../library/helpers';

export class TaskService {
  static async createNewTask(data: ICreateTask): Promise<ICreateTask> {
    const { title, description, dueDate } = data;

    // Check if a task with the same title and dueDate already exists
    const existingTask = await TaskRepository.findTaskByTitle(title);

    if (existingTask) {
      throw new BadRequestError('A task with the same title already exists');
    }

    const task = await TaskRepository.createTask({
      title,
      description,
      dueDate,
    });

    return { title: task.title, description: task.description, dueDate: task.dueDate };
  }
}
