import { TaskRepository } from '../repositories/Task';

import { ICreateTask, ITask, IUpdateTask, TaskResponseData } from '../../../types/task';
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

  // Fetch all tasks
  static async getAllUserTasks(userId: string): Promise<Partial<ITask>[]> {
    const tasks = await TaskRepository.findTasksByUserId(userId);

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

  static async updateTask(id: string, data: IUpdateTask, userId: string): Promise<ITask> {
    try {
      const updatedTask = await TaskRepository.updateTask(id, data, userId);
      if (!updatedTask) {
        throw new Error('Failed to update task');
      }
      return updatedTask;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Delete a task by its ID
  static async deleteTask(id: string): Promise<boolean> {
    const isDeleted = await TaskRepository.deleteTask(id);

    if (!isDeleted) {
      throw new NotFoundError('Task not found');
    }

    return true;
  }
}
