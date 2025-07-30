import { uploadFiles } from '../controllers/fileupload.controller';
import express from 'express';
import { upload } from '../middleware/multer.middleware';

const router =  express.Router();

router.post("/upload/:userId" , upload.array("files") , uploadFiles);

export default router;