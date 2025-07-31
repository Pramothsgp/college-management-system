import { uploadToS3 } from '../utils/s3uploader.util';
import { Images } from '../models/images.model';
import { User } from '../models/user.model'; // adjust if user schema path differs
import { v4 as uuidv4 } from 'uuid';

export const uploadFilesService = async (files: Express.Multer.File[], userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const fileName = `${userId}_${uuidv4()}_${file.originalname}`;
      const url = await uploadToS3(file.buffer, fileName, file.mimetype);

      await Images.create({
        user: userId,
        url,
        originalName: file.originalname,
        mimeType: file.mimetype,
      });

      return url;
    })
  );

  return uploadResults;
};
