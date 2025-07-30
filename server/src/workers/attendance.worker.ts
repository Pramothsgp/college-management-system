
import { Worker } from 'bullmq';
import axios from 'axios';
import { redisConnection } from '../config/redis';

new Worker(
  'attendanceQueue',
  async job => {
    const { videoUrlList, pklUrls } = job.data;

    try {
      const response = await axios.post('http://15.207.35.217:5001/recognize', {
        videoUrlList,
        pklUrls,
      });

      const result = response.data;

      // You can now save `result` into MongoDB for retrieval
      console.log('Attendance result:', result);
      // e.g., await AttendanceModel.create({ videoUrlList, pklUrls, result });

    } catch (err : any) {
      console.error('Failed to mark attendance:', err.message);
    }
  },
  { connection: redisConnection }
);
