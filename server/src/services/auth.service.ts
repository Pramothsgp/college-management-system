import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';
import { generateToken } from '../utils/jwt.util';
import { Student } from '../models/student.model';

export const registerUser = async ({ email, password, role }: any) => {
  const hashed = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({ email, password: hashed, role });

  // If role is student, create corresponding Student doc
  if (role === 'student') {
    console.log('Creating student profile for user:', user._id);
    await Student.create({ user: user._id });
  }

  return { user };
};

export const loginUser = async ({ email, password }: any) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('User not found');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');
  const token = generateToken({ id: user._id, role: user.role });
  return { token };
};

export const deleteUser = async (userId: string) => {
  await User.findOneAndDelete({ _id: userId });
  return { message: 'User deleted successfully' };
};