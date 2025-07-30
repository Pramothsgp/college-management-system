
import { Attendance } from '../models/attendance.model';
import { attendanceQueue } from '../queues/attendance.queue';
import  IORedis  from 'ioredis';
import { JobType, Queue } from 'bullmq';
export const getAttendanceJobStatus = async (jobId: string) => {
  const job = await attendanceQueue.getJob(jobId);
  
  if (!job) {
    throw new Error('Job not found');
  }

  const state = await job.getState();
  const progress = job.progress;
  
  // If completed, fetch the result from your database
  if (state === 'completed') {
    const result = await Attendance.findOne({ jobId });
    return {
      jobId,
      status: state,
      progress,
    //   result: result?.data,
    };
  }


  // If failed, include error information
  if (state === 'failed') {
    return {
      jobId,
      status: state,
      error: job.failedReason,
    };
  }

  return {
    jobId,
    status: state,
    progress,
  };
};



// ✅ Job Clearing Utility
const connection = new IORedis(); // or pass redis config

const attendanceQueue1 = new Queue('mark-attendance', { connection });

export const clearAttendanceQueue = async () => {
  const states: JobType[] = ['completed', 'failed', 'delayed', 'waiting', 'active'];

  for (const state of states) {
    const jobs = await attendanceQueue1.getJobs([state], 0, -1);
    for (const job of jobs) {
      await job.remove();
    }
  }

  const repeatableJobs = await attendanceQueue1.getRepeatableJobs();
  for (const repeatJob of repeatableJobs) {
    await attendanceQueue1.removeRepeatableByKey(repeatJob.key);
  }

  console.log('✅ All jobs cleared from attendanceQueue.');
};
