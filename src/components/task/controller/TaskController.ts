import { Request, Response } from 'express';
import { TaskService } from '../services/Task';
import { AuthPresenter } from '../presenters/Task';

export class TaskController {
  static async postCreateTask(req: Request, res: Response): Promise<Response> {
    const result = await TaskService.createNewTask(req.body);
    return res.status(201).json(AuthPresenter.taskPresenter(result));
  }
}
