
import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';

let token = '';
let studentId = '';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI!);

  const regRes = await request(app).post('/api/auth/register').send({
    email: 'stud@example.com',
    password: 'pass1234',
    role: 'student'
  });
  studentId = regRes.body.user._id;

  const login = await request(app).post('/api/auth/login').send({
    email: 'stud@example.com',
    password: 'pass1234'
  });
  token = login.body.token;
});

afterAll(async () => {
  if (studentId) {
    await request(app).delete(`/api/auth/${studentId}`);
  }
  await mongoose.connection.close();
});

describe('Attendance APIs', () => {
  it('should mark attendance', async () => {
    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send({ studentId, date: '2025-07-30', sessions: { '1': 'Present', '3': 'Absent' } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('date', '2025-07-30');
  });

  it('should update attendance', async () => {
    const res = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send({ studentId, date: '2025-07-30', sessions: { '1': 'Present', '2': 'Absent' } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('date', '2025-07-30');
    // expect(res.body.sessions['2']).toBe('Absent');
    // expect(res.body.sessions['1']).toBe('Present');
    // expect(res.body.sessions['3']).toBe('Absent');
  });

  it('should fetch attendance', async () => {
    const res = await request(app)
      .get(`/api/attendance/${studentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});