import { Request, Response, Router } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import validator from '../../../library/middlewares/sanitizer';
import { TaskController } from '../controller/TaskController';
import { isAdmin, verifyToken } from '../../../library/middlewares/authMiddleware';

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
  isAdmin,
  validator(schema.createTask),
  tryCatcher(TaskController.postCreateTask),
);

export default taskRouter;

// // Health check route
// taskRouter.get(
//   '/health',
//   tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
//     const outcome = { msg: `Auth module working on ${process.env.APP_NAME}` };
//     return new SuccessResponse('Looking good', outcome).send(res);
//   }),
// );

// // Route to create task (available to all authenticated users)
// taskRouter.post(
//   '/create',
//   verifyToken,
//   isUser,  // Ensure the user is authenticated
//   validator(schema.createTask),
//   tryCatcher(TaskController.postCreateTask),
// );

// // Route to update task (available to admin and manager)
// taskRouter.put(
//   '/update/:taskId',
//   verifyToken,
//   hasPermission('update_tasks'),  // Check if the user has the permission
//   validator(schema.updateTask),
//   tryCatcher(TaskController.putUpdateTask),
// );

// // Route to delete task (available to admin only)
// taskRouter.delete(
//   '/delete/:taskId',
//   verifyToken,
//   isAdmin,  // Ensure only admin can delete
//   tryCatcher(TaskController.deleteTask),
// );

// // Route to view task (available to admin, manager, and the task owner)
// taskRouter.get(
//   '/view/:taskId',
//   verifyToken,
//   tryCatcher(TaskController.getViewTask),  // TaskController should handle this route for showing task details
// );

// // Route to delete task (available to admin and manager)
// taskRouter.delete(
//   '/delete/:taskId',
//   verifyToken,
//   hasPermission('delete_tasks'),  // Ensure the user has permission to delete
//   tryCatcher(TaskController.deleteTask),
// );

// export default taskRouter;
