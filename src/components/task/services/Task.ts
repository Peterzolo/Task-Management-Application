import { TaskRepository } from '../repositories/Task';

import { ICreateTask, ITask, TaskResponseData } from '../../../types/task';
import { BadRequestError, NotFoundError } from '../../../library/helpers';
import { TaskPresenter } from '../presenters/Task';

export class TaskService {
  static async createNewTask(data: ICreateTask): Promise<Partial<ITask>> {
    const { title, description, dueDate, userId } = data;

    const existingTask = await TaskRepository.findTaskByTitle(title);

    if (existingTask) {
      throw new BadRequestError('A task with the same title already exists');
    }

    const task = await TaskRepository.createTask({
      title,
      description,
      dueDate,
      userId,
    });

    return TaskPresenter.taskPresenter({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      userId: task.userId,
      status: task.status,
    } as TaskResponseData);
  }

  // Fetch all tasks
  static async getAllTasks(): Promise<Partial<ITask>[]> {
    const tasks = await TaskRepository.getAllTasks();

    if (tasks.length === 0) {
      throw new NotFoundError('No tasks found');
    }

    // Use the presenter to format each task
    return tasks.map((task) =>
      TaskPresenter.taskPresenter({
        id: task.id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
      } as TaskResponseData),
    );
  }

  // Fetch a task by ID
  static async getTaskById(taskId: string): Promise<Partial<ITask>> {
    const task = await TaskRepository.getTaskById(taskId);

    if (!task) {
      throw new NotFoundError(`Task with ID ${taskId} not found`);
    }
    return TaskPresenter.taskPresenter({
      id: task.id,
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
    } as TaskResponseData);
  }
}
