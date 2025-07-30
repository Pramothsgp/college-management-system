import { Request, Response } from 'express';
import { markAttendanceService, getAttendanceService, markAttendanceFromVideo } from '../services/attendance.service';

export const markAttendance = async (req: Request, res: Response) => {
  const data = await markAttendanceService(req.body);
  res.json(data);
};

export const getAttendance = async (req: Request, res: Response) => {
  const data = await getAttendanceService(req.params.studentId);
  res.json(data);
};


export const markAttendanceController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const result = await markAttendanceFromVideo(files);
    res.json(result);
  } catch (error : any) {
    res.status(400).json({ error: error.message });
  }
}