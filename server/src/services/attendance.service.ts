import { Student } from '../models/student.model';
import { Attendance } from '../models/attendance.model';

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