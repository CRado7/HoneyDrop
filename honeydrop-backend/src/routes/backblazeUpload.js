import express from 'express';
import multer from 'multer';
import { uploadToBackblaze } from '../utils/backblaze.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const publicUrl = await uploadToBackblaze(req.file.path, req.file.originalname);
    res.json({ url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

export default router;
