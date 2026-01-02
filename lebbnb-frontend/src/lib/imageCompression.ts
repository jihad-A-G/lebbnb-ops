import imageCompression from 'browser-image-compression';

/**
 * Compression options for property images
 * Optimized for web display while maintaining good quality
 */
const COMPRESSION_OPTIONS = {
  maxSizeMB: 1, // Maximum file size in MB (1MB per image)
  maxWidthOrHeight: 1920, // Maximum dimension (1920px for Full HD)
  useWebWorker: true, // Use web worker for better performance
  fileType: 'image/jpeg', // Convert all to JPEG for better compression
  initialQuality: 0.8, // 80% quality - good balance
};

/**
 * Compress a single image file in the browser before upload
 * This significantly reduces upload time and bandwidth usage
 * 
 * @param file - The image file to compress
 * @param onProgress - Optional callback for compression progress (0-100)
 * @returns Compressed file ready for upload
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  try {
    const originalSize = file.size / 1024 / 1024; // Convert to MB
    
    console.log(`🗜️  Compressing: ${file.name} (${originalSize.toFixed(2)} MB)`);

    const compressedFile = await imageCompression(file, {
      ...COMPRESSION_OPTIONS,
      onProgress: onProgress,
    });

    const compressedSize = compressedFile.size / 1024 / 1024;
    const savedPercent = Math.round(((file.size - compressedFile.size) / file.size) * 100);

    console.log(
      `✓ Compressed: ${file.name} | ` +
      `${originalSize.toFixed(2)}MB → ${compressedSize.toFixed(2)}MB | ` +
      `Saved ${savedPercent}%`
    );

    return compressedFile;
  } catch (error) {
    console.error(`Error compressing ${file.name}:`, error);
    // Return original file if compression fails
    console.warn(`⚠️  Using original file: ${file.name}`);
    return file;
  }
}

/**
 * Compress multiple images in parallel
 * Shows total compression statistics
 * 
 * @param files - Array of image files to compress
 * @param onProgress - Optional callback with overall progress
 * @returns Array of compressed files
 */
export async function compressImages(
  files: File[],
  onProgress?: (current: number, total: number, percent: number) => void
): Promise<File[]> {
  const totalFiles = files.length;
  let completedFiles = 0;
  
  const totalOriginalSize = files.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024;
  
  console.log(`\n📦 Compressing ${totalFiles} images (${totalOriginalSize.toFixed(2)} MB total)...`);

  const startTime = Date.now();

  try {
    // Compress all images in parallel for maximum speed
    const compressedFiles = await Promise.all(
      files.map(async (file) => {
        const compressed = await compressImage(file, (progress) => {
          // Individual file progress not reported to avoid spam
        });
        
        completedFiles++;
        const overallPercent = Math.round((completedFiles / totalFiles) * 100);
        
        if (onProgress) {
          onProgress(completedFiles, totalFiles, overallPercent);
        }
        
        return compressed;
      })
    );

    const totalCompressedSize = compressedFiles.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024;
    const savedSize = totalOriginalSize - totalCompressedSize;
    const savedPercent = Math.round((savedSize / totalOriginalSize) * 100);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(
      `\n✅ Compression complete in ${duration}s:\n` +
      `   Original: ${totalOriginalSize.toFixed(2)} MB\n` +
      `   Compressed: ${totalCompressedSize.toFixed(2)} MB\n` +
      `   Saved: ${savedSize.toFixed(2)} MB (${savedPercent}%)\n`
    );

    return compressedFiles;
  } catch (error) {
    console.error('Error during batch compression:', error);
    // Return original files if batch compression fails
    return files;
  }
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Validate if file is an image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Filter and validate image files
 * Returns only valid image files and shows warnings for invalid ones
 */
export function filterImageFiles(files: File[]): File[] {
  const imageFiles: File[] = [];
  const invalidFiles: string[] = [];

  files.forEach(file => {
    if (isImageFile(file)) {
      imageFiles.push(file);
    } else {
      invalidFiles.push(file.name);
    }
  });

  if (invalidFiles.length > 0) {
    console.warn(`⚠️  Skipped ${invalidFiles.length} non-image files:`, invalidFiles);
  }

  return imageFiles;
}
