import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';
import { verifyAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/multer.middleware';
import { markAttendanceFromVideo } from '../services/attendance.service';
const router = Router();

router.post('/', verifyAuth, markAttendance);
router.get('/:studentId', verifyAuth, getAttendance);
router.post('/mark-attendance' , upload.array('videos') , markAttendanceFromVideo);
export default router;