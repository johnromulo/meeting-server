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
import InvitationController from './app/controllers/InvitationController';
import ScheduleController from './app/controllers/ScheduleController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validateAutheticatorStore from './app/validators/AutheticatorStore';
import validateMeetingStore from './app/validators/MeetingStore';
import validateInvitationStore from './app/validators/InvitationStore';
import validateInvitationUpdate from './app/validators/InvitationUpdate';

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

routes.get('/files/:path', FileController.index);

routes.use(authMiddleware);

routes.put('/users/', validateUserUpdate, UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetings', validateMeetingStore, MeetingController.store);
routes.put('/meetings/:id', MeetingController.update);
routes.get('/meetings/:id?', MeetingController.index);
routes.delete('/meetings/:id', MeetingController.delete);

routes.post(
  '/invitations',
  validateInvitationStore,
  InvitationController.store
);
routes.put(
  '/invitations/:id/confimation',
  validateInvitationUpdate,
  InvitationController.update
);
routes.delete(
  '/invitations/:id/meeting/:meeting_id',
  InvitationController.delete
);

routes.get('/schedules/', ScheduleController.index);

export default routes;
