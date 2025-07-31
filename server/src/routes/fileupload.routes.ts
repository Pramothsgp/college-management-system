import { uploadFiles } from '../controllers/fileupload.controller';
import express from 'express';
import { upload } from '../middleware/multer.middleware';
import { verifyAuth } from '../middleware/auth.middleware';

const router =  express.Router();

router.post("/upload" , verifyAuth, upload.array("files") , uploadFiles);

export default router;