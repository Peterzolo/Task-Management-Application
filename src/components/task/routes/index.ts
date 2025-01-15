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

export default taskRouter;
