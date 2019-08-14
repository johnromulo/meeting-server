import request from 'supertest';
import bcrypt from 'bcryptjs';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../util/truncate';
import insert from '../../util/insertData';
import { baseURL } from '../../util/config';

jest.setTimeout(30000);

describe('User store', () => {
  beforeEach(async () => {
    await truncate();
    await insert();
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post(`${baseURL}/users`)
      .send(user);

    expect(response.body).toHaveProperty('user');
    expect(response.status).toBe(200);
  });

  it('should not be able register to go through the validation scheme ', async () => {
    const response = await request(app)
      .post(`${baseURL}/users`)
      .send({});

    expect(response.body).toHaveProperty('error');
    expect(response.body).toHaveProperty('messages');
    expect(Array.isArray(response.body.messages)).toBe(true);
    expect(response.status).toBe(400);
  });

  it('should not be able to register with duplicated', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post(`${baseURL}/users`)
      .send(user);

    const response = await request(app)
      .post(`${baseURL}/users`)
      .send(user);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User already exists');
    expect(response.status).toBe(400);
  });
});
