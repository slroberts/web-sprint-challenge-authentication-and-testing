const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig');

describe('server', () => {
  describe('POST /api/auth/login', () => {
    it('should return 200 on success', () => {
      return request(server)
        .post('/login')
        .send({ username: 'user1', password: 'password' })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
    it('should return a message with a welcome message and an auth token', () => {
      return request(server)
        .post('/login')
        .send({ username: 'user1', password: 'password' })
        .then((res) => {
          expect(res.body).toMatchObject({
            message: 'Welcome to the api',
            token: expect.any(String),
          });
        });
    });
  });

  describe('POST /api/auth/register', () => {
    beforeEach(async () => {
      await db('users').truncate();
    });

    it('should return 201 on success', () => {
      return request(server)
        .post('/register')
        .send({ username: 'user1', password: 'password' })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    it('should return a message with an id, a hashed password, and a username', () => {
      return request(server)
        .post('/register')
        .send({ username: 'user1', password: 'password' })
        .then((res) => {
          expect(res.body[0]).toMatchObject({
            id: expect.any(Number),
            password: expect.not.stringMatching('password'),
            username: 'user1',
          });
        });
    });
  });
  describe('GET to /api/jokes', () => {
    it('should return 500 status if user is unauthorized', () => {
      return request(server)
        .get('/api/jokes')
        .then((res) => {
          expect(res.status).toBe(500);
        });
    });
    it("should return an error message indicating why the user can't access it", () => {
      return request(server)
        .get('/api/jokes')
        .then((res) => {
          expect(res.body).toMatchObject({
            message: 'Error Fetching Jokes',
          });
        });
    });
  });
});
