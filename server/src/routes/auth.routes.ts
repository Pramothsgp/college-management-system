import { Router } from 'express';
import { register, login, removeUser } from '../controllers/auth.controller';
const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/:userId', removeUser);

export default router;