
import { Worker } from 'bullmq';
import axios from 'axios';
import { redisConnection } from '../config/redis';

const attendanceWorker =  new Worker(
  'attendanceQueue',
  async job => {
    const { videoUrlList, pklUrls } = job.data;
    console.log("url" , videoUrlList, pklUrls);
    console.log('Processing job:', job.id);
    try {
      const response = await axios.post(`${process.env.IMAGE_PROCESSOR_URL}/recognize`, {
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


async function shutdown() {
  console.log('Closing attendance worker...');
  await attendanceWorker.close();  // This disconnects from Redis and stops processing
  console.log('Attendance worker closed.');
  process.exit(0);
}

// Listen for termination signals to close worker
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);