import { Router } from 'express';
import redis from 'redis';
import Brute from 'express-brute';
import BruteRedis from 'express-brute-redis';
import multer from 'multer';
import multerConfig from './config/multer';

import radisConfig from './config/radis';

import UserController from './app/controllers/UserController';
import AuthenticatorController from './app/controllers/AuthenticatorController';
import FileController from './app/controllers/FileController';
import MeetingController from './app/controllers/MeetingController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateAutheticatorStore from './app/validators/AutheticatorStore';
import validateMeetingStore from './app/validators/MeetingStore';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

const bruteStore = new BruteRedis({
  client: redis.createClient({
    ...radisConfig,
  }),
});

const bruteForce = new Brute(bruteStore);

routes.post(
  '/auth',
  bruteForce.prevent,
  validateAutheticatorStore,
  AuthenticatorController.store
);
routes.post('/users', validateUserStore, UserController.store);

routes.use(authMiddleware);

routes.put('/users/', validateUserUpdate, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetings', validateMeetingStore, MeetingController.store);
routes.put('/meetings/:id', MeetingController.update);
routes.get('/meetings', MeetingController.index);
routes.delete('/meetings/:id', MeetingController.delete);

export default routes;
