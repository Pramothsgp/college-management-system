
import { Worker } from 'bullmq';
import axios from 'axios';
import { redisConnection } from '../config/redis';
import { Result } from 'ioredis';
import { markAttendanceService } from '../services/attendance.service';

const attendanceWorker =  new Worker(
  'attendanceQueue',
  async job => {
    const { videoUrlList, pklUrls , session , date} = job.data;
    try {
      const response = await axios.post(`${process.env.IMAGE_PROCESSOR_URL}/recognize`, {
        videoUrlList,
        pklUrls,
      });

      const result = response.data;
      result[0].absent.forEach((id: string) => {
        markAttendanceService({ studentId: id, date, sessions : {[session] : 'Absent'} });
      });

      result[0].present.forEach((id: string) => {
        markAttendanceService({ studentId: id, date, sessions : {[session] : 'Present'} });
      });

      // e.g., await AttendanceModel.create({ videoUrlList, pklUrls, result });
      console.log('Attendance marked successfully:', job.id);
    } catch (err : any) {
      console.error('Failed to mark attendance:', err.message);
    }
  },
  { connection: redisConnection }
);


async function shutdown() {
  console.log('Closing attendance worker...');
  await attendanceWorker.close();  // This disconnects from Redis and stops processing
  console.log('Attendance worker closed.');
  process.exit(0);
}

// Listen for termination signals to close worker
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);