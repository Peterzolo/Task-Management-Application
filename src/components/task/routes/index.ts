import { Request, Response, Router } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import validator from '../../../library/middlewares/sanitizer';
import { TaskController } from '../controller/TaskController';
import { hasPermission, verifyToken } from '../../../library/middlewares/authMiddleware';

const taskRouter = Router();

taskRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Auth module working on ${process.env.APP_NAME}` };
    return new SuccessResponse('Looking good', outcome).send(res);
  }),
);

taskRouter.post(
  '/create',
  verifyToken,
  hasPermission('create_tasks'),
  validator(schema.createTask),
  tryCatcher(TaskController.postCreateTask),
);
taskRouter.get('/get-all', verifyToken, hasPermission('view_tasks'), tryCatcher(TaskController.getAllTasks));
taskRouter.get('/user-tasks', verifyToken, tryCatcher(TaskController.getUserTasks));
taskRouter.get('/user-tasks', verifyToken, tryCatcher(TaskController.getUserTasks));
taskRouter.put('/update/:id', verifyToken, tryCatcher(TaskController.updateTask));
taskRouter.delete('/delete/:id', verifyToken, hasPermission('delete_tasks'), tryCatcher(TaskController.deleteTask));
taskRouter.get(
  '/get-filtered-tasks',
  verifyToken,
  hasPermission('view_tasks'),
  tryCatcher(TaskController.getFilteredTasks),
);

export default taskRouter;
