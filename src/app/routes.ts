import express from 'express';
// import config from '../config';

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send({ msg: 'Hotel api running ' });
});

export default router;
