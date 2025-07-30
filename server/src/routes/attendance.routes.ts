import { Router } from 'express';
import { markAttendance, getAttendance } from '../controllers/attendance.controller';
import { verifyAuth } from '../middleware/auth.middleware';
const router = Router();

router.post('/', verifyAuth, markAttendance);
router.get('/:studentId', verifyAuth, getAttendance);

export default router;