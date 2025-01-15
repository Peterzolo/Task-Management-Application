import { Request, Response } from 'express';
import { TaskService } from '../services/Task';
import { TaskPresenter } from '../presenters/Task';

export class TaskController {
  static async postCreateTask(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Create the task, passing userId and the task data
    const result = await TaskService.createNewTask({ ...req.body, userId });

    // Return the response with the task data presented
    return res.status(201).json(TaskPresenter.taskPresenter(result));
  }

  // Fetch all tasks
  static async getAllTasks(req: Request, res: Response): Promise<Response> {
    const tasks = await TaskService.getAllTasks();

    const formattedTasks = tasks.map((task) => TaskPresenter.taskPresenter(task));

    return res.status(200).json(formattedTasks);
  }
  // Fetch user's own tyaks
  static async getUserTasks(req: Request, res: Response): Promise<Response> {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const tasks = await TaskService.getAllUserTasks(userId);
    const formattedTasks = tasks.map((task) => TaskPresenter.taskPresenter(task));

    return res.status(200).json(formattedTasks);
  }
}
