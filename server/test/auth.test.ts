
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

let userId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);
});

afterAll(async () => {
  if (userId) {
    await request(app).delete(`/api/auth/${userId}`);
  }
  await mongoose.connection.close();
});

describe('Auth APIs', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'pass1234', role: 'student' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', 'test@example.com');
    userId = res.body.user._id;
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'pass1234' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});