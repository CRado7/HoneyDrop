import express from 'express';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ url: req.file.path, filename: req.file.filename });
});

export default router;
