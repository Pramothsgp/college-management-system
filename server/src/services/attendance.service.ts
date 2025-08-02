import { Student } from '../models/student.model';
import { Attendance } from '../models/attendance.model';
import { attendanceQueue } from '../queues/attendance.queue';
import { uploadToS3 } from '../utils/s3uploader.util';
import { Images } from '../models/images.model';
import { v4 as uuidv4 } from 'uuid';
import { testMarkAttendanceDirectly } from './trainimages.service';

export const markAttendanceService = async ({ studentId, date, sessions }: any) => {
    const student = await Student.findById(studentId);
  const existing = await Attendance.findOne({ student: studentId, date });

  if (existing) {
    const mergedSessions = new Map(existing.sessions); // Copy existing
    for (const key in sessions) {
      mergedSessions.set(key, sessions[key]); // Merge manually
    }
    existing.sessions = mergedSessions;
    await existing.save();
    return existing;
  } else {
    const sessionMap = new Map(Object.entries(sessions));
    const newRecord = await Attendance.create({ student: studentId, date, sessions: sessionMap });
    return newRecord;
  }
};


export const getAttendanceOn = async (date: string) => {
  return await Attendance.find({ date : date });
};
export const getAttendanceService = async (studentId: string) => {
  return await Attendance.find({ student: studentId });
};



export const markAttendanceFromVideo = async (files: Express.Multer.File[] , session: string, date: string) => {
  if (!files || files.length === 0) {
    throw new Error('No video files provided.');
  }
  console.log(Array.isArray(files) ? `Received ${files.length} files` : 'Received a single file');
  const videoFiles = Array.isArray(files)
    ? files.filter(file => file.mimetype.startsWith('video/'))
    : [];

  // Upload video files to S3
  const videoUrlList = await Promise.all(
    videoFiles.map(async (file) => {
      const key = `${uuidv4()}_${file.originalname}`;
      return await uploadToS3(file.buffer, key, file.mimetype);
    })
  );

  // Fetch all .pkl file URLs from the DB
  const pklDocs = await Images.find({ url: { $regex: /\.pkl$/ } });
  const pklUrls = pklDocs.map(doc => ({ id: doc._id, url: doc.url }));

  if (pklUrls.length === 0) {
    throw new Error('No .pkl files found in the database.');
  } 

  // Add to background queue and get job instance
  const job = await attendanceQueue.add('mark-attendance', {
    videoUrlList,
    pklUrls,
    session,
    date,
  });

  // const result = await testMarkAttendanceDirectly(videoUrlList, pklUrls);
  // console.log('Test result:', result);
  // return result;

  return {
    message: 'Videos uploaded. Attendance marking is in progress.',
    jobId: job.id,  // Return the job ID for tracking
    videoCount: videoUrlList.length,
    pklCount: pklUrls.length,
    status: 'processing',
  };
};
