import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  sessions: {
    type: Map,
    of: { type: String, enum: ['Present', 'Absent' , 'OD'] }, // 1: 'P', 2: 'A', ...
    default: {},
  },
});

export const Attendance = model('Attendance', attendanceSchema);