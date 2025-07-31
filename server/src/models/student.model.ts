import { Schema, model } from 'mongoose';

const studentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  department: String,
  year: Number,
  rollNo: String,
});

export const Student = model('Student', studentSchema);