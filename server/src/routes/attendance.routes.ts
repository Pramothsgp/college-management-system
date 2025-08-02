import { Router } from 'express';
import { markAttendance, getAttendance, markAttendanceController, getAttendanceByDate } from '../controllers/attendance.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
const router = Router();

router.post('/', verifyAuth, markAttendance);
router.get('/student/:studentId', verifyAuth, getAttendance);
router.post('/mark-attendance' ,verifyAuth, upload.array('videos') , markAttendanceController);
router.get('/date', verifyAuth, getAttendanceByDate);
export default router;