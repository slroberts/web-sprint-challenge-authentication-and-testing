const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig');

describe('server', () => {
  describe('POST /api/auth/login', () => {
    it('should return 200 on success', async () => {
      const res = await request(server)
        .post('/api/auth/login')
        .send({ username: 'user1', password: 'password' });

      expect(res.status).toBe(200);
    });

    it('should return a message with a welcome message and an auth token', async () => {
      const res = await request(server)
        .post('/login')
        .send({ username: 'user1', password: 'password' });

      expect(res.body).toMatchObject({
        message: 'Welcome to the api',
        token: expect.any(String),
      });
    });
  });

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    });

    it('should return 201 on success', async () => {
      const res = await request(server)
        .post('/register')
        .send({ username: 'user1', password: 'password' });

      expect(res.status).toBe(201);
    });

    it('should return a message with an id, a hashed password, and a username', async () => {
      const res = await request(server)
        .post('/register')
        .send({ username: 'user1', password: 'password' });

      expect(res.body[0]).toMatchObject({
        id: expect.any(Number),
        password: expect.not.stringMatching('password'),
        username: 'user1',
      });
    });
  });
  describe('GET to /api/jokes', () => {
    it('should return 400 status if user is unauthorized', async () => {
      const res = await request(server).get('/api/jokes');

      expect(res.status).toBe(400);
    });

    it('should return json', async () => {
      const res = await server.get('/api/jokes');

      expect(res.type).toBe('application/json');
    });
  });
});
