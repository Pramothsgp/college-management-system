import { uploadToS3 } from '../utils/s3uploader.util';
import { Images } from '../models/images.model';
import { User } from '../models/user.model';
import { v4 as uuidv4 } from 'uuid';
import { trainStudent } from './trainimages.service';
import { attendanceQueue } from 'queues/attendance.queue';

export const uploadFilesService = async (files: Express.Multer.File[], userId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const uploadedUrls: string[] = [];

    // Upload to S3 and save metadata to DB
    await Promise.all(
        files.map(async (file) => {
            const fileName = `${userId}_${uuidv4()}_${file.originalname}`;
            const url = await uploadToS3(file.buffer, fileName, file.mimetype);

            await Images.create({
                user: userId,
                url,
                originalName: file.originalname,
                mimeType: file.mimetype,
            });

            uploadedUrls.push(url);
        })
    );

    // Get latest existing PKL URL for the user (if any)
    const existingPkl = await Images.findOne({
        user: userId,
        mimeType: 'application/octet-stream',
        url: { $regex: /\.pkl$/ },
    }).sort({ createdAt: -1 });

    const existingPklUrl = existingPkl?.url;

    // Trigger training via Python service
    const trainResult = await trainStudent({
        imageUrl: uploadedUrls,
        studentName: userId, // using userId as studentName (can be customized)
        existingPklUrl,
    });

    if (trainResult.error) {
        throw new Error(`Training failed: ${trainResult.error}`);
    }

    // Store PKL file to DB as well
    if (!existingPklUrl) {
        await Images.create({
            user: userId,
            url: trainResult.s3Url,
            originalName: `${userId}.pkl`,
            mimeType: 'application/octet-stream',
        });
    }

    return {
        message: 'Images uploaded and training completed.',
        imageUrls: uploadedUrls,
        pklUrl: trainResult.s3Url,
    };
};

