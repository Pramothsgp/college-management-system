import { Request, Response } from 'express';
import { registerUser, loginUser, deleteUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required.' });
  }
  if (role !== 'student' && role !== 'teacher' && role !== 'admin') {
    return res.status(400).json({ error: 'Invalid role. Must be student, teacher, or admin.' });
  }
  try {
    const data = await registerUser({ email, password, role });
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  try {
    const data = await loginUser({ email, password });
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const data = await deleteUser(req.params.userId);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


export const registerInBulk = async (req : Request , res : Response) =>{
  const { users  , password , role} = req.body;
  const user  = (req as any).user;

  if(!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  if(!users || !Array.isArray(users) || users.length === 0) {
    return res.status(400).json({ error: 'Users array is required.' });
  }
  if(!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required.' });
  }
  if(!role || typeof role !== 'string') {
    return res.status(400).json({ error: 'Role is required.' });
  }
  try {
    const results = await Promise.all(users.map(user => registerUser({ email : user, password, role })));
    res.json({ users: results });
  } catch (error) {
    console.error('Error registering users:', error);
    res.status(500).json({ error: 'Failed to register users.' });
  }
}