import { Request, Response, Router } from 'express';
import { SuccessResponse, tryCatcher } from '../../../library/helpers';
import schema from './schemas';
import validator from '../../../library/middlewares/sanitizer';
import { AuthController } from '../controller/OnboardingController';

const authRouter = Router();

authRouter.get(
  '/health',
  tryCatcher(async (_req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
    const outcome = { msg: `Auth module working on ${process.env.APP_NAME}` };
    return new SuccessResponse('Looking good', outcome).send(res);
  }),
);

authRouter.post('/signup', validator(schema.signUp), tryCatcher(AuthController.signUp));
authRouter.post('/login', validator(schema.login), tryCatcher(AuthController.signIn));
authRouter.post('/forgot-password', validator(schema.forgotPassword), tryCatcher(AuthController.forgotPassword));
authRouter.post('/reset-password', validator(schema.resetPassword), tryCatcher(AuthController.resetPassword));

export default authRouter;
