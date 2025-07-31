import { Request, Response } from 'express';
import { markAttendanceService, getAttendanceService } from '../services/attendance.service';

export const markAttendance = async (req: Request, res: Response) => {
  const data = await markAttendanceService(req.body);
  res.json(data);
};

export const getAttendance = async (req: Request, res: Response) => {
  const data = await getAttendanceService(req.params.studentId);
  res.json(data);
};