import request from 'supertest';

import app from '../../../src/app';

import truncate from '../../util/truncate';
import insert from '../../util/insertData';
import { baseURL } from '../../util/config';

jest.setTimeout(30000);

describe('Auth store', () => {
  const client_key_web = 'clientkey_web';
  const client_secret_web = 'client_secret_web';

  const client_key_mobile = 'clientkey_mobile';
  const client_secret_mobile = 'client_secret_mobile';

  beforeEach(async () => {
    await truncate();
    await insert();
  });

  it('should be able login email', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    expect(response.body).toHaveProperty('access');
    expect(response.status).toBe(200);
  });

  it('should not be able to go through the validation scheme', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({});

    expect(response.body).toHaveProperty('error');
    expect(response.status).toBe(400);
  });

  it('should be able login cpf', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        cpf: '12345678901',
        password: 'admin1234',
      });

    expect(response.body).toHaveProperty('access');
    expect(response.status).toBe(200);
  });

  it('should not be able login User not found', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        cpf: '090898089',
        password: 'admin1234',
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User not found');
    expect(response.status).toBe(401);
  });

  it('should not be able login Password does not match', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_web)
      .set('client_secret', client_secret_web)
      .send({
        cpf: '12345678901',
        password: 'noPass',
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Password does not match');
    expect(response.status).toBe(401);
  });

  it('should not be able login when Client not found', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', 'notclientkey')
      .set('client_secret', 'notclientsecret')
      .send({
        email: 'admin@teste.com',
        password: 'admin1234',
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Client not found');
    expect(response.status).toBe(401);
  });

  it('should not be able login User does not have permission to access', async () => {
    const response = await request(app)
      .post(`${baseURL}/auth`)
      .set('client_key', client_key_mobile)
      .set('client_secret', client_secret_mobile)
      .send({
        cpf: '12345678901',
        password: 'admin1234',
      });

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('User does not have permission to access');
    expect(response.status).toBe(401);
  });
});
