import { Router } from 'express';
import { markAttendance, getAttendance, markAttendanceController } from '../controllers/attendance.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
const router = Router();

router.post('/', verifyAuth, markAttendance);
router.get('/:studentId', verifyAuth, getAttendance);
router.post('/mark-attendance' , upload.array('videos') , markAttendanceController);
export default router;