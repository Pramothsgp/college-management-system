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
    const response = await axios.post(`${process.env.IMAGE_PROCESSOR_URL}/train`, {
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



export const testMarkAttendanceDirectly = async (
  videoUrlList: string[], 
  pklUrls: string[]
) => {
  try {
    console.log('Starting direct attendance marking test...');
    console.log('Video URLs:', videoUrlList);
    console.log('PKL URLs:', pklUrls);
    console.log('API URL:', `${process.env.IMAGE_PROCESSOR_URL}/recognize`);

    const startTime = Date.now();

    const response = await axios.post(
      `${process.env.IMAGE_PROCESSOR_URL}/recognize`,
      {
        videoUrlList,
        pklUrls,
      },
      {
        timeout: 600000, // 10 minutes timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': 'application/json',
        },
        // Log request progress
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
          console.log(`Upload Progress: ${percentCompleted}%`);
        },
      }
    );

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000; // in seconds

    const result = response.data;
    
    console.log('Attendance result:', result);
    console.log(`Processing completed in ${duration} seconds`);

    // Save to MongoDB if needed
    // await AttendanceModel.create({ videoUrlList, pklUrls, result });

    return {
      success: true,
      result,
      duration: `${duration} seconds`,
      timestamp: new Date(),
    };

  } catch (err: any) {
    console.error('Failed to mark attendance:', err.message);
    
    // More detailed error logging
    if (err.response) {
      console.error('Response error:', {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      });
    } else if (err.request) {
      console.error('Request error - no response received');
      console.error('Request details:', err.request);
    } else {
      console.error('Error setting up request:', err.message);
    }

    return {
      success: false,
      error: err.message,
      details: err.response?.data || 'No response data',
      timestamp: new Date(),
    };
  }
};