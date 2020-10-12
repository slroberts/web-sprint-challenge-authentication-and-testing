const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig');
const Users = require('../users/users-model.js');

describe('server', () => {
  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    });

    it('should return 500 if username missing', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: '', password: 'password' });

      expect(res.status).toBe(500);
    });

    it('should return 201 on success', async () => {
      const res = await request(server)
        .post('/api/auth/register')
        .send({ username: 'user1', password: 'password' });

      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 on success', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'user1', password: 'password' });

      expect(res.status).toBe(200);
    });

    it('should return a message with a welcome message and an auth token', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'user1', password: 'password' });

      expect(res.body).toMatchObject({
        message: 'Welcome to the api',
        token: expect.any(String),
      });
    });
  });

  describe('GET to /api/jokes', () => {
    it('should return data', async () => {
      const res = await request(server).get('/api/jokes');

      expect(res.body).toBe(res.body);
    });

    it('should return 500 status if user is unauthorized', async () => {
      const res = await request(server).get('/api/jokes');

      expect(res.status).toBe(500);
    });
  });
});
