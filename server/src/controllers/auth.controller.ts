import { Request, Response } from 'express';
import { registerUser, loginUser, deleteUser } from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const data = await registerUser(req.body);
  res.json(data);
};

export const login = async (req: Request, res: Response) => {
  const data = await loginUser(req.body);
  res.json(data);
};

export const removeUser = async (req: Request, res: Response) => {
  const data = await deleteUser(req.params.userId);
  res.json(data);
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