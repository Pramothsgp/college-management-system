import { Student } from '../models/student.model';
import { Attendance } from '../models/attendance.model';
import { attendanceQueue } from '../queues/attendance.queue';
import { uploadToS3 } from '../utils/s3uploader.util';
import { Images } from '../models/images.model';
import { v4 as uuidv4 } from 'uuid';

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

export const getAttendanceService = async (studentId: string) => {
  return await Attendance.find({ student: studentId });
};




export const markAttendanceFromVideo = async (files: Express.Multer.File[]) => {
  if (!files || files.length === 0) {
    throw new Error('No video files provided.');
  }

  const videoFiles = files.filter(file => file.mimetype.startsWith('video/'));
  if (videoFiles.length === 0) {
    throw new Error('At least one video file is required.');
  }

  // Step 1: Upload video files to S3
  const videoUrlList = await Promise.all(
    videoFiles.map(async (file) => {
      const key = `${uuidv4()}_${file.originalname}`;
      return await uploadToS3(file.buffer, key, file.mimetype);
    })
  );

  // Step 2: Fetch all .pkl file URLs from the DB
  const pklDocs = await Images.find({ url: { $regex: /\.pkl$/ } });
  const pklUrls = pklDocs.map(doc => doc.url);

  if (pklUrls.length === 0) {
    throw new Error('No .pkl files found in the database.');
  }

  // Step 3: Add to background queue
  await attendanceQueue.add('mark-attendance', {
    videoUrlList,
    pklUrls,
  });

  return {
    message: 'Videos uploaded. Attendance marking is in progress.',
    videoCount: videoUrlList.length,
    pklCount: pklUrls.length,
    status: 'processing',
  };
};
