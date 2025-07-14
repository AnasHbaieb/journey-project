import { Router } from "express";
import { uploadImage } from "../controleur/uploadController";
import multer from 'multer';
import path from 'path';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname); // Unique filename
    },
});

const upload = multer({ storage: storage });

router.post("/upload", upload.single('image'), uploadImage);

export default router; 