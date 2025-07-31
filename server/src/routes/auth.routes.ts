import { Router } from 'express';
import { register, login, removeUser, registerInBulk } from '../controllers/auth.controller';
import { verifyAuth } from '../middleware/auth.middleware';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/:userId', removeUser);
router.post('/register-in-bulk', verifyAuth , registerInBulk);

export default router;