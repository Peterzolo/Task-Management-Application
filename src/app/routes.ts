import express from 'express';
import config from '../config';

import authRouter from '../components/auth/routes';
import taskRouter from '../components/task/routes';

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send({ msg: 'Hotel api running ' });
});
router.use(`${config.api.prefix}/auth`, authRouter);
router.use(`${config.api.prefix}/task`, taskRouter);

export default router;
