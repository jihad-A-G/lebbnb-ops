import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Create unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '-');
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
// More lenient to accept browser-compressed images which may have generic MIME types
const imageFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  // Accept if extension matches (browser compression may change MIME type)
  // OR if MIME type matches (standard uploads)
  if (extname || mimetype) {
    console.log(`✓ Accepted file: ${file.originalname} (${file.mimetype})`);
    cb(null, true);
  } else {
    console.error(`✗ Rejected file: ${file.originalname} (${file.mimetype})`);
    cb(new Error(`Only image files are allowed. Got: ${file.originalname} with type ${file.mimetype}`));
  }
};

// Configure multer with optimized settings for concurrent uploads
export const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max per file
    files: 20, // Maximum 20 files per request (reduced for better performance)
    fieldSize: 2 * 1024 * 1024, // 2MB max field size
    parts: 25 // Maximum number of non-file fields
  }
});

// Utility function to delete file
export const deleteFile = (filename: string): void => {
  try {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      fs.unlinkSync(filePath);
      console.log(`🗑️  Deleted file: ${filename} (${sizeMB} MB)`);
    } else {
      console.warn(`⚠️  File not found, already deleted: ${filename}`);
    }
  } catch (error) {
    console.error(`❌ Error deleting file ${filename}:`, error);
  }
};

// Utility function to delete multiple files
export const deleteFiles = (filenames: string[]): void => {
  console.log(`\n🗑️  Deleting ${filenames.length} files...`);
  let deletedCount = 0;
  let totalSize = 0;
  
  filenames.forEach(filename => {
    try {
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    } catch (error) {
      console.error(`Error deleting ${filename}:`, error);
    }
  });
  
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`✅ Deleted ${deletedCount}/${filenames.length} files (${totalSizeMB} MB freed)\n`);
};
