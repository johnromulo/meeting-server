import { factory } from 'factory-girl';

import User from '../src/app/models/User';

import UserFactory from './factories/User';

factory.define('User', User, UserFactory);

export default factory;
