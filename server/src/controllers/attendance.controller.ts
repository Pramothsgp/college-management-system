import { Request, Response } from 'express';
import { markAttendanceService, getAttendanceService, markAttendanceFromVideo, getAttendanceOn } from '../services/attendance.service';

export const markAttendance = async (req: Request, res: Response) => {
  const { studentId, date, sessions } = req.body;
  if (!studentId || !date || !sessions) {
    return res.status(400).json({ error: 'Student ID, date, and sessions are required.' });
  }
  try {
    const data = await markAttendanceService({ studentId, date, sessions });
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAttendance = async (req: Request, res: Response) => {
  try {
    const data = await getAttendanceService(req.params.studentId);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAttendanceByDate = async (req: Request, res: Response) => {
  const date = req.query.date as string;
  console.log('Fetching attendance for date:', date);
  try{
    const attendance = await getAttendanceOn(date);
    res.json(attendance);
  } catch (error: any) {
    console.log('Error fetching attendance by date:', error);
    res.status(400).json({ error: error.message });
  }
};

export const markAttendanceController = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { session , date} = req.body;
    if(!session || !date) {
      return res.status(400).json({ error: 'Session and date are required.' });
    }
    const result = await markAttendanceFromVideo(files , session, date);
    res.json(result);
  } catch (error : any) {
    res.status(400).json({ error: error.message });
  }
}