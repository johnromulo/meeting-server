import request from 'supertest';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../util/truncate';
import insert from '../../util/insertData';
import { baseURL } from '../../util/config';

jest.setTimeout(60000);

describe('User update', () => {
  const client_key_web = 'clientkey_web';
  const client_secret_web = 'client_secret_web';

  beforeEach(async () => {
    await truncate();
    await insert();
  });

  it('should not be able update to go through the validation scheme ', async () => {
    const {
      body: { access },
    } = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', `Bearer ${access.token}`)
      .send({});

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should not be able update Token not provided', async () => {
    const response = await request(app)
      .put(`${baseURL}/users`)
      .send({});

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Token not provided');
    expect(response.status).toBe(401);
  });

  it('should not be able update Token invalid', async () => {
    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', 'Bearer tokeninvalid')
      .send({});

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Token invalid');
    expect(response.status).toBe(401);
  });

  it('should be able update', async () => {
    const {
      body: { access },
    } = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', `Bearer ${access.token}`)
      .send({
        name: 'updateName',
        email: 'updateEmail@email.com',
        oldPassword: 'admin1234',
        password: 'updateName',
        confirmPassword: 'updateName',
        cpf: 'updateName',
        phone_number: 'updateName',
      });

    expect(response.body).toHaveProperty('user');
    expect(response.status).toBe(200);
  });

  it('should not be able update Password does not match', async () => {
    const {
      body: { access },
    } = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', `Bearer ${access.token}`)
      .send({
        name: 'updateName',
        email: 'updateEmail@email.com',
        oldPassword: 'notpass',
        password: 'updateName',
        confirmPassword: 'updateName',
        cpf: 'updateName',
        phone_number: 'updateName',
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Password does not match');
    expect(response.status).toBe(400);
  });

  it('should not be able update User already exists email', async () => {
    const user = await factory.create('User');

    const {
      body: { access },
    } = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', `Bearer ${access.token}`)
      .send({
        name: 'updateName',
        email: user.email,
        oldPassword: 'notpass',
        password: 'updateName',
        confirmPassword: 'updateName',
        cpf: user.cpf,
        phone_number: user.phone_number,
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User already exists');
    expect(response.status).toBe(400);
  });

  it('should not be able update User already exists cpf', async () => {
    const user = await factory.create('User');

    const {
      body: { access },
    } = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', `Bearer ${access.token}`)
      .send({
        name: 'updateName',
        email: 'admin@teste.com',
        oldPassword: 'notpass',
        password: 'updateName',
        confirmPassword: 'updateName',
        cpf: user.cpf,
        phone_number: user.phone_number,
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User already exists');
    expect(response.status).toBe(400);
  });

  it('should not be able update User already exists phone number', async () => {
    const user = await factory.create('User');

    const {
      body: { access },
    } = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    const response = await request(app)
      .put(`${baseURL}/users`)
      .set('Authorization', `Bearer ${access.token}`)
      .send({
        name: 'updateName',
        email: 'admin@teste.com',
        oldPassword: 'notpass',
        password: 'updateName',
        confirmPassword: 'updateName',
        cpf: '12345678901',
        phone_number: user.phone_number,
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User already exists');
    expect(response.status).toBe(400);
  });
});
