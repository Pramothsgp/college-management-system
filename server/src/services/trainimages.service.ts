import axios from 'axios';
import { uploadToS3 } from '../utils/s3uploader.util';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const trainStudent = async ({
    imageUrl,
    studentName,
    existingPklUrl,
}: {
    imageUrl: string[];
    studentName: string;
    existingPklUrl?: string;
}) => {
    if (!imageUrl || imageUrl.length === 0) {
        throw new Error('No images provided for training');
    }

    const existingPklFilename = existingPklUrl
    ? path.basename(existingPklUrl)
    : undefined;

    console.log('Training with images:', imageUrl, 'for student:', studentName, 'existing PKL URL:', existingPklUrl);
    const response = await axios.post('http://15.207.35.217:5001/train', {
        imageUrl,
        studentName,
        existingPklUrl,
    });

    console.log('Training response:', response.data);
    const { embedding_base64, error } = response.data;
    if (error) return { error };

    const buffer = Buffer.from(embedding_base64, 'base64');
    const s3Url = await uploadToS3(buffer, `${existingPklFilename ?? uuidv4() + '.pkl'}`, 'application/octet-stream');

    return { message: 'Trained and uploaded', s3Url };
};

