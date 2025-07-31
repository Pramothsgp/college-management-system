import { Request, Response } from 'express';
import { uploadFilesService } from '../services/fileupload.service';

export const uploadFiles = async (req: Request, res: Response) => {
  const { files } = req;
  const user = (req as any).user;
  const userId = user ? user.id : null;
  try {
    if (!files || !(files instanceof Array) || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = await uploadFilesService(files, userId);
    return res.status(200).json({ message: 'Files uploaded successfully', fileUrls });

  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Upload failed' });
  }
};
