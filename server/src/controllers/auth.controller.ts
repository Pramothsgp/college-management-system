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