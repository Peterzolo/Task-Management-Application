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
}
