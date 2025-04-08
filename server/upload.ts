import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';
import { Request } from 'express';
import { storage as dbStorage } from './storage';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
  },
});

// Filter function to only allow certain file types
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and PDF files are allowed.'));
  }
};

// Create the multer instance with configured options
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter,
});

// Function to save upload to database
export async function saveUploadToDatabase(file: Express.Multer.File, userId?: number) {
  const fileUrl = `/uploads/${file.filename}`;
  
  const uploadRecord = await dbStorage.createUpload({
    filename: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    url: fileUrl,
    uploadedBy: userId,
  });
  
  return uploadRecord;
}

// Function to delete file from disk and database
export async function deleteUploadFile(uploadId: number) {
  const upload = await dbStorage.getUpload(uploadId);
  
  if (!upload) {
    throw new Error('Upload not found');
  }
  
  // Delete file from disk
  const filePath = path.join(process.cwd(), 'public', upload.url);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  
  // Delete database record
  await dbStorage.deleteUpload(uploadId);
}