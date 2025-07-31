import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const attendanceQueue = new Queue('attendanceQueue', {
  connection: redisConnection,
});
